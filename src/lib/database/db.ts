// lib/db.ts
import { sql } from '@vercel/postgres';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Neon/Vercel
});

export const query = (text: string, params: any) => pool.query(text, params);

/**
 * Database Operations for Admin Content Management
 * All queries use Vercel Postgres
 */

// ============================================
// PAGES
// ============================================

export async function getPages() {
  const result = await sql`
    SELECT id, slug, title, description, created_at, updated_at
    FROM pages
    ORDER BY title ASC
  `;
  return result.rows;
}

export async function getPageBySlug(slug: string) {
  const result = await sql`
    SELECT id, slug, title, description, created_at, updated_at
    FROM pages
    WHERE slug = ${slug}
  `;
  return result.rows[0];
}

// ============================================
// SECTIONS
// ============================================

export async function getSectionsByPageId(pageId: number) {
  const result = await sql`
    SELECT id, page_id, section_id, type, title, content, metadata, display_order, is_active, created_at, updated_at
    FROM sections
    WHERE page_id = ${pageId} AND is_active = true
    ORDER BY display_order ASC
  `;
  return result.rows;
}

export async function getSectionById(sectionId: number) {
  const result = await sql`
    SELECT id, page_id, section_id, type, title, content, metadata, display_order, is_active, created_at, updated_at
    FROM sections
    WHERE id = ${sectionId}
  `;
  return result.rows[0];
}

export async function createSection(pageId: number, sectionId: string, type: string, data: any) {
  const result = await sql`
    INSERT INTO sections (page_id, section_id, type, title, content, metadata, display_order)
    VALUES (${pageId}, ${sectionId}, ${type}, ${data.title || null}, ${data.content || null}, ${JSON.stringify(data.metadata || {})}, ${data.display_order || 0})
    RETURNING id, page_id, section_id, type, title, content, metadata, display_order, is_active, created_at, updated_at
  `;
  return result.rows[0];
}

export async function updateSection(sectionId: number, data: any) {
  const result = await sql`
    UPDATE sections
    SET 
      title = COALESCE(${data.title || null}, title),
      content = COALESCE(${data.content || null}, content),
      metadata = COALESCE(${data.metadata ? JSON.stringify(data.metadata) : null}, metadata),
      display_order = COALESCE(${data.display_order !== undefined ? data.display_order : null}, display_order),
      is_active = COALESCE(${data.is_active !== undefined ? data.is_active : null}, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${sectionId}
    RETURNING id, page_id, section_id, type, title, content, metadata, display_order, is_active, created_at, updated_at
  `;
  return result.rows[0];
}

export async function deleteSection(sectionId: number) {
  await sql`DELETE FROM sections WHERE id = ${sectionId}`;
}

// ============================================
// VIDEOS
// ============================================

export async function getVideosBySection(sectionId: number) {
  const result = await sql`
    SELECT id, section_id, title, video_url, thumbnail_url, description, duration, display_order, created_at, updated_at
    FROM videos
    WHERE section_id = ${sectionId}
    ORDER BY display_order ASC
  `;
  return result.rows;
}

export async function createVideo(sectionId: number, data: any) {
  const result = await sql`
    INSERT INTO videos (section_id, title, video_url, thumbnail_url, description, duration, display_order)
    VALUES (${sectionId}, ${data.title}, ${data.video_url}, ${data.thumbnail_url || null}, ${data.description || null}, ${data.duration || null}, ${data.display_order || 0})
    RETURNING id, section_id, title, video_url, thumbnail_url, description, duration, display_order, created_at, updated_at
  `;
  return result.rows[0];
}

export async function updateVideo(videoId: number, data: any) {
  const result = await sql`
    UPDATE videos
    SET 
      title = COALESCE(${data.title || null}, title),
      video_url = COALESCE(${data.video_url || null}, video_url),
      thumbnail_url = COALESCE(${data.thumbnail_url || null}, thumbnail_url),
      description = COALESCE(${data.description || null}, description),
      duration = COALESCE(${data.duration || null}, duration),
      display_order = COALESCE(${data.display_order !== undefined ? data.display_order : null}, display_order),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${videoId}
    RETURNING id, section_id, title, video_url, thumbnail_url, description, duration, display_order, created_at, updated_at
  `;
  return result.rows[0];
}

export async function deleteVideo(videoId: number) {
  await sql`DELETE FROM videos WHERE id = ${videoId}`;
}

// ============================================
// IMAGES
// ============================================

