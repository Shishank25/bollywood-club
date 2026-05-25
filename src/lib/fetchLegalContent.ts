// src/lib/fetchLegalContent.ts

export async function getLegalContent(slug: string) {
  // Use your site's base URL. Ensure NEXT_PUBLIC_APP_URL is in your .env
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const res = await fetch(`${baseUrl}/api/admin/footer/legal?slug=${slug}`, {
    // Legal docs rarely change, so cache them heavily to save DB reads!
    next: { revalidate: 86400 }, // Revalidate every 24 hours
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch ${slug} content`);
  }

  return res.json();
}