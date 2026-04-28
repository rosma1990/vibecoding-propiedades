import { supabase } from './supabase';

export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  area: string;
  image_url: string;
  badge?: string | null;
  type?: 'sale' | 'rent' | null;
  is_featured?: boolean;
}

export interface PaginatedProperties {
  properties: Property[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

const PAGE_SIZE = 8;

export async function getFeaturedProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }

  return data as Property[];
}

export async function getNewInMarketProperties(
  page: number = 1
): Promise<PaginatedProperties> {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('is_featured', false)
    .order('created_at', { ascending: true })
    .range(from, to);

  if (error) {
    console.error('Error fetching new in market properties:', error);
    return { properties: [], totalCount: 0, totalPages: 0, currentPage: page };
  }

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return {
    properties: data as Property[],
    totalCount,
    totalPages,
    currentPage: page,
  };
}
