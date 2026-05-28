import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database/db';

const CRM_UPLOAD_URL = process.env.CRM_API_URL
  ? `${process.env.CRM_API_URL}/api/media`
  : 'https://147.79.70.30.nip.io:8990/api/media';

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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const id = formData.get('id') as string | null;
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const excerpt = formData.get('excerpt') as string | null;
    const content = formData.get('content') as string | null;
    const author = formData.get('author') as string | null;
    
    // Parse tags back into JSON (or string if your DB expects a flat string)
    const tagsString = formData.get('tags') as string;
    const tags = tagsString ? JSON.parse(tagsString) : [];
    
    const published = formData.get('published') === 'true';
    const published_at = formData.get('published_at') as string | null;
    const seo_title = formData.get('seo_title') as string | null;
    const seo_description = formData.get('seo_description') as string | null;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and Slug are required' }, { status: 400 });
    }

    // Handle Cover Image Upload
    const file = formData.get('file') as File | null;
    let coverImage = formData.get('cover_image') as string | null;

    if (file) {
      try {
        coverImage = await uploadToCRM(file, 'blog');
      } catch (uploadError: any) {
        return NextResponse.json({ error: uploadError.message }, { status: 502 });
      }
    }

    let sql = '';
    let values: any[] = [];

    if (id) {
      sql = `
        UPDATE blog_posts SET
          title = $1, slug = $2, excerpt = $3, cover_image = $4, content = $5,
          author = $6, tags = $7, published = $8, published_at = $9,
          seo_title = $10, seo_description = $11, updated_at = CURRENT_TIMESTAMP
        WHERE id = $12 RETURNING *;
      `;
      // Pass the raw 'tags' array instead of JSON.stringify(tags)
      values = [title, slug, excerpt, coverImage, content, author, tags, published, published_at, seo_title, seo_description, id];
    } else {
      sql = `
        INSERT INTO blog_posts (
          title, slug, excerpt, cover_image, content, author, tags, published, published_at, seo_title, seo_description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;
      `;
      // Pass the raw 'tags' array instead of JSON.stringify(tags)
      values = [title, slug, excerpt, coverImage, content, author, tags, published, published_at, seo_title, seo_description];
    }

    const result = await query(sql, values);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('[POST /api/admin/blog]', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Request failed' }, { status: 500 });
  }
}