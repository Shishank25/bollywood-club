import { query } from '@/lib/database/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort') || 'display_order';
  
  // Map allowed sort keys to prevent SQL injection
  const sortMap: Record<string, string> = {
    display_order: 'display_order ASC',
    created: 'created_at DESC',
    event_date: 'event_date DESC',
    modified: 'updated_at DESC'
  };

  const orderBy = sortMap[sort] || 'display_order ASC';

  try {
    const { rows } = await query(`SELECT * FROM gallery_posts ORDER BY ${orderBy}`, []);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sql = `
      INSERT INTO gallery_posts 
      (title, slug, location, type, media_url, thumbnail_url, caption, category, is_featured, display_order, event_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`;
    
    const values = [
      body.title, body.slug, body.location, body.type, body.media_url, 
      body.thumbnail_url, body.caption, body.category,
      body.is_featured || false, body.display_order || 0, body.event_date || null
    ];

    const { rows } = await query(sql, values);
    console.log('Created gallery post:', rows[0]);
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.log("Error creating gallery post:", error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const sql = `
      UPDATE gallery_posts SET 
      title=$1, slug=$2, location=$3, type=$4, media_url=$5, thumbnail_url=$6, 
      caption=$7, category=$8, is_featured=$9, display_order=$10, 
      event_date=$11, updated_at=CURRENT_TIMESTAMP WHERE id=$12 RETURNING *`;
    
    const values = [
      body.title, body.slug, body.location, body.type, body.media_url, 
      body.thumbnail_url, body.caption, body.category, 
      body.is_featured, body.display_order, body.event_date, body.id
    ];

    const { rows } = await query(sql, values);
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  try {
    await query('DELETE FROM gallery_posts WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}