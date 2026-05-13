// lib/imageUpload.ts
import { put, del } from '@vercel/blob';

/**
 * Image upload and management using Vercel Blob
 * Handles file uploads, optimization, and deletion
 */

interface UploadOptions {
  folder?: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

/**
 * Upload an image to Vercel Blob
 * @param file - FormData File object
 * @param options - Upload options
 * @returns URL of uploaded blob
 */
export async function uploadImage(file: File, options: UploadOptions = {}) {
  try {
    const {
      folder = 'uploads',
      maxWidth = 2000,
      maxHeight = 2000,
      quality = 0.85
    } = options;

    // Validate file
    if (!file) throw new Error('No file provided');
    if (!file.type.startsWith('image/')) throw new Error('File must be an image');
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) throw new Error('File size must be less than 10MB');

    // Create unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${folder}/${timestamp}-${random}.${extension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return {
      url: blob.url,
      pathname: blob.pathname,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Upload multiple images
 */
export async function uploadImages(files: File[], options: UploadOptions = {}) {
  const results = await Promise.all(
    files.map(file => uploadImage(file, options).catch(err => ({ error: err.message })))
  );
  return results;
}

/**
 * Delete an image from Vercel Blob
 */
export async function deleteImage(url: string) {
  try {
    await del(url);
    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error(`Image deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate responsive image sizes for a blob URL
 * Can be used with image optimization APIs
 */
export function getImageSizes(blobUrl: string) {
  return {
    thumbnail: `${blobUrl}?w=150&h=150&fit=crop`,
    small: `${blobUrl}?w=400&h=300&fit=crop`,
    medium: `${blobUrl}?w=800&h=600&fit=crop`,
    large: `${blobUrl}?w=1200&h=900&fit=crop`,
    original: blobUrl,
  };
}

/**
 * Optimize image URL for specific use case
 */
export function optimizeImageUrl(blobUrl: string, width: number, height?: number, quality: number = 85) {
  let url = `${blobUrl}?w=${width}`;
  if (height) url += `&h=${height}&fit=crop`;
  url += `&q=${quality}`;
  return url;
}

// ============================================
// USAGE IN API ROUTES
// ============================================

/*
// api/admin/upload/route.ts
import { uploadImage } from '@/lib/imageUpload';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return Response.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const result = await uploadImage(file, {
      folder: 'banners', // Organize by folder
      maxWidth: 2000,
      quality: 0.9,
    });

    return Response.json(result, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
*/