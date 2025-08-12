import { NextRequest, NextResponse } from 'next/server'
import { jwtManager } from '@/lib/jwt-utils'

export async function GET(request: NextRequest) {
  try {
    // If access token present and valid, return user data
    const accessToken = request.cookies.get('am_tycoons_admin_token')?.value
    if (accessToken) {
      const result = jwtManager.verifyAccessToken(accessToken)
      if (result.isValid && result.payload) {
        const { email, role, permissions } = result.payload
        return NextResponse.json({ authenticated: true, email, role, permissions })
      }
    }

    // Fallback: try to refresh using refresh token
    const refreshToken = request.cookies.get('am_tycoons_admin_refresh')?.value
    if (refreshToken) {
      const refreshResult = jwtManager.verifyRefreshToken(refreshToken)
      if (refreshResult.isValid && refreshResult.payload) {
        const { email, role, permissions } = refreshResult.payload
        const refreshed = jwtManager.refreshAccessToken(refreshToken)
        if (refreshed) {
          const response = NextResponse.json({ authenticated: true, email, role, permissions })
          const isHttps = (request.headers.get('x-forwarded-proto') || new URL(request.url).protocol).toString().includes('https')
          response.cookies.set('am_tycoons_admin_token', refreshed.accessToken, {
            httpOnly: true,
            secure: isHttps,
            sameSite: 'lax',
            maxAge: 60 * 60,
            path: '/',
          })
          if (refreshed.newRefreshToken) {
            response.cookies.set('am_tycoons_admin_refresh', refreshed.newRefreshToken, {
              httpOnly: true,
              secure: isHttps,
              sameSite: 'lax',
              maxAge: 7 * 24 * 60 * 60,
              path: '/',
            })
          }
          return response
        }
      }
    }

    // Not authenticated
    return NextResponse.json({ authenticated: false }, { status: 200 })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 })
  }
}


