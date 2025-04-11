export interface Payment {
  id: string;
  appointment_id: string | null;
  order_id: string | null; // Paket satın alımları için
  customer_id: string;
  business_id: string;
  amount: number;
  payment_method: 'credit_card' | 'bank_transfer' | 'wallet' | 'cash' | 'pos';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_time: string | null;
  transaction_id: string | null; // Ödeme sağlayıcısının işlem id'si
  is_deposit: boolean;
  created_at: string;
  updated_at: string;
}

// Genişletilmiş ödeme - ilişkili varlıkların bilgilerini içerir
export interface ExtendedPayment extends Payment {
  appointment?: {
    id: string;
    appointment_time: string;
    service_title: string;
  };
  order?: {
    id: string;
    total_amount: number;
    items_count: number;
  };
  customer?: {
    id: string;
    name: string;
  };
  business?: {
    id: string;
    name: string;
  };
} 