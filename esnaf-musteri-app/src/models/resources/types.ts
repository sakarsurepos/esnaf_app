import { Tables } from "../../types/supabase";

// Kaynak tiplerini tanımlayan enum
export enum ResourceType {
  TENNIS_COURT = 'tennis_court',
  TENNIS_RACKET = 'tennis_racket',
  FITNESS_EQUIPMENT = 'fitness_equipment',
  OTHER = 'other'
}

// Kaynağın durumunu tanımlayan enum
export enum ResourceStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  MAINTENANCE = 'maintenance',
  OUT_OF_ORDER = 'out_of_order'
}

// Temel kaynak modeli
export interface Resource {
  id: string;
  business_id: string;
  branch_id: string;
  name: string;
  description?: string;
  resource_type: ResourceType;
  status: ResourceStatus;
  image_url?: string;
  details?: ResourceDetails;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Kaynak tipine göre detay alanları
export interface ResourceDetails {
  // Tennis kortuna özel detaylar
  court_type?: 'clay' | 'hard' | 'grass' | 'carpet'; // Kort tipi
  is_covered?: boolean; // Kapalı kort mu?
  
  // Raketlere özel detaylar
  brand?: string; // Raket markası
  model?: string; // Raket modeli
  weight?: number; // Raket ağırlığı (gram)
  grip_size?: number; // Grip boyutu
  
  // Diğer ekipmanlar için ortak alanlar
  condition?: 'new' | 'good' | 'fair' | 'poor'; // Ekipmanın durumu
  notes?: string; // Ekstra notlar
}

// Kaynak rezervasyonu modeli
export interface ResourceReservation {
  id: string;
  resource_id: string;
  appointment_id: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

// Randevu ile kaynakları ilişkilendiren ilişki modeli
export interface AppointmentResource {
  id: string;
  appointment_id: string;
  resource_id: string;
  quantity: number; // Birden fazla kaynak rezerve edildiyse (örn. 2 raket)
  created_at: string;
  updated_at: string;
}

// Genişletilmiş kaynak modeli (ekstra bilgiler içeren)
export interface ExtendedResource extends Resource {
  business?: {
    id: string;
    name: string;
  };
  branch?: {
    id: string;
    name: string;
  };
  // Mevcut rezervasyonları da tutabilir
  reservations?: ResourceReservation[];
} 