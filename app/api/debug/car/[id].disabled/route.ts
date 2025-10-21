import { NextResponse } from 'next/server'

// This route is disabled and should not be processed
export const dynamic = 'force-dynamic'

export async function GET() {
  // This route is disabled - return error immediately
  return NextResponse.json({ 
    error: 'This debug route is disabled and not available' 
  }, { 
    status: 404 
  })
}
