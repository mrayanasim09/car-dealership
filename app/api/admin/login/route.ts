import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await authenticateAdmin(email, password)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials or not authorized as admin' },
        { status: 401 }
      )
    }

    const response = NextResponse.json(
      { 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      },
      { status: 200 }
    )

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 