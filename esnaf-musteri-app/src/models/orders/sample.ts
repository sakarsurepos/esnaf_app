import { Order, OrderItem } from "./types";

// Orders için örnek veri
export const sampleOrders: Order[] = [
  {
    id: 'order-uuid-1',
    customer_id: 'user-uuid-1', // Ahmet
    total_amount: 750.0,
    discount_amount: 0,
    final_amount: 750.0,
    status: 'paid',
    payment_method: 'credit_card',
    payment_status: 'completed',
    created_at: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(), // 10 gün önce
    updated_at: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    coupon_code: null
  },
  {
    id: 'order-uuid-2',
    customer_id: 'user-uuid-3', // Mehmet
    total_amount: 250.0,
    discount_amount: 25.0,
    final_amount: 225.0,
    status: 'paid',
    payment_method: 'credit_card',
    payment_status: 'completed',
    created_at: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(), // 15 gün önce
    updated_at: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
    coupon_code: 'FIRST10'
  },
  {
    id: 'order-uuid-3',
    customer_id: 'user-uuid-2', // Ayşe
    total_amount: 500.0,
    discount_amount: 0,
    final_amount: 500.0,
    status: 'pending',
    payment_method: 'bank_transfer',
    payment_status: 'pending',
    created_at: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), // 2 gün önce
    updated_at: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    coupon_code: null
  }
];

// Order Items için örnek veri
export const sampleOrderItems: OrderItem[] = [
  {
    id: 'order-item-uuid-1',
    order_id: 'order-uuid-1',
    product_id: 'product-uuid-2', // Premium Cilt Bakım Paketi (3 Seans)
    quantity: 1,
    unit_price: 750.0,
    total_price: 750.0,
    status: 'unused',
    activation_code: 'ABCD1234',
    qr_code_url: 'https://example.com/qr/ABCD1234',
    valid_until: new Date(new Date().setDate(new Date().getDate() + 80)).toISOString(), // 80 gün sonra
    created_at: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    updated_at: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString()
  },
  {
    id: 'order-item-uuid-2',
    order_id: 'order-uuid-2',
    product_id: 'product-uuid-1', // Saç Kesimi + Bakım Paketi
    quantity: 1,
    unit_price: 250.0,
    total_price: 250.0,
    status: 'unused',
    activation_code: 'EFGH5678',
    qr_code_url: 'https://example.com/qr/EFGH5678',
    valid_until: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(), // 15 gün sonra
    created_at: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
    updated_at: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString()
  },
  {
    id: 'order-item-uuid-3',
    order_id: 'order-uuid-3',
    product_id: 'product-uuid-3', // Online Diyet Danışmanlığı (Aylık)
    quantity: 1,
    unit_price: 500.0,
    total_price: 500.0,
    status: 'unused',
    activation_code: null, // Ödeme henüz tamamlanmadı
    qr_code_url: null,
    valid_until: null,
    created_at: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    updated_at: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString()
  }
]; 