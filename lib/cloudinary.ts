// @ts-expect-error - Cloudinary types
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration - these will be used server-side only
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'doifsytuh',
  api_key: process.env.CLOUDINARY_API_KEY || '643763252348165',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'WVB1AscpBsFl8L0VHMdoykC_S6s',
});

// Utility functions for Cloudinary operations
export const uploadImageToCloudinary = async (file: File, folder: string = 'car-images'): Promise<string> => {
  try {
    // Convert file to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

export const uploadMultipleImagesToCloudinary = async (files: File[], folder: string = 'car-images'): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadImageToCloudinary(file, folder));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading multiple images to Cloudinary:', error);
    throw new Error('Failed to upload images to Cloudinary');
  }
};

export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

export const getCloudinaryPublicId = (url: string): string | null => {
  try {
    // Extract public ID from Cloudinary URL
    const match = url.match(/\/v\d+\/([^\/]+)\./);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting Cloudinary public ID:', error);
    return null;
  }
};

export default cloudinary;