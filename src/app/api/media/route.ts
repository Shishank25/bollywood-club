import { query } from '@/lib/database/db'; // Your pg pool utility [cite: 141, 149]
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageRoute = searchParams.get('page');

  if (!pageRoute) {
    return NextResponse.json({ error: 'pageRoute is required' }, { status: 400 });
  }

  try {
    // Standard SQL query instead of Prisma 
    const sql = `
      SELECT html_id, media_url, media_type, alt_text, width, height 
      FROM "MediaAssets" 
      WHERE page_route = $1
    `;
    
    const res = await query(sql, [pageRoute]);

    // Convert the database rows into a Key-Value object 
    // Result: { "hero-video": { media_url: "...", width: 1920 }, ... }
    const mappedMedia = Object.fromEntries(
      res.rows.map((asset) => [asset.html_id, asset])
    );

    return NextResponse.json(mappedMedia);
  } catch (error: any) {
    console.error('Database Fetch Error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}