import { NextRequest, NextResponse } from 'next/server'
import { createAdmin } from '@/lib/admin-utils'
import { AdminRole } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { email, password, role = 'super_admin' as AdminRole } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles: AdminRole[] = ['super_admin', 'admin', 'editor', 'viewer']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be one of: super_admin, admin, editor, viewer' },
        { status: 400 }
      )
    }

    // Create the admin with role-based permissions
    const admin = await createAdmin(email, password, role, 'system')

    // Return admin info (without password hash)
    const { id, email: savedEmail, role: savedRole, permissions, createdAt, updatedAt, createdBy } = admin
    return NextResponse.json({ success: true, message: `${role} created successfully`, admin: { id, email: savedEmail, role: savedRole, permissions, createdAt, updatedAt, createdBy } })

  } catch (error) {
    console.error('Admin setup error:', error)
    return NextResponse.json(
      { error: 'Failed to create admin' },
      { status: 500 }
    )
  }
}
