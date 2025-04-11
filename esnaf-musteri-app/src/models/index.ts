export { sampleUsers } from './users/sample';
export { sampleServiceCategories, sampleServiceSubcategories } from './service_categories/sample';
export { sampleBusinesses } from './businesses/sample';
export { sampleServices } from './services/sample';
export { sampleAppointments } from './appointments/sample';
export { sampleRoles } from './roles/sample';
export { sampleFavorites } from './favorites/sample';
export { sampleAddresses } from './addresses/sample';
export { samplePaymentMethods } from './payment_methods/sample';
export { sampleStaffMembers, sampleStaffProfiles } from './staff_members/sample';
export { sampleBusinessHours } from './business_hours/sample';
export { sampleReviews, sampleDetailedRatings, sampleBusinessReviewStats } from './reviews/sample';
export { sampleCampaigns, sampleCampaignAnalytics } from './campaigns/sample';

// Yeni modeller
export { sampleBusinessSettings } from './business_settings/sample';
export { sampleProducts, sampleProductServices } from './products/sample';
export { sampleOrders, sampleOrderItems } from './orders/sample';
export { samplePayments } from './payments/sample';
export { Resource, ResourceType, ResourceBooking, sampleTennisCourts, sampleTennisRackets } from './resources';

// Kullanım hakları için örnek veriler
export const sampleServicePackages = [
  {
    id: 'pkg-1',
    name: 'Premium Bakım Paketi',
    description: 'Aylık cilt bakımı seansları içerir',
    business_id: 'b1',
    price: 750,
    validity_period: 90, // 3 ay
    services: [
      { service_id: 's1', usage_limit: 3 },
      { service_id: 's2', usage_limit: 1 },
      { service_id: 's3', usage_limit: -1 }, // Sınırsız
    ],
    is_active: true
  },
  {
    id: 'pkg-2',
    name: 'Yıllık Kuaför Paketi',
    description: 'Yıllık 12 saç kesimi ve 4 boyama içerir',
    business_id: 'b2',
    price: 1200,
    validity_period: 365, // 1 yıl
    services: [
      { service_id: 's4', usage_limit: 12 },
      { service_id: 's5', usage_limit: 4 },
    ],
    is_active: true
  }
];

export const sampleMemberships = [
  {
    id: 'mem-1',
    name: 'Elite Güzellik Kulübü',
    description: 'Tüm güzellik hizmetlerimizden indirimli yararlanın',
    business_id: 'b1',
    price: 2500,
    duration: 12, // 12 ay
    packages: [
      { package_id: 'pkg-1', multiplier: 2 }, // Bu paket 2 kez kullanılabilir
    ],
    is_active: true
  }
];

export const sampleUserPurchases = [
  {
    id: 'pur-1',
    user_id: 'u1',
    purchase_date: '2023-01-01T10:00:00Z',
    expiry_date: '2023-12-31T23:59:59Z',
    type: 'service',
    reference_id: 's1', // Doğrudan hizmet satın alımı
    remaining_usage: 1,
    is_active: true
  },
  {
    id: 'pur-2',
    user_id: 'u1',
    purchase_date: '2023-02-15T10:00:00Z',
    expiry_date: '2023-05-15T23:59:59Z',
    type: 'package',
    reference_id: 'pkg-1', // Paket satın alımı
    remaining_usage: 10,
    is_active: true
  },
  {
    id: 'pur-3',
    user_id: 'u1',
    purchase_date: '2023-03-01T10:00:00Z',
    expiry_date: '2024-03-01T23:59:59Z',
    type: 'membership',
    reference_id: 'mem-1', // Üyelik satın alımı
    remaining_usage: 1,
    is_active: true
  }
]; 