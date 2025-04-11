import { Product, ProductService } from "./types";

// Products için örnek veri
export const sampleProducts: Product[] = [
  {
    id: 'product-uuid-1',
    business_id: 'business-uuid-1', // Ahmet Berber Salonu
    name: 'Saç Kesimi + Bakım Paketi',
    description: 'Profesyonel saç kesimi ve bakım paketi. Fön ve temel bakım dahildir.',
    price: 250.0,
    image_url: 'https://example.com/product1.jpg',
    is_stock_limited: false,
    stock_quantity: null,
    requires_appointment: true,
    validity_days: 30,
    is_active: true,
    created_at: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    updated_at: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString()
  },
  {
    id: 'product-uuid-2',
    business_id: 'business-uuid-2', // Ayşe Güzellik Merkezi
    name: 'Premium Cilt Bakım Paketi (3 Seans)',
    description: '3 seansdan oluşan premium cilt bakım paketi. Derin temizlik, nemlendirme ve anti-aging bakımı içerir.',
    price: 750.0,
    image_url: 'https://example.com/product2.jpg',
    is_stock_limited: true,
    stock_quantity: 20,
    requires_appointment: true,
    validity_days: 90,
    is_active: true,
    created_at: new Date(new Date().setDate(new Date().getDate() - 45)).toISOString(),
    updated_at: new Date(new Date().setDate(new Date().getDate() - 45)).toISOString()
  },
  {
    id: 'product-uuid-3',
    business_id: 'business-uuid-2', // Ayşe Güzellik Merkezi
    name: 'Online Diyet Danışmanlığı (Aylık)',
    description: '1 aylık online diyet danışmanlığı. Kişisel beslenme planı ve haftalık takip görüşmeleri içerir.',
    price: 500.0,
    image_url: 'https://example.com/product3.jpg',
    is_stock_limited: true,
    stock_quantity: 15,
    requires_appointment: false,
    validity_days: 30,
    is_active: true,
    created_at: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
    updated_at: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString()
  }
];

// Product Services için örnek veri
export const sampleProductServices: ProductService[] = [
  {
    id: 'product-service-uuid-1',
    product_id: 'product-uuid-1',
    service_id: 'service-uuid-1', // Erkek Saç Kesimi
    quantity: 1
  },
  {
    id: 'product-service-uuid-2',
    product_id: 'product-uuid-1',
    service_id: 'service-uuid-2', // Sakal Tıraşı
    quantity: 1
  },
  {
    id: 'product-service-uuid-3',
    product_id: 'product-uuid-2',
    service_id: 'service-uuid-3', // Cilt Bakımı
    quantity: 3 // 3 seans
  },
  {
    id: 'product-service-uuid-4',
    product_id: 'product-uuid-3',
    service_id: 'service-uuid-5', // Özel bir diyet hizmeti (örnek)
    quantity: 1
  }
]; 