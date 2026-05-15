import { query } from '@/lib/database/db';
import { NextResponse } from 'next/server';

// Helper function to map snake_case DB rows to the camelCase format expected by your React component
const mapToClient = (row: any) => ({
  _id: row.id,
  title: row.title,
  slug: row.slug,
  excerpt: row.excerpt,
  coverImage: row.cover_image,
  content: row.content,
  author: row.author,
  tags: row.tags || [],
  published: row.published,
  publishedAt: row.published_at,
  seoTitle: row.seo_title,
  seoDescription: row.seo_description,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort') || 'createdAt';
  
  // Map allowed sort keys to prevent SQL injection
  const sortMap: Record<string, string> = {
    createdAt: 'created_at DESC',
    publishedAt: 'published_at DESC',
    updatedAt: 'updated_at DESC',
    title: 'title ASC'
  };

  const orderBy = sortMap[sort] || 'created_at DESC';

  try {
    const { rows } = await query(`SELECT * FROM blog_posts ORDER BY ${orderBy}`, []);
    return NextResponse.json(rows.map(mapToClient));
  } catch (error: any) {
    console.error("GET Blog Posts Error:", error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const sql = `
      INSERT INTO blog_posts 
      (title, slug, excerpt, cover_image, content, author, tags, published, published_at, seo_title, seo_description)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;
    
    const values = [
      body.title, 
      body.slug, 
      body.excerpt || '', 
      body.coverImage || '', 
      body.content ? JSON.stringify(body.content) : null, // TipTap JSON
      body.author || '', 
      body.tags || [], // Arrays are supported natively by node-postgres
      body.published || false, 
      body.publishedAt || null, 
      body.seoTitle || '', 
      body.seoDescription || ''
    ];

    const { rows } = await query(sql, values);
    return NextResponse.json(mapToClient(rows[0]));
  } catch (error: any) {
    console.error("POST Blog Error:", error);
    return NextResponse.json({ error: 'Failed to create post', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    if (!body._id) {
      return NextResponse.json({ error: 'Post ID is required for updating' }, { status: 400 });
    }

    const sql = `
      UPDATE blog_posts SET 
        title = $1, 
        slug = $2, 
        excerpt = $3, 
        cover_image = $4, 
        content = $5, 
        author = $6, 
        tags = $7, 
        published = $8, 
        published_at = $9, 
        seo_title = $10, 
        seo_description = $11, 
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *;
    `;
    
    const values = [
      body.title, 
      body.slug, 
      body.excerpt, 
      body.coverImage, 
      body.content ? JSON.stringify(body.content) : null, 
      body.author, 
      body.tags, 
      body.published, 
      body.publishedAt, 
      body.seoTitle, 
      body.seoDescription, 
      body._id // Extracted from frontend's `_id`
    ];

    const { rows } = await query(sql, values);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json(mapToClient(rows[0]));
  } catch (error: any) {
    console.error("PUT Blog Error:", error);
    return NextResponse.json({ error: 'Failed to update post', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    await query('DELETE FROM blog_posts WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE Blog Error:", error);
    return NextResponse.json({ error: 'Failed to delete post', details: error.message }, { status: 500 });
  }
}