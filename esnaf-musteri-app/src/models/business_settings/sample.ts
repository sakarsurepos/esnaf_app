import { BusinessSettings } from "./types";

// Business Settings için örnek veri
export const sampleBusinessSettings: BusinessSettings[] = [
  {
    id: 'bs-uuid-1',
    business_id: 'business-uuid-1', // Ahmet Berber Salonu
    payment_policy: 'deposit_required',
    deposit_rate: 0.3, // %30 depozito
    allow_package_use: true,
    allow_walkin_payment: true,
    cancellation_policy: {
      refundable_until_hours: 24,
      charge_on_noshow: true
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'bs-uuid-2',
    business_id: 'business-uuid-2', // Ayşe Güzellik Merkezi
    payment_policy: 'full_payment_required',
    deposit_rate: 0, // Tam ödeme gerektiği için depozito yok
    allow_package_use: true,
    allow_walkin_payment: false,
    cancellation_policy: {
      refundable_until_hours: 48,
      charge_on_noshow: true
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'bs-uuid-3',
    business_id: 'business-uuid-3', // Profesyonel Temizlik Hizmetleri
    payment_policy: 'free_booking',
    deposit_rate: 0, // Ücretsiz rezervasyon
    allow_package_use: true,
    allow_walkin_payment: true,
    cancellation_policy: {
      refundable_until_hours: 12,
      charge_on_noshow: false
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'bs-uuid-4',
    business_id: 'business-uuid-4', // Ace Tenis Kulübü
    payment_policy: 'deposit_required',
    deposit_rate: 0.2, // %20 depozito
    allow_package_use: true,
    allow_walkin_payment: true,
    cancellation_policy: {
      refundable_until_hours: 6,
      charge_on_noshow: true
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]; 