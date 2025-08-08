// app/api/cloudinary/delete/route.ts
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: 'doifsytuh',
  api_key: '643763252348165',
  api_secret: 'WVB1AscpBsFl8L0VHMdoykC_S6s',
});

export async function POST(request: NextRequest) {
  try {
    const { publicId } = await request.json();
    
    if (!publicId) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
    }

    console.log('Deleting image with public ID:', publicId);
    
    // Delete from car-images folder
    const result = await cloudinary.uploader.destroy(`car-images/${publicId}`);
    
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