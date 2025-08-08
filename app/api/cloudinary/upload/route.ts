import { NextRequest, NextResponse } from 'next/server'
import { authManager } from '@/lib/auth-utils'
import { uploadImageToCloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    await authManager.requireAdmin()
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    // Upload to Cloudinary
    const imageUrl = await uploadImageToCloudinary(file)
    
    return NextResponse.json({ 
      success: true,
      url: imageUrl,
      message: 'Image uploaded successfully'
    })
  } catch (error: unknown) {
    console.error('Upload image error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (errorMessage.includes('Authentication required')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (errorMessage.includes('Insufficient permissions')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    if (errorMessage.includes('Cloudinary')) {
      return NextResponse.json(
        { error: 'Failed to upload image to Cloudinary. Please check your configuration.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
} 