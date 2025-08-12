import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { jwtManager } from '@/lib/jwt-utils'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { csrf } from '@/lib/security/csrf'

const createSchema = z.object({
  email: z.string().email().max(100),
  password: z.string().min(8).max(100),
  role: z.enum(['super_admin', 'admin', 'editor', 'viewer']).default('admin'),
  permissions: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    if (!csrf.verify(request)) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }
    // Require super_admin
    const token = request.cookies.get('am_tycoons_admin_token')?.value
    const result = token ? jwtManager.verifyAccessToken(token) : { isValid: false }
    if (!result.isValid || !result.payload || result.payload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.errors }, { status: 400 })
    }

    const email = parsed.data.email.toLowerCase().trim()

    // Ensure unique
    const { data: existing, error: existErr } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('email', email)
      .limit(1)
    if (existErr) {
      console.error('Supabase existing check error:', existErr)
      return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 })
    }
    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'Admin user already exists' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12)
    const { data: inserted, error: insErr } = await supabaseAdmin
      .from('admin_users')
      .insert({
        email,
        password_hash: passwordHash,
        role: parsed.data.role,
        permissions: parsed.data.permissions || [],
        is_active: true,
        email_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('id')
      .limit(1)

    if (insErr || !inserted || inserted.length === 0) {
      console.error('Supabase insert admin error:', insErr)
      return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: inserted[0].id })
  } catch (error) {
    console.error('add-admin error:', error)
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 })
  }
}
