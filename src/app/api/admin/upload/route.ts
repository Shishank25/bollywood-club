import { uploadImage } from '@/lib/imageUpload';
import { NextRequest, NextResponse } from 'next/server';
import { unlink, readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/avif',
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
];

// POST /api/admin/upload — upload a file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type "${file.type}" is not allowed. Only images and videos are accepted.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File exceeds the 30MB size limit (received ${(file.size / 1024 / 1024).toFixed(1)}MB)` },
        { status: 400 }
      );
    }

    const result = await uploadImage(file, { folder });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}

// GET /api/admin/upload — list all uploaded files
export async function GET() {
  try {
    const files = await readdir(UPLOAD_DIR);
    const fileDetails = await Promise.all(
      files
        .filter((f) => !f.startsWith('.'))
        .map(async (fileName) => {
          const filePath = path.join(UPLOAD_DIR, fileName);
          const fileStats = await stat(filePath);
          const ext = path.extname(fileName).toLowerCase();
          const isVideo = ['.mp4', '.webm', '.ogg', '.mov'].includes(ext);

          return {
            name: fileName,
            url: `/uploads/${fileName}`,
            type: isVideo ? 'video' : 'image',
            size: fileStats.size,
            uploadedAt: fileStats.birthtime.toISOString(),
          };
        })
    );

    // Sort newest first
    fileDetails.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    return NextResponse.json({ files: fileDetails });
  } catch (error) {
    console.error('List error:', error);
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
  }
}

// DELETE /api/admin/upload — delete a file by name
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('name');

    if (!fileName) {
      return NextResponse.json({ error: 'No filename provided' }, { status: 400 });
    }

    // Security: prevent path traversal
    const safeName = path.basename(fileName);
    const filePath = path.join(UPLOAD_DIR, safeName);

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    await unlink(filePath);

    return NextResponse.json({ success: true, deleted: safeName });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}