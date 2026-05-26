import { NextRequest, NextResponse } from 'next/server';
import { getLegalContentBySlug } from '@/lib/fetchLegalContent';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');

  if (!slug) {
    return NextResponse.json(
      { error: 'slug required' },
      { status: 400 }
    );
  }

  try {
    const doc = await getLegalContentBySlug(slug);

    if (!doc) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(doc);
  } catch (err) {
    console.error('[GET /api/admin/footer/legal]', err);

    return NextResponse.json(
      { error: 'DB error' },
      { status: 500 }
    );
  }
}