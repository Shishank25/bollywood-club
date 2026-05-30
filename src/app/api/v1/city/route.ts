import { NextResponse } from 'next/server';
import { query } from '@/lib/database/db';

export async function GET() {
  try {
    // The updated SQL query for your footer:
    const result = await query(`
    SELECT 
        COALESCE(footer_label, title) AS display_name, 
        slug 
    FROM city_pages 
    ORDER BY display_name ASC
    `, []);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('[GET /api/cities]', error);
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
  }
}