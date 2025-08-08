import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration - Only use environment variables for security
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImageToCloudinary(file: File): Promise<string> {
  try {
    // Check if required environment variables are set
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      throw new Error("Cloudinary cloud name not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME environment variable.")
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');
    formData.append('folder', 'car-images');

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinary.config().cloud_name}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    const result = await response.json();
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
}

export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary delete result:', result);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
}