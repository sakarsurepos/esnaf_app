import { Tables } from "../../types/supabase";

export interface BusinessSettings {
  id: string;
  business_id: string;
  payment_policy: 'free_booking' | 'deposit_required' | 'full_payment_required';
  deposit_rate: number; // 0-1 arası ondalık sayı (örn: 0.3 = %30)
  allow_package_use: boolean;
  allow_walkin_payment: boolean;
  cancellation_policy: {
    refundable_until_hours: number;
    charge_on_noshow: boolean;
  };
  created_at: string;
  updated_at: string;
}

// Genişletilmiş iş ayarları arayüzü - işletme bilgilerini de içerir
export interface ExtendedBusinessSettings extends BusinessSettings {
  business?: {
    id: string;
    name: string;
  };
} 