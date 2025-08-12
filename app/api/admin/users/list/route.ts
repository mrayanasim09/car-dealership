import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { jwtManager } from '@/lib/jwt-utils'

// This route reads cookies and must always be dynamic
export const dynamic = 'force-dynamic'

// Supabase used instead of Firebase

export async function GET(request: NextRequest) {
  try {
    // AuthZ: super_admin or admin can list users (but admins see limited fields)
    const token = request.cookies.get('am_tycoons_admin_token')?.value
    const result = token ? jwtManager.verifyAccessToken(token) : { isValid: false }
    if (!result.isValid || !result.payload) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const requesterRole = result.payload.role

    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, email, role, permissions, is_active, last_login')
      .order('created_at', { ascending: false })
    if (error) throw error
    type Row = { id: string; email: string; role: string; permissions?: string[]; is_active?: boolean; last_login?: string | null }
    const users = ((data || []) as Row[]).map((row) => ({
      id: row.id,
      email: row.email,
      role: row.role,
      permissions: row.permissions || [],
      isActive: row.is_active !== false,
      lastLogin: row.last_login || null,
    }))
    // If requester is admin, hide permissions array in response
    const sanitized = requesterRole === 'super_admin' ? users : users.map(u => ({ id: u.id, email: u.email, role: u.role, isActive: u.isActive, lastLogin: u.lastLogin }))
    return NextResponse.json({ success: true, users: sanitized })
  } catch (error) {
    console.error('users/list error:', error)
    return NextResponse.json({ error: 'Failed to list users' }, { status: 500 })
  }
}


