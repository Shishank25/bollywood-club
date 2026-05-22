// types/events.ts

export interface EventQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  location?: string;
  country?: string;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  priceMin?: number;
  priceMax?: number;
  priceRange?: string;
  search?: string;
  currency?: string;
  sortBy?: string;
  status?: string;
  upcoming?: string;
  excludePast?: string;
  publicOnly?: string;
  organizerName?: string;
}

export interface EventBasicInfo {
  name: string;
  date: string;
  city?: string;
  location?: string;
  country?: string;
  venue?: string;
  image?: string;
}

export interface Event {
  _id: string;
  basicInfo: EventBasicInfo;
  status: string;
  category?: string;
  organizerName?: string;
  price?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  // Extend with whatever additional fields your ticketing backend returns
  [key: string]: unknown;
  media: { 
    thumbnailImage: string; 
    coverImage: string 
  };
  publishedAt: string;
}

export interface EventsApiResponse {
  events: Event[];
  data: Event[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}