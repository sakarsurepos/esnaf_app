export interface Product {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_stock_limited: boolean;
  stock_quantity: number | null;
  requires_appointment: boolean;
  validity_days: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Hizmet ilişkisi ile genişletilmiş ürün
export interface ExtendedProduct extends Product {
  services?: ProductService[];
  business?: {
    id: string;
    name: string;
    logo_url?: string;
  };
}

// Ürün-Hizmet ilişkisi
export interface ProductService {
  id: string;
  product_id: string;
  service_id: string;
  quantity: number;
  service?: {
    id: string;
    title: string;
    duration_minutes: number;
  };
} 