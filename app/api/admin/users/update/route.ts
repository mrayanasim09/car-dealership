import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { authManager } from '@/lib/auth-utils'
import { csrf } from '@/lib/security/csrf'
import { z } from 'zod'

const updateUserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  email: z.string().email('Invalid email address').max(100).optional(),
  role: z.enum(['viewer', 'admin', 'super_admin']).optional(),
  permissions: z.record(z.boolean()).optional(),
  is_active: z.boolean().optional(),
})

export async function PUT(request: NextRequest) {
  try {
    if (!csrf.verify(request)) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }
    const user = await authManager.requireAdmin()
    if (user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const body = await request.json()
    const parsed = updateUserSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: parsed.error.errors },
        { status: 400 }
      )
    }
    const { id, ...updateData } = parsed.data
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ success: true, user: data })
  } catch (err) {
    const message = (err as Error).message || 'Failed to update user'
    const status = message.includes('Authentication') ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}


