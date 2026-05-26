import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function getLegalContentBySlug(slug: string) {
  const rows = await sql`
    SELECT id, slug, label, href, content, is_active, image_url
    FROM "FooterLegal"
    WHERE slug = ${slug}
    LIMIT 1
  `;

  return rows[0] || null;
}