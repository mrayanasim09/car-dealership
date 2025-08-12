import { Admin, AdminRole, ROLE_PERMISSIONS, AdminPermissions } from './types'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase/admin'

// Local representation of the admin_users table
type AdminRow = {
  id: string
  email: string
  role: AdminRole
  password_hash: string
  permissions: AdminPermissions
  created_by?: string | null
  created_at: string
  updated_at: string
}

// Permission checking utilities
export function hasPermission(admin: Admin, permission: keyof AdminPermissions): boolean {
  return admin.permissions[permission] || false
}

export function requirePermission(admin: Admin, permission: keyof AdminPermissions): boolean {
  if (!hasPermission(admin, permission)) {
    throw new Error(`Insufficient permissions: ${permission} required`)
  }
  return true
}

export function canManageRole(currentAdmin: Admin, targetRole: AdminRole): boolean {
  // Super admins can manage anyone
  if (currentAdmin.role === 'super_admin') return true
  
  // Admins can only manage editors and viewers
  if (currentAdmin.role === 'admin' && ['editor', 'viewer'].includes(targetRole)) return true
  
  // Editors and viewers cannot manage anyone
  return false
}

export function getRolePermissions(role: AdminRole): AdminPermissions {
  return ROLE_PERMISSIONS[role]
}

// Admin management functions
export async function createAdmin(
  email: string, 
  password: string, 
  role: AdminRole, 
  createdBy: string
): Promise<Admin> {
  const passwordHash = await bcrypt.hash(password, 12)
  const permissions = getRolePermissions(role)
  
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .insert({
      email,
      password_hash: passwordHash,
      role,
      permissions,
      created_by: createdBy,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to create admin: ${error.message}`)
  
  const row = data as unknown as AdminRow
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    passwordHash: row.password_hash,
    permissions: row.permissions,
    createdBy: row.created_by || undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
  }
}

export async function updateAdminRole(
  adminId: string, 
  newRole: AdminRole
): Promise<Admin> {
  const permissions = getRolePermissions(newRole)
  
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .update({
      role: newRole,
      permissions,
      updated_at: new Date().toISOString()
    })
    .eq('id', adminId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update admin role: ${error.message}`)
  
  const row2 = data as unknown as AdminRow
  return {
    id: row2.id,
    email: row2.email,
    role: row2.role,
    passwordHash: row2.password_hash,
    permissions: row2.permissions,
    createdBy: row2.created_by || undefined,
    createdAt: new Date(row2.created_at),
    updatedAt: new Date(row2.updated_at)
  }
}

export async function deleteAdmin(adminId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('admin_users')
    .delete()
    .eq('id', adminId)

  if (error) throw new Error(`Failed to delete admin: ${error.message}`)
}

export async function getAdminById(adminId: string): Promise<Admin | null> {
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .eq('id', adminId)
    .single()

  if (error) return null
  
  const row3 = data as unknown as AdminRow
  return {
    id: row3.id,
    email: row3.email,
    role: row3.role,
    passwordHash: row3.password_hash,
    permissions: row3.permissions,
    createdBy: row3.created_by || undefined,
    createdAt: new Date(row3.created_at),
    updatedAt: new Date(row3.updated_at)
  }
}

export async function getAllAdmins(): Promise<Admin[]> {
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch admins: ${error.message}`)
  
  const rows = (data as unknown as AdminRow[])
  return rows.map(admin => ({
    id: admin.id,
    email: admin.email,
    role: admin.role,
    passwordHash: admin.password_hash,
    permissions: admin.permissions,
    createdBy: admin.created_by || undefined,
    createdAt: new Date(admin.created_at),
    updatedAt: new Date(admin.updated_at)
  }))
}

// Authentication helpers
export async function verifyAdminCredentials(email: string, password: string): Promise<Admin | null> {
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !data) return null
  
  const isValidPassword = await bcrypt.compare(password, (data as unknown as AdminRow).password_hash)
  if (!isValidPassword) return null
  
  const row4 = data as unknown as AdminRow
  return {
    id: row4.id,
    email: row4.email,
    role: row4.role,
    passwordHash: row4.password_hash,
    permissions: row4.permissions,
    createdBy: row4.created_by || undefined,
    createdAt: new Date(row4.created_at),
    updatedAt: new Date(row4.updated_at)
  }
}

export async function updateAdminLoginTime(adminId: string): Promise<void> {
  await supabaseAdmin
    .from('admin_users')
    .update({
      last_login_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', adminId)
}
