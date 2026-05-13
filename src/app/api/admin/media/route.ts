import { query } from '@/lib/database/db'; // Your pg pool utility
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      pageRoute, 
      htmlId, 
      mediaUrl, 
      mediaType, 
      altText, 
      width, 
      height 
    } = body;

    // Direct SQL Upsert using ON CONFLICT
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
        media_url = EXCLUDED.media_url,
        media_type = EXCLUDED.media_type,
        alt_text = EXCLUDED.alt_text,
        width = EXCLUDED.width,
        height = EXCLUDED.height,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [
      pageRoute, 
      htmlId, 
      mediaUrl, 
      mediaType || 'image', 
      altText || null, 
      width || null, 
      height || null
    ];

    const res = await query(sql, values);

    return NextResponse.json(res.rows[0]);
  } catch (error: any) {
    console.error('Admin Upsert Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to save media asset' }, 
      { status: 500 }
    );
  }
}