import { del } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { authManager } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    await authManager.requireAdmin()

    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'Blob URL is required' }, { status: 400 })
    }

    // Delete from Vercel Blob
    await del(url)

    return NextResponse.json({ 
      success: true, 
      message: 'Image deleted successfully from Vercel Blob'
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    const status = message.includes('Authentication') ? 401 : 500
    return NextResponse.json({ 
      error: 'Failed to delete image', 
      details: message 
    }, { status })
  }
}
