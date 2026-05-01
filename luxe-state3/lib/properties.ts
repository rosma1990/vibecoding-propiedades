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
  description?: string;
  property_type?: string;
  year_built?: number;
  parking?: number;
  amenities?: string[];
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
  page: number = 1,
  location?: string,
  type?: string
): Promise<PaginatedProperties> {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('is_featured', false)
    .order('created_at', { ascending: true });

  if (location && location.trim()) {
    query = query.ilike('location', `%${location.trim()}%`);
  }

  if (type && type.trim() && type.toLowerCase() !== 'all') {
    query = query.ilike('title', `%${type.trim()}%`);
  }

  const { data, error, count } = await query.range(from, to);

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

export async function toggleFeatured(id: string, currentValue: boolean): Promise<{ success: boolean; is_featured: boolean }> {
  const newValue = !currentValue;
  const { error } = await supabase
    .from('properties')
    .update({ is_featured: newValue })
    .eq('id', id);

  if (error) {
    console.error('Error toggling featured:', error);
    return { success: false, is_featured: currentValue };
  }

  return { success: true, is_featured: newValue };
}

export async function uploadPropertyImage(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError, data } = await supabase.storage
    .from('property_images')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('property_images')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function createProperty(propertyData: Omit<Property, 'id' | 'created_at'>): Promise<Property | null> {
  const { data, error } = await supabase
    .from('properties')
    .insert([propertyData])
    .select()
    .single();

  if (error) {
    console.error('Error creating property:', error);
    return null;
  }

  return data as Property;
}

export async function updateProperty(id: string, propertyData: Partial<Property>): Promise<Property | null> {
  const { data, error } = await supabase
    .from('properties')
    .update(propertyData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating property:', error);
    return null;
  }

  return data as Property;
}

export async function deleteProperty(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting property:', error);
    return false;
  }

  return true;
}
