import { Resource, ResourceType, sampleTennisCourts, sampleTennisRackets } from '../models/resources';

class ResourceService {
  // Belirli bir işletmeye ait tüm kaynakları getir
  async getResourcesByBusiness(businessId: string): Promise<Resource[]> {
    // Mock veri: Gerçek uygulamada API'den çekilecek
    const allResources = [...sampleTennisCourts, ...sampleTennisRackets];
    return allResources.filter(resource => resource.business_id === businessId);
  }

  // Belirli bir işletme ve şubeye ait, belirli bir kaynak tipindeki tüm kaynakları getir
  async getResourcesByTypeAndBranch(
    businessId: string,
    branchId: string,
    resourceType: ResourceType
  ): Promise<Resource[]> {
    // Mock veri: Gerçek uygulamada API'den çekilecek
    const allResources = [...sampleTennisCourts, ...sampleTennisRackets];
    return allResources.filter(
      resource => 
        resource.business_id === businessId &&
        resource.branch_id === branchId &&
        resource.type === resourceType
    );
  }

  // Kaynak ID'lerine göre kaynakları getir
  async getResourcesByIds(resourceIds: string[]): Promise<Resource[]> {
    // Mock veri: Gerçek uygulamada API'den çekilecek
    const allResources = [...sampleTennisCourts, ...sampleTennisRackets];
    return allResources.filter(resource => resourceIds.includes(resource.id));
  }

  // Belirli bir tarih ve saat için müsait kaynakları getir
  async getAvailableResources(
    businessId: string,
    branchId: string,
    resourceType: ResourceType,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<Resource[]> {
    // Gerçek uygulamada, bu tarih ve saat aralığında rezervasyonu olmayan kaynaklar filtrelenecek
    // Şimdilik mock veri olarak tüm aktif kaynakları döndürüyoruz
    const resources = await this.getResourcesByTypeAndBranch(businessId, branchId, resourceType);
    return resources.filter(resource => resource.is_active);
  }

  // Bir kaynağın belirli bir tarih ve saat için müsait olup olmadığını kontrol et
  async isResourceAvailable(
    resourceId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    // Gerçek uygulamada, bu tarih ve saat aralığında kaynağın rezervasyonu olup olmadığı kontrol edilecek
    // Şimdilik her zaman müsait olarak dönüyoruz
    return true;
  }

  // Seçilen kaynakların toplam fiyatını hesapla
  calculateTotalPrice(resources: Resource[], durationHours: number): number {
    return resources.reduce((total, resource) => {
      return total + (resource.price_per_hour || 0) * durationHours;
    }, 0);
  }
}

export const resourceService = new ResourceService(); 