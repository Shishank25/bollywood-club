import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database/db'; // your existing db query utility

const CRM_UPLOAD_URL = process.env.CRM_API_URL
  ? `${process.env.CRM_API_URL}/api/media`
  : 'https://147.79.70.30.nip.io:8990/api/media';

// Helper function to handle sending files to your CRM
async function uploadToCRM(file: File, folder: string): Promise<string> {
  const crmForm = new FormData();
  crmForm.append('file', file);
  crmForm.append('folder', folder);

  const crmRes = await fetch(CRM_UPLOAD_URL, {
    method: 'POST',
    body: crmForm,
    headers: {
      ...(process.env.CRM_API_SECRET && {
        Authorization: `Bearer ${process.env.CRM_API_SECRET}`,
      }),
    },
  });

  if (!crmRes.ok) {
    const err = await crmRes.json().catch(() => ({}));
    throw new Error(err.error ?? 'CRM upload failed');
  }

  const crmData = await crmRes.json();
  const fileUrl = crmData.file?.url ?? crmData.url ?? null;

  if (!fileUrl) {
    throw new Error('CRM did not return a file URL');
  }

  return fileUrl;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // ── Extract fields ──────────────────────────────────────────────────────
    const folder        = (formData.get('folder') as string) || 'uploads';
    const pageRoute     = formData.get('pageRoute') as string;
    const htmlId        = formData.get('htmlId') as string;
    const mediaType     = (formData.get('mediaType') as string) || 'image';
    const altText       = formData.get('altText') as string | null;
    const width         = formData.get('width') ? Number(formData.get('width')) : null;
    const height        = formData.get('height') ? Number(formData.get('height')) : null;
    
    // Extract both potential files
    const file          = formData.get('file') as File | null;
    const thumbnailFile = formData.get('thumbnailFile') as File | null; // NEW

    // Use 'let' so we can overwrite these if files are uploaded
    let mediaUrl        = formData.get('mediaUrl') as string | null;
    let thumbnailUrl    = formData.get('thumbnailUrl') as string | null; 

    if (!pageRoute || !htmlId) {
      return NextResponse.json(
        { error: 'pageRoute and htmlId are required' },
        { status: 400 }
      );
    }

    // ── File Upload Handling ────────────────────────────────────────────────
    try {
      // 1. Upload Main File (if exists)
      if (file) {
        mediaUrl = await uploadToCRM(file, folder);
      }
      
      // 2. Upload Thumbnail File (if exists)
      if (thumbnailFile) {
        thumbnailUrl = await uploadToCRM(thumbnailFile, folder);
      }
    } catch (uploadError: any) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 502 }
      );
    }

    if (!mediaUrl) {
      return NextResponse.json(
        { error: 'Either a file or a mediaUrl must be provided' },
        { status: 400 }
      );
    }

    // ── Upsert into MediaAssets ─────────────────────────────────────────────
    const sql = `
      INSERT INTO "MediaAssets" (
        page_route,
        html_id,
        media_url,
        media_type,
        alt_text,
        width,
        height,
        thumbnail_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (page_route, html_id)
      DO UPDATE SET
        media_url     = EXCLUDED.media_url,
        media_type    = EXCLUDED.media_type,
        alt_text      = EXCLUDED.alt_text,
        width         = EXCLUDED.width,
        height        = EXCLUDED.height,
        thumbnail_url = EXCLUDED.thumbnail_url,
        updated_at    = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [pageRoute, htmlId, mediaUrl, mediaType, altText, width, height, thumbnailUrl];
    const result = await query(sql, values);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('[POST /api/admin/media]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Request failed' },
      { status: 500 }
    );
  }
}