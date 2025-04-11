export interface Order {
  id: string;
  customer_id: string;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  payment_method: 'credit_card' | 'bank_transfer' | 'wallet' | 'cash';
  payment_status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  coupon_code: string | null;
}

// Sipariş kalemleri ile genişletilmiş sipariş
export interface ExtendedOrder extends Order {
  items?: OrderItem[];
  customer?: {
    id: string;
    full_name: string;
    phone_number: string;
    email: string;
  };
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  status: 'unused' | 'used' | 'expired' | 'cancelled';
  activation_code: string | null;
  qr_code_url: string | null;
  valid_until: string | null;
  created_at: string;
  updated_at: string;
}

// Ürün bilgisi ile genişletilmiş sipariş kalemi
export interface ExtendedOrderItem extends OrderItem {
  product?: {
    id: string;
    name: string;
    requires_appointment: boolean;
    business_id: string;
  };
} 