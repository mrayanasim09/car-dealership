import { cookies } from 'next/headers'
import crypto from 'crypto'
import { NextRequest } from 'next/server'

const CSRF_COOKIE_NAME = 'csrf_token'

export function issueCsrfToken(): string {
  const token = crypto.randomBytes(16).toString('hex')
  cookies().set(CSRF_COOKIE_NAME, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60, // 1 hour
  })
  return token
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export function verifyCsrfToken(request: Request | NextRequest): boolean {
  try {
    const headerRaw = request.headers.get('x-csrf-token') || ''
    const header = safeDecode(headerRaw)

    // Handle both Request and NextRequest types
    let cookieRaw = ''
    if ('cookies' in request) {
      // NextRequest - use request.cookies
      cookieRaw = request.cookies.get(CSRF_COOKIE_NAME)?.value || ''
    } else {
      // Regular Request - use next/headers (for Server Components)
      cookieRaw = cookies().get(CSRF_COOKIE_NAME)?.value || ''
    }
    const cookie = safeDecode(cookieRaw)

    return Boolean(header) && Boolean(cookie) && header === cookie
  } catch {
    return false
  }
}

export const csrf = { issue: issueCsrfToken, verify: verifyCsrfToken }


