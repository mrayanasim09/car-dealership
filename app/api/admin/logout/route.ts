import { NextResponse } from 'next/server'
import { authManager } from '@/lib/auth-utils'

export async function POST() {
  try {
    // Call the auth manager logout
    await authManager.logoutAdmin()

    // Create response
    const response = NextResponse.json({ success: true })

    // Clear the session cookie
    response.cookies.set('am_tycoons_admin_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Logout API error:', error)
    
    // Even if logout fails, clear the cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set('am_tycoons_admin_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
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