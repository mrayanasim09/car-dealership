import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Generate a per-request nonce using Web Crypto (Edge runtime safe)
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  const nonce = btoa(binary)
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Auto-redirect authenticated users away from login
  if (path === '/admin/login') {
    const jwtToken = request.cookies.get('am_tycoons_admin_token')?.value
    if (jwtToken) {
      try {
        const parts = jwtToken.split('.')
        if (parts.length >= 2) {
          let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
          const pad = base64.length % 4
          if (pad) base64 += '='.repeat(4 - pad)
          const payloadJson = atob(base64)
          const payload = JSON.parse(payloadJson) as { exp?: number; twoFactorVerified?: boolean }
          if (payload.exp && Math.floor(Date.now() / 1000) <= payload.exp && payload.twoFactorVerified) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
          }
        }
      } catch {}
    }
  }

  // Check if the path starts with /admin
  if (path.startsWith('/admin') && path !== '/admin/login') {
    // Prefer new JWT cookie
    const jwtToken = request.cookies.get('am_tycoons_admin_token')?.value
    if (!jwtToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    // Lightweight decode to check expiry and 2FA in Edge runtime (no signature verification here)
    try {
      const parts = jwtToken.split('.')
      if (parts.length < 2) throw new Error('bad token')
      let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
      const pad = base64.length % 4
      if (pad) base64 += '='.repeat(4 - pad)
      const payloadJson = atob(base64)
      const payload = JSON.parse(payloadJson) as { exp?: number; twoFactorVerified?: boolean }
      if (!payload.exp || Math.floor(Date.now() / 1000) > payload.exp) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
      // If verification flag cookie is present, allow one-time pass even if token payload lacks the 2FA bit yet
      const hasVerifiedFlag = request.cookies.get('am_tycoons_admin_verified')?.value === '1'
      if (!payload.twoFactorVerified && !hasVerifiedFlag) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    } catch (e) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  const response = NextResponse.next({ request: { headers: requestHeaders } })
  // do not leak auth state via headers
  
  // Ensure CSRF token cookie exists for admin pages and admin API routes (double submit pattern)
  const adminPath = request.nextUrl.pathname
  const isAdminArea = adminPath.startsWith('/admin') || adminPath.startsWith('/api/admin')
  const hasCsrf = request.cookies.get('csrf_token')?.value
  if (!hasCsrf && isAdminArea) {
    const csrfBytes = new Uint8Array(16)
    crypto.getRandomValues(csrfBytes)
    // URL-safe base64 without padding, avoid spread on Uint8Array for downlevel targets
    let raw = ''
    for (let i = 0; i < csrfBytes.length; i++) {
      raw += String.fromCharCode(csrfBytes[i])
    }
    const csrfToken = btoa(raw).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
    response.cookies.set('csrf_token', csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60,
    })
  }
  response.headers.set('Content-Security-Policy', [
    "default-src 'self'",
    // No 'unsafe-inline' in scripts; allow only nonce'd inline scripts and specific hosts
    `script-src 'self' 'nonce-${nonce}' https://vercel.live https://va.vercel-scripts.com https://www.googletagmanager.com https://www.google-analytics.com https://apis.google.com https://www.google.com https://www.gstatic.com`,
    // Keep 'unsafe-inline' for styles for now to avoid breaking inline style attributes used by some components
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    // Remove broad https: wildcard from images; allow only needed sources plus data: and blob:
    "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://www.google-analytics.com https://region1.google-analytics.com https://maps.gstatic.com https://*.googleusercontent.com",
    "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://vercel.live https://*.supabase.co wss://*.supabase.co https://www.google.com https://maps.googleapis.com",
    "frame-src 'self' https://www.google.com https://*.google.com https://*.google.com/maps https://*.google.com/maps/embed",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "report-to csp-endpoint",
    "upgrade-insecure-requests",
  ].join('; '))
  response.headers.set('x-nonce', nonce)
  response.headers.set('Reporting-Endpoints', 'csp-endpoint="/api/csp-report"')
  return response
}
 
// See "Matching Paths" below to learn more
export const config = {
  // Apply to all routes except Next.js internals and common static assets
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)'
  ],
}

