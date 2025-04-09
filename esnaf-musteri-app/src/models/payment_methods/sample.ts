import { Tables } from "../../types/supabase";

// Ödeme yöntemleri için örnek veri - Custom type kullanıyoruz çünkü henüz Supabase'de böyle bir tablo bulunmuyor
export interface PaymentMethod {
  id: string;
  user_id: string;
  name: string;  // Kart adı, örn. "İş Kartım"
  card_type: string; // Visa, Mastercard, vb.
  last_digits: string;
  expires_at: string; // MM/YY formatında
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Örnek veri
export const samplePaymentMethods: PaymentMethod[] = [
  {
    id: 'payment-uuid-1',
    user_id: 'user-uuid-1',
    name: 'Kişisel Kart',
    card_type: 'Visa',
    last_digits: '4242',
    expires_at: '12/25',
    is_default: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'payment-uuid-2',
    user_id: 'user-uuid-1',
    name: 'İş Kartı',
    card_type: 'Mastercard',
    last_digits: '5678',
    expires_at: '09/24',
    is_default: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'payment-uuid-3',
    user_id: 'user-uuid-2',
    name: 'Ana Kart',
    card_type: 'Visa',
    last_digits: '9876',
    expires_at: '04/26',
    is_default: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'payment-uuid-4',
    user_id: 'user-uuid-3',
    name: 'Maaş Kartı',
    card_type: 'Mastercard',
    last_digits: '1234',
    expires_at: '10/24',
    is_default: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]; 