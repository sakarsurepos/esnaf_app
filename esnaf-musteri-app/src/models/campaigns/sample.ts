import { Campaign, CampaignAnalytics } from './types';

const currentDate = new Date().toISOString();
const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);
const nextMonth = new Date();
nextMonth.setMonth(nextMonth.getMonth() + 1);

export const sampleCampaigns: Campaign[] = [
  {
    id: '1',
    title: 'Hoş Geldin İndirimi',
    description: 'Yeni üyelere özel ilk siparişlerinde %15 indirim',
    imageUrl: 'https://example.com/images/welcome-discount.jpg',
    startDate: '2023-01-01T00:00:00Z',
    endDate: nextMonth.toISOString(),
    discountRate: 15,
    discountCode: 'HOSGELDIN15',
    isFeatured: true,
    status: 'active',
    termsAndConditions: 'Sadece yeni üyeler için geçerlidir. Diğer kampanyalarla birleştirilemez.',
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Berber Haftası',
    description: 'Tüm berber hizmetlerinde %20 indirim',
    imageUrl: 'https://example.com/images/barber-week.jpg',
    startDate: currentDate,
    endDate: nextWeek.toISOString(),
    categoryId: 'berber-1',
    discountRate: 20,
    discountCode: 'BERBER20',
    minPurchaseAmount: 100,
    maxUsageCount: 300,
    usageCount: 134,
    isFeatured: true,
    status: 'active',
    termsAndConditions: 'Sadece berber kategorisindeki hizmetlerde geçerlidir.',
    createdAt: '2023-05-15T00:00:00Z',
    updatedAt: '2023-05-20T10:30:00Z'
  },
  {
    id: '3',
    title: 'Kuaför Özel',
    description: 'Saç kesimi ve boyama birlikte alana %25 indirim',
    imageUrl: 'https://example.com/images/hairdresser-special.jpg',
    startDate: currentDate,
    endDate: nextMonth.toISOString(),
    businessId: 'business-1',
    categoryId: 'kuafor-1',
    discountRate: 25,
    minPurchaseAmount: 200,
    isFeatured: false,
    status: 'active',
    createdAt: '2023-06-01T00:00:00Z'
  },
  {
    id: '4',
    title: 'Yaz Sezonu Kampanyası',
    description: 'Yaz boyunca tüm cilt bakım hizmetlerinde %10 indirim',
    imageUrl: 'https://example.com/images/summer-special.jpg',
    startDate: nextWeek.toISOString(),
    endDate: '2023-09-01T00:00:00Z',
    categoryId: 'cilt-bakimi-1',
    discountRate: 10,
    isFeatured: true,
    status: 'upcoming',
    createdAt: '2023-06-10T00:00:00Z'
  },
  {
    id: '5',
    title: 'Kış İndirimi',
    description: 'Geçmiş kış sezonuna özel kampanya',
    imageUrl: 'https://example.com/images/winter-discount.jpg',
    startDate: '2022-12-01T00:00:00Z',
    endDate: '2023-03-01T00:00:00Z',
    discountRate: 30,
    discountCode: 'KIS30',
    maxUsageCount: 500,
    usageCount: 487,
    isFeatured: false,
    status: 'expired',
    createdAt: '2022-11-15T00:00:00Z',
    updatedAt: '2023-03-02T00:00:00Z'
  }
];

export const sampleCampaignAnalytics: CampaignAnalytics[] = [
  {
    campaignId: '1',
    totalUsage: 342,
    totalDiscountAmount: 15670,
    averageOrderValue: 350,
    conversionRate: 0.15,
    viewCount: 2280,
    clickCount: 865
  },
  {
    campaignId: '2',
    totalUsage: 134,
    totalDiscountAmount: 8940,
    averageOrderValue: 420,
    conversionRate: 0.22,
    viewCount: 1450,
    clickCount: 610
  },
  {
    campaignId: '3',
    totalUsage: 78,
    totalDiscountAmount: 5460,
    averageOrderValue: 280,
    conversionRate: 0.12,
    viewCount: 950,
    clickCount: 325
  },
  {
    campaignId: '5',
    totalUsage: 487,
    totalDiscountAmount: 29220,
    averageOrderValue: 390,
    conversionRate: 0.28,
    viewCount: 3450,
    clickCount: 1740
  }
]; 