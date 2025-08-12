import { NextRequest, NextResponse } from 'next/server'
import { csrf } from '@/lib/security/csrf'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createRateLimitMiddleware, rateLimiters } from '@/lib/security/rate-limiter'


const schema = z.object({
  email: z.string().email('Invalid email address').max(100),
})

function generateCode(): string {
  const array = new Uint8Array(6)
  crypto.getRandomValues(array)
  return Array.from(array, b => b % 10).join('')
}

const guard = createRateLimitMiddleware(rateLimiters.twoFA)

export async function POST(request: NextRequest) {
  try {
    if (!csrf.verify(request)) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }
    const blocked = await guard(request)
    if (blocked) return blocked

    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: parsed.error.errors },
        { status: 400 }
      )
    }

    const email = parsed.data.email.toLowerCase().trim()
    const { data: users, error: findErr } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .limit(1)
    if (findErr) {
      console.error('Supabase find user error:', findErr)
      return NextResponse.json({ error: 'Resend failed' }, { status: 500 })
    }
    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    const userData = users[0] as { id: string }

    const code = generateCode()
    const expiry = new Date(Date.now() + 10 * 60 * 1000)

    const { error: upErr } = await supabaseAdmin
      .from('admin_users')
      .update({
        verification_code: code,
        verification_code_expires_at: expiry.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userData.id)
    if (upErr) {
      console.error('Supabase update code error:', upErr)
      return NextResponse.json({ error: 'Resend failed' }, { status: 500 })
    }

    const origin = new URL(request.url).origin
    const res = await fetch(`${origin}/api/send-verification-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, type: 'verification' }),
    })
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Verification code resent' })
  } catch (error) {
    console.error('login-resend error:', error)
    return NextResponse.json({ error: 'Resend failed' }, { status: 500 })
  }
}


