import { NextResponse } from 'next/server'
import { authManager } from '@/lib/auth-utils'
import { cookies } from 'next/headers'
import { jwtManager } from '@/lib/jwt-utils'

export async function POST() {
  try {
    // Call the auth manager logout
    await authManager.logoutAdmin()

    // Create response
    const response = NextResponse.json({ success: true })

    // Clear the session cookies
    response.cookies.set('am_tycoons_admin_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/'
    })
    response.cookies.set('am_tycoons_admin_refresh', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    })

    // Best-effort: blacklist current access/refresh JTI if present
    try {
      const accessToken = cookies().get('am_tycoons_admin_token')?.value
      if (accessToken) {
        const decoded = jwtManager.decodeToken(accessToken) as { jti?: string; exp?: number } | null
        if (decoded?.jti && decoded?.exp) {
          await jwtManager.blacklistJti(decoded.jti, decoded.exp)
        }
      }
      const refreshToken = cookies().get('am_tycoons_admin_refresh')?.value
      if (refreshToken) {
        const decoded = jwtManager.decodeToken(refreshToken) as { jti?: string; exp?: number } | null
        if (decoded?.jti && decoded?.exp) {
          await jwtManager.blacklistJti(decoded.jti, decoded.exp)
        }
      }
    } catch {}

    return response

  } catch (error) {
    console.error('Logout API error:', error)
    
    // Even if logout fails, clear the cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set('am_tycoons_admin_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    })
    response.cookies.set('am_tycoons_admin_refresh', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    })

    return response
  }
}

// Prevent other HTTP methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
} 