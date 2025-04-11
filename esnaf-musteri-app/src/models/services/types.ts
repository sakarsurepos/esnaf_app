import { Tables } from "../../types/supabase";

// Hizmet/Ürün tiplerini tanımlayan enum
export enum ServiceType {
  SERVICE = 'service',           // Personel gerektiren hizmet (kuaför, masaj, vb.)
  RESOURCE = 'resource',         // Kaynak gerektiren hizmet (kort, saha kiralama)
  PRODUCT = 'product',           // Satın alınabilir fiziksel ürün
  PACKAGE = 'package'            // Birden fazla hizmet/ürün içeren paket
}

export interface Service extends Tables<'services'> {
  // İlave özellikler
  service_type: ServiceType;     // Hizmet tipi
  requires_staff?: boolean;      // Personel gerektirir mi?
  requires_resource?: boolean;   // Kaynak gerektirir mi?
  resource_type_id?: string;     // Gerekli kaynak tipi ID'si
  is_purchasable?: boolean;      // Doğrudan satın alınabilir mi?
  has_stock?: boolean;           // Stok takibi var mı? (ürünler için)
  stock_quantity?: number;       // Stok miktarı (ürünler için)
  flow_type?: 'service_purchase_flow' | 'direct_booking_flow';
  override_business_settings?: boolean;
  custom_settings?: {
    payment_policy: 'free_booking' | 'deposit_required' | 'full_payment_required';
    deposit_rate: number;
  };
  allow_package_purchase?: boolean;
}

// Ödeme politikası bilgisi için yardımcı fonksiyon
export const getServicePaymentPolicy = (service: Service, businessSettings: any): {
  paymentPolicy: 'free_booking' | 'deposit_required' | 'full_payment_required';
  depositRate: number;
  isCustomPolicy: boolean;
} => {
  if (service.override_business_settings && service.custom_settings) {
    return {
      paymentPolicy: service.custom_settings.payment_policy,
      depositRate: service.custom_settings.deposit_rate,
      isCustomPolicy: true
    };
  }
  
  // İşletme ayarlarından ödeme politikasını al
  return {
    paymentPolicy: businessSettings.payment_policy,
    depositRate: businessSettings.deposit_rate,
    isCustomPolicy: false
  };
};

// Genişletilmiş hizmet - işletme ve kategori bilgilerini de içerir
export interface ExtendedService extends Service {
  business?: {
    id: string;
    name: string;
    logo_url?: string;
  };
  category?: {
    id: string;
    name: string;
  };
  staff?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

// Detaylı hizmet modeli
export interface DetailedService extends Service {
  business?: {
    id: string;
    name: string;
    logo_url?: string;
  };
  category?: {
    id: string;
    name: string;
  };
  images?: {
    id: string;
    url: string;
  }[];
  reviews?: {
    average_rating: number;
    review_count: number;
  };
} 