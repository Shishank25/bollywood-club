import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database/db'; 

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

  if (!fileUrl) throw new Error('CRM did not return a file URL');
  return fileUrl;
}

// ─── GET: Fetch all city pages ──────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const sql = `SELECT * FROM city_pages ORDER BY created_at DESC`;
    const result = await query(sql, []);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('[GET /api/admin/cities]', error);
    return NextResponse.json({ error: 'Failed to fetch city pages' }, { status: 500 });
  }
}

// ─── POST: Create or Update a city page ─────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const id = formData.get('id') as string | null; // If ID exists, it's an update
    const slug = formData.get('slug') as string;
    const title = formData.get('title') as string;
    const greeting = formData.get('greeting') as string | null;
    const content = formData.get('content') as string | null; // TipTap JSON string
    const footer_label = formData.get('footer_label') as string | null;
    const secondary_content = formData.get('secondary_content') as string | null;
    
    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and Slug are required' }, { status: 400 });
    }

    // Handle File Upload
    const file = formData.get('file') as File | null;
    const folder = 'cities';
    let imageUrl = formData.get('image_url') as string | null;

    try {
      if (file) imageUrl = await uploadToCRM(file, folder);
    } catch (uploadError: any) {
      return NextResponse.json({ error: uploadError.message }, { status: 502 });
    }

    let sql = '';
    let values: any[] = [];

    if (id) {
      // UPDATE existing city page
      sql = `
        UPDATE city_pages SET
          slug = $1, title = $2, greeting = $3, content = $4::jsonb, image_url = $5, 
          footer_label = $6, secondary_content = $7::jsonb, updated_at = CURRENT_TIMESTAMP
        WHERE id = $8 RETURNING *;
      `;
      values = [slug, title, greeting, content, imageUrl, footer_label, secondary_content, id];
    } else {
      // INSERT new city page
      sql = `
        INSERT INTO city_pages (
          slug, title, greeting, content, image_url, footer_label, secondary_content
        ) VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7::jsonb) RETURNING *;
      `;
      values = [slug, title, greeting, content, imageUrl, footer_label, secondary_content];
    }

    const result = await query(sql, values);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('[POST /api/admin/cities]', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Request failed' }, { status: 500 });
  }
}

// ─── DELETE: Remove a city page ─────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await query(`DELETE FROM city_pages WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/admin/cities]', error);
    return NextResponse.json({ error: 'Failed to delete city page' }, { status: 500 });
  }
}