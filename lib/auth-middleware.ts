import { NextRequest, NextResponse } from 'next/server'
import { jwtManager } from './jwt-utils'
import { config } from './config'

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

      // Verify JWT token
      const decoded = jwtManager.verifyToken(token)
      
      // Add user info to request
      const authenticatedReq = req as AuthenticatedRequest
      authenticatedReq.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        permissions: decoded.permissions
      }

      return handler(authenticatedReq)
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

      // Try to decode token to check if it's expired
      const decoded = jwtManager.decodeToken(token)
      
      if (decoded && decoded.exp) {
        const now = Math.floor(Date.now() / 1000)
        const timeUntilExpiry = decoded.exp - now
        
        // Refresh token if it expires in less than 5 minutes
        if (timeUntilExpiry < 300) {
          const newToken = jwtManager.refreshToken(token)
          
          const response = await handler(req as AuthenticatedRequest)
          
          // Set new token in response
          response.cookies.set('am_tycoons_admin_token', newToken, {
            httpOnly: true,
            secure: config.isProduction,
            sameSite: 'strict',
            maxAge: config.session.maxAge / 1000,
            path: '/',
            domain: config.isProduction ? '.amtycoons.com' : undefined
          })
          
          return response
        }
      }
      
      return handler(req as AuthenticatedRequest)
    } catch (error) {
      console.error('Token refresh error:', error)
      return handler(req as AuthenticatedRequest)
    }
  }
}
