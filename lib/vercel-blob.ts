import { put, del } from '@vercel/blob';

export async function uploadImageToBlob(file: File): Promise<string> {
  try {
    // Check if required environment variables are set
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("Vercel Blob token not configured. Please set BLOB_READ_WRITE_TOKEN environment variable.")
    }

    // Generate a unique filename with timestamp to avoid conflicts
    const timestamp = Date.now()
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `car-images/${timestamp}-${cleanFileName}`

    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true, // Adds random suffix for uniqueness
    });

    if (process.env.NODE_ENV !== 'production') console.log(`✅ Image uploaded to Vercel Blob: ${blob.url}`);
    return blob.url;
  } catch (error) {
    console.error("❌ Error uploading image to Vercel Blob:", error);
    throw error;
  }
}

export async function deleteImageFromBlob(url: string): Promise<void> {
  try {
    await del(url);
    if (process.env.NODE_ENV !== 'production') console.log(`✅ Image deleted from Vercel Blob: ${url}`);
  } catch (error) {
    console.error("❌ Error deleting image from Vercel Blob:", error);
    throw error;
  }
}

// Upload multiple images
export async function uploadMultipleImages(files: File[]): Promise<string[]> {
  try {
    const uploadPromises = files.map(file => uploadImageToBlob(file));
    const urls = await Promise.all(uploadPromises);
    if (process.env.NODE_ENV !== 'production') console.log(`✅ Uploaded ${urls.length} images to Vercel Blob`);
    return urls;
  } catch (error) {
    console.error("❌ Error uploading multiple images to Vercel Blob:", error);
    throw error;
  }
}
