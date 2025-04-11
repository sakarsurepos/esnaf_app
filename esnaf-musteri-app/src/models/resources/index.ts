export * from './types';
export * from './sample';

// Kaynak tipleri için enum
export enum ResourceType {
  TENNIS_COURT = 'tennis_court',
  TENNIS_RACKET = 'tennis_racket',
  SPORTS_FIELD = 'sports_field',
  SPORTS_EQUIPMENT = 'sports_equipment',
  ROOM = 'room',
  OTHER = 'other'
}

// Kaynak modeli
export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  description?: string;
  business_id: string;
  branch_id: string;
  is_active: boolean;
  price_per_hour?: number;
  availability_schedule?: {
    [date: string]: {
      start_time: string;
      end_time: string;
    }[];
  };
  image_url?: string;
  max_capacity?: number;
  created_at: string;
  updated_at: string;
}

// Kaynak rezervasyonu modeli
export interface ResourceBooking {
  id: string;
  resource_id: string;
  appointment_id: string;
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// Örnek tenis kortları
export const sampleTennisCourts: Resource[] = [
  {
    id: 'resource-1',
    name: 'Kort 1 (Halı Saha)',
    type: ResourceType.TENNIS_COURT,
    description: 'Açık hava halı zeminli tenis kortu',
    business_id: 'business-5',
    branch_id: 'branch-uuid-4',
    is_active: true,
    price_per_hour: 150,
    image_url: 'https://example.com/tenniscourt1.jpg',
    max_capacity: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'resource-2',
    name: 'Kort 2 (Toprak)',
    type: ResourceType.TENNIS_COURT,
    description: 'Açık hava toprak zeminli tenis kortu',
    business_id: 'business-5',
    branch_id: 'branch-uuid-4',
    is_active: true,
    price_per_hour: 180,
    image_url: 'https://example.com/tenniscourt2.jpg',
    max_capacity: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'resource-3',
    name: 'Kort 3 (Kapalı Alan)',
    type: ResourceType.TENNIS_COURT,
    description: 'Kapalı alan sert zeminli tenis kortu',
    business_id: 'business-5',
    branch_id: 'branch-uuid-4',
    is_active: true,
    price_per_hour: 200,
    image_url: 'https://example.com/tenniscourt3.jpg',
    max_capacity: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Örnek raketler
export const sampleTennisRackets: Resource[] = [
  {
    id: 'resource-4',
    name: 'Wilson Pro Staff',
    type: ResourceType.TENNIS_RACKET,
    description: 'Profesyonel oyuncular için Wilson marka raket',
    business_id: 'business-5',
    branch_id: 'branch-uuid-4',
    is_active: true,
    price_per_hour: 50,
    image_url: 'https://example.com/racket1.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'resource-5',
    name: 'Babolat Pure Drive',
    type: ResourceType.TENNIS_RACKET,
    description: 'Çok yönlü oyunculara uygun Babolat raket',
    business_id: 'business-5',
    branch_id: 'branch-uuid-4',
    is_active: true,
    price_per_hour: 45,
    image_url: 'https://example.com/racket2.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'resource-6',
    name: 'Head Graphene 360+',
    type: ResourceType.TENNIS_RACKET,
    description: 'Hız ve kontrol için tasarlanmış Head raket',
    business_id: 'business-5',
    branch_id: 'branch-uuid-4',
    is_active: true,
    price_per_hour: 55,
    image_url: 'https://example.com/racket3.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]; 