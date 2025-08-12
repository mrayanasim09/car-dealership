
import { cookies } from 'next/headers'
import { jwtManager } from '@/lib/jwt-utils'
import type { AdminPermissions } from '@/lib/types'

export interface AdminUser {
  id: string
  email: string
  role: 'super_admin' | 'admin' | 'editor' | 'viewer'
  permissions?: AdminPermissions
  lastLogin?: Date
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('am_tycoons_admin_token')?.value
    let accessToken = token

    // Attempt verification; if invalid try refresh via refresh token
    let result = accessToken ? jwtManager.verifyAccessToken(accessToken) : { isValid: false }
    if (!result.isValid || !result.payload) {
      const refresh = cookieStore.get('am_tycoons_admin_refresh')?.value
      if (refresh) {
        const refreshed = jwtManager.refreshAccessToken(refresh)
        if (refreshed && refreshed.accessToken) {
          accessToken = refreshed.accessToken
          // Persist new tokens
          cookieStore.set('am_tycoons_admin_token', accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60,
          })
          if (refreshed.newRefreshToken) {
            cookieStore.set('am_tycoons_admin_refresh', refreshed.newRefreshToken, {
              httpOnly: true,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
              path: '/',
              maxAge: 7 * 24 * 60 * 60,
            })
          }
          result = jwtManager.verifyAccessToken(accessToken)
        }
      }
    }

    if (!result.isValid || !result.payload) return null

    // Reject if blacklisted (hard invalidation before exp)
    if (await jwtManager.isJtiBlacklisted((result.payload as unknown as { jti?: string }).jti)) {
      return null
    }

    const { userId, email, role, permissions } = result.payload
    return {
      id: userId,
      email,
      role: role as AdminUser['role'],
      permissions: permissions as AdminPermissions,
    }
  } catch {
    return null
  }
}

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getCurrentAdmin()
  if (!admin) {
    throw new Error('Authentication required')
  }
  return admin
}

export async function logoutAdmin(): Promise<void> {
  // Stateless JWT; cookie is cleared in API route
  return
}

export const authManager = {
  getCurrentAdmin,
  requireAdmin,
  logoutAdmin,
}