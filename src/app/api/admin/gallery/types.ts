export interface GalleryPost {
  id: number;
  title: string;
  slug: string;
  location?: string;
  type?: string;
  media_url: string;
  thumbnail_url?: string;
  caption?: string;
  category?: string;
  tags?: string;
  is_featured: boolean;
  display_order: number;
  event_date?: string;
  created_at: string;
  updated_at: string;
}