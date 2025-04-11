export interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  startDate: string; // ISO 8601 formatında
  endDate: string; // ISO 8601 formatında
  businessId?: string; // Eğer belirli bir işletmeye özel ise
  categoryId?: string; // Eğer belirli bir kategoriye özel ise
  discountRate?: number; // Yüzde olarak indirim oranı (örn. 20 = %20)
  discountCode?: string; // Kullanılacak indirim kodu
  minPurchaseAmount?: number; // Minimum satın alma tutarı
  maxUsageCount?: number; // Maksimum kullanım sayısı
  usageCount?: number; // Şu ana kadar kullanım sayısı
  isFeatured: boolean; // Öne çıkan kampanya mı
  status: 'active' | 'upcoming' | 'expired'; // Kampanya durumu
  termsAndConditions?: string; // Kampanya koşulları
  createdAt: string; // ISO 8601 formatında
  updatedAt?: string; // ISO 8601 formatında
}

export interface CampaignUsage {
  id: string;
  campaignId: string;
  userId: string;
  usedAt: string; // ISO 8601 formatında
  orderId?: string;
  amount?: number; // İndirim miktarı
}

export interface CampaignFilter {
  businessId?: string;
  categoryId?: string;
  status?: 'active' | 'upcoming' | 'expired';
  isFeatured?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface CampaignAnalytics {
  campaignId: string;
  totalUsage: number;
  totalDiscountAmount: number;
  averageOrderValue: number;
  conversionRate: number; // Görüntülenme / Kullanım oranı
  viewCount: number;
  clickCount: number;
} 