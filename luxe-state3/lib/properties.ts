import { supabase } from './supabase';

export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  area: string;
  badge?: string | null;
  type?: 'sale' | 'rent' | null;
  is_featured?: boolean;
  slug?: string;
  images: string[];
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

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    // Fallback: Check if it's an ID
    const { data: idData, error: idError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', slug)
      .single();
      
    if (idError || !idData) {
      console.error('Error fetching property by slug or id:', error || idError);
      return null;
    }
    return idData as Property;
  }

  return data as Property;
}
