import { Resource, ResourceType, ResourceStatus } from './types';

// Kaynak örnekleri - Tenis Kortları ve Raketler
export const sampleResources: Resource[] = [
  // Tenis Kortları
  {
    id: 'resource-uuid-1',
    business_id: 'business-uuid-4', // Ace Tenis Kulübü
    branch_id: 'branch-uuid-4',
    name: 'Kort A',
    description: 'Kırmızı kil zemin, standart ölçüler, açık alan',
    resource_type: ResourceType.TENNIS_COURT,
    status: ResourceStatus.AVAILABLE,
    image_url: '/assets/courts/court_a.jpg',
    details: {
      court_type: 'clay',
      is_covered: false
    },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'resource-uuid-2',
    business_id: 'business-uuid-4', // Ace Tenis Kulübü
    branch_id: 'branch-uuid-4',
    name: 'Kort B',
    description: 'Sert zemin, standart ölçüler, kapalı alan',
    resource_type: ResourceType.TENNIS_COURT,
    status: ResourceStatus.AVAILABLE,
    image_url: '/assets/courts/court_b.jpg',
    details: {
      court_type: 'hard',
      is_covered: true
    },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'resource-uuid-3',
    business_id: 'business-uuid-4', // Ace Tenis Kulübü
    branch_id: 'branch-uuid-4',
    name: 'Kort C',
    description: 'Çim zemin, standart ölçüler, açık alan',
    resource_type: ResourceType.TENNIS_COURT,
    status: ResourceStatus.MAINTENANCE,
    image_url: '/assets/courts/court_c.jpg',
    details: {
      court_type: 'grass',
      is_covered: false
    },
    is_active: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'resource-uuid-4',
    business_id: 'business-uuid-4', // Ace Tenis Kulübü
    branch_id: 'branch-uuid-4',
    name: 'Kort D',
    description: 'Halı zemin, standart ölçüler, kapalı alan',
    resource_type: ResourceType.TENNIS_COURT,
    status: ResourceStatus.AVAILABLE,
    image_url: '/assets/courts/court_d.jpg',
    details: {
      court_type: 'carpet',
      is_covered: true
    },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // Tenis Raketleri
  {
    id: 'resource-uuid-101',
    business_id: 'business-uuid-4', // Ace Tenis Kulübü
    branch_id: 'branch-uuid-4',
    name: 'Wilson Pro Staff 97',
    description: 'Profesyonel seviye tenis raketi',
    resource_type: ResourceType.TENNIS_RACKET,
    status: ResourceStatus.AVAILABLE,
    image_url: '/assets/rackets/wilson_prostaff.jpg',
    details: {
      brand: 'Wilson',
      model: 'Pro Staff 97',
      weight: 315,
      grip_size: 3,
      condition: 'good'
    },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'resource-uuid-102',
    business_id: 'business-uuid-4', // Ace Tenis Kulübü
    branch_id: 'branch-uuid-4',
    name: 'Head Speed MP',
    description: 'Orta seviye oyuncular için hız odaklı raket',
    resource_type: ResourceType.TENNIS_RACKET,
    status: ResourceStatus.AVAILABLE,
    image_url: '/assets/rackets/head_speed.jpg',
    details: {
      brand: 'Head',
      model: 'Speed MP',
      weight: 300,
      grip_size: 2,
      condition: 'good'
    },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'resource-uuid-103',
    business_id: 'business-uuid-4', // Ace Tenis Kulübü
    branch_id: 'branch-uuid-4',
    name: 'Babolat Pure Aero',
    description: 'Spin ve güç odaklı profesyonel raket',
    resource_type: ResourceType.TENNIS_RACKET,
    status: ResourceStatus.AVAILABLE,
    image_url: '/assets/rackets/babolat_pure_aero.jpg',
    details: {
      brand: 'Babolat',
      model: 'Pure Aero',
      weight: 300,
      grip_size: 3,
      condition: 'new'
    },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'resource-uuid-104',
    business_id: 'business-uuid-4', // Ace Tenis Kulübü
    branch_id: 'branch-uuid-4',
    name: 'Yonex VCORE 98',
    description: 'Orta-üst seviye oyuncular için denge odaklı raket',
    resource_type: ResourceType.TENNIS_RACKET,
    status: ResourceStatus.MAINTENANCE,
    image_url: '/assets/rackets/yonex_vcore.jpg',
    details: {
      brand: 'Yonex',
      model: 'VCORE 98',
      weight: 305,
      grip_size: 2,
      condition: 'fair',
      notes: 'Tel değişimi yapılıyor'
    },
    is_active: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'resource-uuid-105',
    business_id: 'business-uuid-4', // Ace Tenis Kulübü
    branch_id: 'branch-uuid-4',
    name: 'Prince Textreme Tour 100P',
    description: 'Başlangıç-orta seviye oyuncular için kontrol odaklı raket',
    resource_type: ResourceType.TENNIS_RACKET,
    status: ResourceStatus.AVAILABLE,
    image_url: '/assets/rackets/prince_textreme.jpg',
    details: {
      brand: 'Prince',
      model: 'Textreme Tour 100P',
      weight: 290,
      grip_size: 2,
      condition: 'good'
    },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Örnek kaynak rezervasyonları
export const sampleResourceReservations = [
  {
    id: 'resource-reservation-uuid-1',
    resource_id: 'resource-uuid-1', // Kort A
    appointment_id: 'appointment-uuid-101',
    start_time: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    end_time: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'resource-reservation-uuid-2',
    resource_id: 'resource-uuid-2', // Kort B
    appointment_id: 'appointment-uuid-102',
    start_time: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    end_time: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'resource-reservation-uuid-3',
    resource_id: 'resource-uuid-101', // Wilson Pro Staff 97 Raket
    appointment_id: 'appointment-uuid-103',
    start_time: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
    end_time: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]; 