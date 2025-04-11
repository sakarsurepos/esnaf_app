import { Tables } from "../../types/supabase";
import { Resource } from "../resources";

export interface Appointment extends Tables<'appointments'> {
  // Yeni alanlar
  payment_status?: 'unpaid' | 'deposit_paid' | 'fully_paid' | 'paid_with_package';
  flow_type?: 'service_purchase_flow' | 'direct_booking_flow';
  check_in_time?: string | null;
  check_out_time?: string | null;
  cancellation_reason?: string | null;
  cancellation_time?: string | null;
  refund_status?: 'none' | 'partial' | 'full';
  order_item_id?: string | null; // Paket kullanımı için
  resources?: Resource[]; // İlişkili kaynaklar (kort, raket vb.)
  resource_reservations?: any[]; // Kaynak rezervasyonları
}

// Detaylı randevu - ilişkili varlıkların bilgilerini içerir
export interface DetailedAppointment extends Appointment {
  service?: {
    id: string;
    title: string;
    price: number;
    duration_minutes: number;
    flow_type: 'service_purchase_flow' | 'direct_booking_flow';
  };
  business?: {
    id: string;
    name: string;
    logo_url?: string;
    phone?: string;
    address?: string;
  };
  staff?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  order_item?: {
    id: string;
    product_name: string;
    activation_code?: string;
  };
}

export interface ExtendedAppointment extends Appointment {
  service?: {
    id: string;
    title: string;
    price: number;
    duration_minutes: number;
  };
  business?: {
    id: string;
    name: string;
    phone?: string;
  };
  staff?: {
    id: string;
    name: string;
  };
} 