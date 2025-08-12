import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { authManager } from '@/lib/auth-utils'
import { csrf } from '@/lib/security/csrf'

export async function GET() {
  try {
    await authManager.requireAdmin()
    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ messages: data || [] })
  } catch (err) {
    const message = (err as Error).message || 'Failed to fetch messages'
    const status = message.includes('Authentication') ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!csrf.verify(request)) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }
    const user = await authManager.requireAdmin()
    if (!user.permissions?.canModerateReviews && user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const body = await request.json()
    const { id, status } = body as { id?: string; status?: string }
    if (!id || !status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 })
    }
    const { error } = await supabaseAdmin.from('contact_messages').update({ status }).eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = (err as Error).message || 'Failed to update message'
    const status = message.includes('Authentication') ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!csrf.verify(request)) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }
    const user = await authManager.requireAdmin()
    if (!user.permissions?.canDeleteReviews && user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
    const { error } = await supabaseAdmin.from('contact_messages').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = (err as Error).message || 'Failed to delete message'
    const status = message.includes('Authentication') ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}


