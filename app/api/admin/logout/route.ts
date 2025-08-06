import { NextRequest, NextResponse } from 'next/server'
import { logoutAdmin } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    await logoutAdmin()
    
    return NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 