export async function getImagesBySection(sectionId: number) {
  const result = await sql`
    SELECT id, section_id, title, image_url, alt_text, caption, display_order, created_at, updated_at
    FROM images
    WHERE section_id = ${sectionId}
    ORDER BY display_order ASC
  `;
  return result.rows;
}

export async function createImage(sectionId: number, data: any) {
  const result = await sql`
    INSERT INTO images (section_id, title, image_url, alt_text, caption, display_order)
    VALUES (${sectionId}, ${data.title || null}, ${data.image_url}, ${data.alt_text || null}, ${data.caption || null}, ${data.display_order || 0})
    RETURNING id, section_id, title, image_url, alt_text, caption, display_order, created_at, updated_at
  `;
  return result.rows[0];
}

export async function updateImage(imageId: number, data: any) {
  const result = await sql`
    UPDATE images
    SET 
      title = COALESCE(${data.title || null}, title),
      image_url = COALESCE(${data.image_url || null}, image_url),
      alt_text = COALESCE(${data.alt_text || null}, alt_text),
      caption = COALESCE(${data.caption || null}, caption),
      display_order = COALESCE(${data.display_order !== undefined ? data.display_order : null}, display_order),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${imageId}
    RETURNING id, section_id, title, image_url, alt_text, caption, display_order, created_at, updated_at
  `;
  return result.rows[0];
}

export async function deleteImage(imageId: number) {
  await sql`DELETE FROM images WHERE id = ${imageId}`;
}

// ============================================
// BLOG POSTS
// ============================================

export async function getBlogPosts(published: boolean = true) {
  if (published) {
    const { rows } = await sql`SELECT id, slug, title, excerpt, featured_image, author, published, created_at, updated_at, published_at FROM blog_posts WHERE published = true ORDER BY published_at DESC`;
    return rows;
  } else {
    const { rows } = await sql`SELECT id, slug, title, excerpt, featured_image, author, published, created_at, updated_at, published_at FROM blog_posts ORDER BY updated_at DESC`;
    return rows;
  }
}

export async function getBlogPostBySlug(slug: string) {
  const result = await sql`
    SELECT id, slug, title, excerpt, content, featured_image, author, published, created_at, updated_at, published_at
    FROM blog_posts
    WHERE slug = ${slug}
  `;
  return result.rows[0];
}

export async function createBlogPost(data: any) {
  try {
    const result = await sql`
      INSERT INTO blog_posts (
        slug, title, excerpt, content, featured_image, author, published, published_at
      )
      VALUES (
        ${data.slug}, 
        ${data.title}, 
        ${data.excerpt || null}, 
        ${data.content}, 
        ${data.featured_image || null}, 
        ${data.author || null}, 
        ${data.published || false}, 
        ${data.published ? new Date().toISOString() : null} 
      )
      RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw error;
  }
}

export async function updateBlogPost(blogId: number, data: any) {
  try {
    const result = await sql`
      UPDATE blog_posts
      SET 
        slug = CASE WHEN ${data.slug !== undefined} THEN ${data.slug} ELSE slug END,
        title = CASE WHEN ${data.title !== undefined} THEN ${data.title} ELSE title END,
        excerpt = CASE WHEN ${data.excerpt !== undefined} THEN ${data.excerpt} ELSE excerpt END,
        content = CASE WHEN ${data.content !== undefined} THEN ${data.content} ELSE content END,
        published = CASE WHEN ${data.published !== undefined} THEN ${data.published} ELSE published END,
        published_at = CASE 
          WHEN ${data.published === true} AND published_at IS NULL THEN CURRENT_TIMESTAMP 
          ELSE published_at 
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${blogId}
      RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error("Database Update Error:", error);
    throw new Error(`Failed to update blog post ${blogId}`);
  }
}

export async function deleteBlogPost(blogId: number) {
  await sql`DELETE FROM blog_posts WHERE id = ${blogId}`;
}

// ============================================
// SETTINGS
// ============================================

export async function getSetting(key: string) {
  const result = await sql`
    SELECT id, key, value, updated_at FROM settings WHERE key = ${key}
  `;
  return result.rows[0];
}

export async function getAllSettings() {
  const result = await sql`
    SELECT id, key, value, updated_at FROM settings
  `;
  return result.rows;
}

export async function setSetting(key: string, value: string) {
  const result = await sql`
    INSERT INTO settings (key, value) VALUES (${key}, ${value})
    ON CONFLICT (key) DO UPDATE SET value = ${value}, updated_at = CURRENT_TIMESTAMP
    RETURNING id, key, value, updated_at
  `;
  return result.rows[0];
}