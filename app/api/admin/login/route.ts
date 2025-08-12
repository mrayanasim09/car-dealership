import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createRateLimitMiddleware, rateLimiters } from '@/lib/security/rate-limiter'
// legacy login endpoint not used

// Input validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address').max(100),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100)
})

const guard = createRateLimitMiddleware(rateLimiters.adminLogin)

export async function POST(request: NextRequest) {
  try {
    const blocked = await guard(request)
    if (blocked) return blocked

    // Parse and validate request body
    const body = await request.json()
    
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Use /api/admin/login-start' }, { status: 400 })

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