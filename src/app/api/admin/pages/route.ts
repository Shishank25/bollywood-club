import { getPages, getPageBySlug } from '@/lib/database/db';
import { NextRequest, NextResponse } from 'next/server';
 
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');
 
    if (slug) {
      const page = await getPageBySlug(slug);
      if (!page) {
        return NextResponse.json(
          { error: 'Page not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(page);
    }
 
    const pages = await getPages();
    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}