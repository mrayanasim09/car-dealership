import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { verifyRecaptcha } from '@/lib/security/recaptcha'
import { createRateLimitMiddleware, rateLimiters } from '@/lib/security/rate-limiter'
import { csrf } from '@/lib/security/csrf'

// Using Supabase (service role) instead of Firebase

// Firestore date conversion removed

// Input validation schema
const startSchema = z.object({
  email: z.string().email('Invalid email address').max(100),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  deviceId: z.string().optional(),
  recaptchaToken: z.string().optional(),
})

const guard = createRateLimitMiddleware(rateLimiters.adminLogin)

function generateCode(): string {
  const array = new Uint8Array(6)
  crypto.getRandomValues(array)
  return Array.from(array, b => b % 10).join('')
}

// Trusted device bypass removed: all logins require email verification code

export async function POST(request: NextRequest) {
  try {
    if (!csrf.verify(request)) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }
    const blocked = await guard(request)
    if (blocked) return blocked

    const body = await request.json()
    const parsed = startSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: parsed.error.errors },
        { status: 400 }
      )
    }

    const email = parsed.data.email.toLowerCase().trim()
    const password = parsed.data.password
    // const deviceId = parsed.data.deviceId // not used; all logins require verification now

    // Verify reCAPTCHA (v3)
    const remoteIp = request.headers.get('x-forwarded-for') || request.ip || undefined
    const recaptcha = await verifyRecaptcha(parsed.data.recaptchaToken, remoteIp, 'admin_login')
    if (!recaptcha.success) {
      return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 })
    }

    // Lookup admin user in Supabase
    const { data: users, error: findErr } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .order('updated_at', { ascending: false })
      .limit(5)
    if (findErr) {
      console.error('Supabase find user error:', findErr)
      return NextResponse.json({ error: 'Login failed' }, { status: 500 })
    }
    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }
    const userData = users[0] as {
      id: string
      email: string
      password_hash: string
      role?: string
      permissions?: unknown | null
      is_active?: boolean
      last_login?: string | null
      login_attempts?: number
      lockout_until?: string | null
      verification_code?: string | null
      verification_code_expires_at?: string | null
      trusted_devices?: string[]
    }

    // Check lockout
    const lockoutUntil = userData.lockout_until ? new Date(userData.lockout_until) : null
    if (lockoutUntil && new Date() < lockoutUntil) {
      const remaining = Math.ceil((lockoutUntil.getTime() - Date.now()) / 60000)
      return NextResponse.json({ error: `Account locked. Try again in ${remaining} minutes` }, { status: 423 })
    }

    const ok = await bcrypt.compare(password, userData.password_hash)
    if (!ok) {
      const newAttempts = (userData.login_attempts || 0) + 1
      const { error: upErr } = await supabaseAdmin
        .from('admin_users')
        .update({
          login_attempts: newAttempts,
          lockout_until: newAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userData.id)
      if (upErr) console.error('Supabase update attempts error:', upErr)
      if (newAttempts >= 5) {
        return NextResponse.json({ error: 'Too many failed attempts. Account locked for 15 minutes' }, { status: 423 })
      }
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Trusted device bypass removed: proceed to email verification for all logins

    // Unknown device: Generate and store verification code
    const code = generateCode()
    const expiry = new Date(Date.now() + 10 * 60 * 1000)
    const { data: updatedRows, error: upCodeErr } = await supabaseAdmin
      .from('admin_users')
      .update({
        verification_code: code,
        verification_code_expires_at: expiry.toISOString(),
        login_attempts: 0,
        lockout_until: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userData.id)
      .select('id')
      .limit(1)
    if (upCodeErr || !updatedRows || updatedRows.length === 0) {
      console.error('Supabase set code error:', upCodeErr)
      return NextResponse.json({ error: 'Login failed' }, { status: 500 })
    }

    // Send email via existing route
    const origin = new URL(request.url).origin
    await fetch(`${origin}/api/send-verification-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, type: 'verification' }),
    })

    // Even if email service is down, keep the code in DB and let user proceed to verify
    // Client will handle showing instructions if email couldn't be sent

    return NextResponse.json({ success: true, requiresEmailVerification: true, message: 'Verification code sent' })
  } catch (error) {
    console.error('login-start error:', error)
    return NextResponse.json({ error: 'Login failed', details: (error as Error).message }, { status: 500 })
  }
}


