import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { authManager } from '@/lib/auth-utils'

// Input validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address').max(100),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100)
})

// Rate limiting store (in production, use Redis)
const loginAttempts = new Map<string, { count: number; resetTime: number }>()

function checkLoginRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxAttempts = 5

  const record = loginAttempts.get(ip)
  
  if (!record || now > record.resetTime) {
    loginAttempts.set(ip, {
      count: 1,
      resetTime: now + windowMs
    })
    return true
  }

  if (record.count >= maxAttempts) {
    return false
  }

  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    
    // Check rate limiting
    if (!checkLoginRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { email, password } = validationResult.data

    // Sanitize inputs
    const sanitizedEmail = email.toLowerCase().trim()
    
    // Attempt login
    const user = await authManager.authenticateAdmin(sanitizedEmail, password)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        email: user.email,
        role: user.role
      }
    })

    // Set JWT token in HTTP-only cookie
    const token = authManager.createAuthToken(user)
    response.cookies.set('am_tycoons_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Login API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    let statusCode = 401
    let publicErrorMessage = 'Login failed. Please try again.'

    // Map specific errors to user-friendly messages
    if (errorMessage.includes('auth/user-not-found') || errorMessage.includes('auth/wrong-password')) {
      publicErrorMessage = 'Invalid email or password'
    } else if (errorMessage.includes('auth/too-many-requests')) {
      statusCode = 429
      publicErrorMessage = 'Too many login attempts. Please try again later.'
    } else if (errorMessage.includes('auth/network-request-failed')) {
      statusCode = 503
      publicErrorMessage = 'Network error. Please check your connection.'
    } else if (errorMessage.includes('Access denied')) {
      publicErrorMessage = 'Access denied. Admin privileges required.'
    } else if (errorMessage.includes('admin account is inactive')) {
      publicErrorMessage = 'Your admin account has been deactivated. Please contact support.'
    } else if (errorMessage.includes('Failed to establish secure session')) {
      statusCode = 500
      publicErrorMessage = 'Failed to establish secure session. Please try again.'
    }
    
    // Log detailed error for debugging while keeping user message generic
    console.error('Login error details:', {
      originalError: errorMessage,
      publicMessage: publicErrorMessage,
      statusCode,
      timestamp: new Date().toISOString()
    })
    
    return NextResponse.json(
      { 
        error: publicErrorMessage,
        code: statusCode === 401 ? 'AUTH_FAILED' : 
              statusCode === 429 ? 'RATE_LIMIT' :
              statusCode === 503 ? 'NETWORK_ERROR' : 'SERVER_ERROR'
      },
      { status: statusCode }
    )
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