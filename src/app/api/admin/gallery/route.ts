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

// ─── GET: Fetch all gallery posts ──────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sort = searchParams.get('sort') || 'display_order';
    
    const allowedSorts = ['display_order', 'created_at', 'event_date', 'updated_at'];
    const orderBy = allowedSorts.includes(sort) ? sort : 'display_order';
    const direction = sort === 'display_order' ? 'ASC' : 'DESC';

    const sql = `SELECT * FROM gallery_posts ORDER BY ${orderBy} ${direction}`;
    const result = await query(sql, []);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('[GET /api/admin/gallery]', error);
    return NextResponse.json({ error: 'Failed to fetch gallery posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const id = formData.get('id') as string | null; // If ID exists, it's an update
    const title = formData.get('title') as string;
    const type = formData.get('type') as string;
    const location = formData.get('location') as string | null;
    const caption = formData.get('caption') as string | null;
    const category = formData.get('category') as string | null;
    const is_featured = formData.get('is_featured') === 'true';
    const display_order = parseInt(formData.get('display_order') as string) || 0;
    const slug = formData.get('slug') as string | null;
    const event_date = formData.get('event_date') ? formData.get('event_date') as string : null;
    
    // NEW: Extract redirect_link
    const redirect_link = formData.get('redirect_link') as string | null; 

    if (!title || !type) {
      return NextResponse.json({ error: 'Title and Type are required' }, { status: 400 });
    }

    // Handle Files
    const file = formData.get('file') as File | null;
    const thumbnailFile = formData.get('thumbnailFile') as File | null;
    const folder = 'gallery';

    let mediaUrl = formData.get('media_url') as string | null;
    let thumbnailUrl = formData.get('thumbnail_url') as string | null; 

    try {
      if (file) mediaUrl = await uploadToCRM(file, folder);
      if (thumbnailFile) thumbnailUrl = await uploadToCRM(thumbnailFile, folder);
    } catch (uploadError: any) {
      return NextResponse.json({ error: uploadError.message }, { status: 502 });
    }

    if (!mediaUrl) {
      return NextResponse.json({ error: 'A media file or media_url is required' }, { status: 400 });
    }

    let sql = '';
    let values: any[] = [];

    if (id) {
      // UPDATE existing post (added redirect_link as $12, pushed id to $13)
      sql = `
        UPDATE gallery_posts SET
          title = $1, location = $2, type = $3, media_url = $4, thumbnail_url = $5,
          caption = $6, category = $7, is_featured = $8, display_order = $9,
          slug = $10, event_date = $11, redirect_link = $12, updated_at = CURRENT_TIMESTAMP
        WHERE id = $13 RETURNING *;
      `;
      values = [title, location, type, mediaUrl, thumbnailUrl, caption, category, is_featured, display_order, slug, event_date, redirect_link, id];
    } else {
      // INSERT new post (added redirect_link as $12)
      sql = `
        INSERT INTO gallery_posts (
          title, location, type, media_url, thumbnail_url, caption, category, is_featured, display_order, slug, event_date, redirect_link
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;
      `;
      values = [title, location, type, mediaUrl, thumbnailUrl, caption, category, is_featured, display_order, slug, event_date, redirect_link];
    }

    const result = await query(sql, values);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('[POST /api/admin/gallery]', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Request failed' }, { status: 500 });
  }
}

// ─── DELETE: Remove a gallery post ─────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await query(`DELETE FROM gallery_posts WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}