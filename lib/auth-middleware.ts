import { NextRequest, NextResponse } from 'next/server'
import { jwtManager } from '@/lib/jwt-utils'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string
    email: string
    role: string
    permissions: string[]
  }
}

export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      const token = req.cookies.get('am_tycoons_admin_token')?.value

      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      const result = jwtManager.verifyAccessToken(token)
      if (!result.isValid || !result.payload) {
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
      }
      if (await jwtManager.isJtiBlacklisted((result.payload as { jti?: string }).jti)) {
        return NextResponse.json({ error: 'Token revoked' }, { status: 401 })
      }

      ;(req as AuthenticatedRequest).user = {
        userId: result.payload.userId,
        email: result.payload.email,
        role: result.payload.role,
        // flatten structured permissions to string keys permitted
        permissions: Object.entries(result.payload.permissions || {})
          .filter(([, allowed]) => Boolean(allowed))
          .map(([key]) => key)
      }

      return handler(req as AuthenticatedRequest)
    } catch (error) {
      console.error('Auth middleware error:', error)
      
      // Clear invalid cookies
      const response = NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
      
      response.cookies.delete('am_tycoons_admin_token')
      response.cookies.delete('am_tycoons_admin_session')
      
      return response
    }
  }
}

export function withRole(requiredRole: string) {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
    return withAuth(async (req: AuthenticatedRequest) => {
      const user = req.user!
      
      if (user.role !== requiredRole && user.role !== 'super_admin') {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }
      
      return handler(req)
    })
  }
}

export function withPermission(requiredPermission: string) {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
    return withAuth(async (req: AuthenticatedRequest) => {
      const user = req.user!
      
      if (!user.permissions.includes(requiredPermission) && user.role !== 'super_admin') {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }
      
      return handler(req)
    })
  }
}

export function refreshTokenMiddleware(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      const token = req.cookies.get('am_tycoons_admin_token')?.value
      
      if (!token) {
        return handler(req as AuthenticatedRequest)
      }

      const result = jwtManager.verifyAccessToken(token)
      if (result.isValid && result.payload) {
        if (!(await jwtManager.isJtiBlacklisted((result.payload as { jti?: string }).jti))) {
          ;(req as AuthenticatedRequest).user = {
            userId: result.payload.userId,
            email: result.payload.email,
            role: result.payload.role,
            permissions: Object.entries(result.payload.permissions || {})
              .filter(([, allowed]) => Boolean(allowed))
              .map(([key]) => key)
          }
        }
      }
      return handler(req as AuthenticatedRequest)
    } catch (error) {
      console.error('Token refresh error:', error)
      return handler(req as AuthenticatedRequest)
    }
  }
}
