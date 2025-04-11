import { Tables } from "../../types/supabase";

export interface ServiceSubcategory {
  id: string;
  name: string;
  parent_id: string; // Ana kategori ID'si
  description?: string;
  icon_url?: string;
  is_active: boolean;
}

export interface ExtendedServiceCategory extends Tables<'service_categories'> {
  subcategories?: ServiceSubcategory[];
} 