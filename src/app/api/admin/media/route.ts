import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database/db'; // your existing db query utility

const CRM_UPLOAD_URL = process.env.CRM_API_URL
  ? `${process.env.CRM_API_URL}/api/media`
  : 'https://147.79.70.30.nip.io:8990/api/media';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // ── Extract fields ──────────────────────────────────────────────────────
    const file      = formData.get('file') as File | null;
    const pageRoute = formData.get('pageRoute') as string;
    const htmlId    = formData.get('htmlId') as string;
    const mediaType = (formData.get('mediaType') as string) || 'image';
    const altText   = formData.get('altText') as string | null;
    const width     = formData.get('width') ? Number(formData.get('width')) : null;
    const height    = formData.get('height') ? Number(formData.get('height')) : null;
    const folder    = (formData.get('folder') as string) || 'uploads';

    if (!pageRoute || !htmlId) {
      return NextResponse.json(
        { error: 'pageRoute and htmlId are required' },
        { status: 400 }
      );
    }

    // ── If a file was provided, forward it to the CRM backend ───────────────
    let mediaUrl: string | null = formData.get('mediaUrl') as string | null;

    if (file) {
      const crmForm = new FormData();
      crmForm.append('file', file);
      crmForm.append('folder', folder);

      // const crmRes = await fetch(CRM_UPLOAD_URL, {
      const crmRes = await fetch('http://localhost:9000/api/media', {
        method: 'POST',
        body: crmForm,
        headers: {
          // Forward auth to CRM if needed
          ...(process.env.CRM_API_SECRET && {
            Authorization: `Bearer ${process.env.CRM_API_SECRET}`,
          }),
        },
      });

      if (!crmRes.ok) {
        const err = await crmRes.json().catch(() => ({}));
        return NextResponse.json(
          { error: err.error ?? 'CRM upload failed' },
          { status: 502 }
        );
      }

      const crmData = await crmRes.json();
      mediaUrl = crmData.file?.url ?? crmData.url ?? null;

      if (!mediaUrl) {
        return NextResponse.json(
          { error: 'CRM did not return a file URL' },
          { status: 502 }
        );
      }
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
        height
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (page_route, html_id)
      DO UPDATE SET
        media_url  = EXCLUDED.media_url,
        media_type = EXCLUDED.media_type,
        alt_text   = EXCLUDED.alt_text,
        width      = EXCLUDED.width,
        height     = EXCLUDED.height,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [pageRoute, htmlId, mediaUrl, mediaType, altText, width, height];
    const result = await query(sql, values);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('[POST /api/media-assets]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Request failed' },
      { status: 500 }
    );
  }
}