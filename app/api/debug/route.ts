import { NextRequest, NextResponse } from 'next/server'
import { authManager } from '@/lib/auth-utils'

// Disable caching for this API route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Check authentication
    await authManager.requireAdmin()
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      firebase: {
        configured: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      },
      cloudinary: {
        configured: !!process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      }
    }
    
    return NextResponse.json(debugInfo)
  } catch (error: unknown) {
    console.error('Debug route error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (errorMessage.includes('Authentication required')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (errorMessage.includes('Insufficient permissions')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    return NextResponse.json(
      { error: 'Debug access failed' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    await authManager.requireAdmin()
    
    const body = await request.json()
    
    // Add your debug logic here
    // Log only in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Debug POST request:', body)
    }
    
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Debug POST error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (errorMessage.includes('Authentication required')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (errorMessage.includes('Insufficient permissions')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    return NextResponse.json(
      { error: 'Debug operation failed' },
      { status: 500 }
    )
  }
}

