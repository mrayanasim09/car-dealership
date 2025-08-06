// app/api/cloudinary/delete/route.ts
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'doifsytuh',
  api_key: process.env.CLOUDINARY_API_KEY || '643763252348165',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'WVB1AscpBsFl8L0VHMdoykC_S6s',
});

export async function POST(request: NextRequest) {
  try {
    const { publicId } = await request.json();
    
    if (!publicId) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
    }

    console.log('Deleting image with public ID:', publicId);
    
    // Delete from Cloudinary (public ID already includes folder path)
    const result = await cloudinary.uploader.destroy(publicId);
    
    console.log('Cloudinary delete result:', result);
    
    return NextResponse.json({ 
      success: true, 
      result: result 
    });
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return NextResponse.json({ 
      error: 'Failed to delete image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}