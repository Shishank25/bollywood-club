// app/api/admin/footer/legal/route.ts
// Separate route so we only load the heavy TipTap content when that section is open
import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

  try {
    const rows = await sql`
      SELECT id, slug, label, href, content, is_active, image_url
      FROM "FooterLegal"
      WHERE slug = ${slug}
      LIMIT 1
    `;
    if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error('[GET /api/admin/footer/legal]', err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}