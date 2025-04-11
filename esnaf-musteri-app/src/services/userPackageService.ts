import { Tables } from '../types/supabase';
import { ServiceType } from '../models/services/types';
import { useAuth } from '../contexts/AuthContext';
import { Alert } from 'react-native';
import supabase from '../lib/supabase';

// Kullanıcı Paketi veri türü
export interface UserPackage {
  id: string;
  user_id: string;
  package_id: string;
  package_name: string;
  business_id: string;
  business_name: string;
  purchase_date: Date;
  expiry_date: Date;
  total_services: number;  // Toplam hizmet sayısı
  used_services: number;   // Kullanılan hizmet sayısı
  remaining_services: number;  // Kalan hizmet sayısı
  status: 'active' | 'expired' | 'consumed';  // Paket durumu
  services: {
    service_id: string;
    service_name: string;
    total_count: number;
    used_count: number;
    remaining_count: number;
  }[];
}

// Kullanıcının tüm paketlerini getir
export const getUserPackages = async (userId: string): Promise<UserPackage[]> => {
  try {
    // Gerçek uygulamada burada Supabase sorgusu yapacağız
    // Şimdilik demo paketler oluşturalım
    
    // Demo kullanıcı paketleri
    const mockPackages: UserPackage[] = [
      {
        id: 'userpackage-1',
        user_id: userId,
        package_id: 'package-uuid-1',
        package_name: 'Aylık Tenis Üyelik Paketi',
        business_id: 'business-uuid-4',
        business_name: 'Ace Tenis Kulübü',
        purchase_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 hafta önce
        expiry_date: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000), // 23 gün sonra
        total_services: 10,
        used_services: 2,
        remaining_services: 8,
        status: 'active',
        services: [
          {
            service_id: 'service-uuid-8',
            service_name: 'Tek Kort Kiralama',
            total_count: 8,
            used_count: 2,
            remaining_count: 6
          },
          {
            service_id: 'service-uuid-10',
            service_name: 'Özel Tenis Dersi',
            total_count: 2,
            used_count: 0,
            remaining_count: 2
          }
        ]
      },
      {
        id: 'userpackage-2',
        user_id: userId,
        package_id: 'package-uuid-2',
        package_name: '5 Seanslık Masaj Paketi',
        business_id: 'business-uuid-2',
        business_name: 'Ayşe Güzellik Merkezi',
        purchase_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 gün önce 
        expiry_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 gün sonra
        total_services: 5,
        used_services: 2,
        remaining_services: 3,
        status: 'active',
        services: [
          {
            service_id: 'service-uuid-6',
            service_name: 'Özel Masaj Terapisi',
            total_count: 5,
            used_count: 2,
            remaining_count: 3
          }
        ]
      }
    ];
    
    return mockPackages;
  } catch (error) {
    console.error('Kullanıcı paketleri alınırken hata:', error);
    throw error;
  }
};

// Kullanıcının belirli bir paketi getir
export const getUserPackage = async (packageId: string): Promise<UserPackage | null> => {
  try {
    const userId = useAuth()?.user?.id || '';
    const userPackages = await getUserPackages(userId);
    return userPackages.find(p => p.id === packageId) || null;
  } catch (error) {
    console.error('Paket bilgisi alınırken hata:', error);
    throw error;
  }
};

// Belirli bir hizmet için kullanılabilecek paketleri getir
export const getUserPackagesForService = async (userId: string, serviceId: string): Promise<UserPackage[]> => {
  try {
    const userPackages = await getUserPackages(userId);
    
    // Sadece aktif, süresi dolmamış ve içinde ilgili hizmet olan paketleri filtrele
    return userPackages.filter(pkg => {
      // Paket aktif ve süresi dolmamış mı?
      const isActive = pkg.status === 'active' && new Date(pkg.expiry_date) > new Date();
      
      // Paketin içinde ilgili hizmet var mı ve kalan kullanım hakkı var mı?
      const hasService = pkg.services.some(s => 
        s.service_id === serviceId && s.remaining_count > 0
      );
      
      return isActive && hasService;
    });
  } catch (error) {
    console.error('Hizmet için paketler alınırken hata:', error);
    throw error;
  }
};

// Örnek veriler için import
import { sampleServices, sampleServicePackages, sampleMemberships, sampleUserPurchases } from '../models';

/**
 * Kullanıcının bir hizmeti kullanabilme hakkını kontrol eder
 * @param userId Kullanıcı ID'si
 * @param serviceId Hizmet ID'si
 * @returns Kullanılabilir satın alma ve kalan hak
 */
export const checkServiceUsageRights = async (userId: string, serviceId: string) => {
  if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_DATA === 'true') {
    // Örnek verileri kullan
    // 1. Doğrudan satın alınan hizmetleri kontrol et
    const directPurchases = sampleUserPurchases.filter(
      purchase => purchase.user_id === userId && 
                  purchase.type === 'service' && 
                  purchase.reference_id === serviceId &&
                  purchase.is_active &&
                  purchase.remaining_usage > 0 &&
                  new Date(purchase.expiry_date) > new Date()
    );
    
    if (directPurchases.length > 0) {
      return {
        hasRights: true,
        purchase: directPurchases[0],
        source: 'direct',
        remainingUsage: directPurchases[0].remaining_usage
      };
    }
    
    // 2. Paket içindeki hizmetleri kontrol et
    const packagePurchases = sampleUserPurchases.filter(
      purchase => purchase.user_id === userId && 
                 purchase.type === 'package' &&
                 purchase.is_active &&
                 purchase.remaining_usage > 0 &&
                 new Date(purchase.expiry_date) > new Date()
    );
    
    for (const packagePurchase of packagePurchases) {
      const servicePackage = sampleServicePackages.find(
        pkg => pkg.id === packagePurchase.reference_id
      );
      
      if (servicePackage) {
        const serviceInPackage = servicePackage.services.find(
          s => s.service_id === serviceId
        );
        
        if (serviceInPackage && (serviceInPackage.usage_limit === -1 || serviceInPackage.usage_limit > 0)) {
          return {
            hasRights: true,
            purchase: packagePurchase,
            source: 'package',
            remainingUsage: serviceInPackage.usage_limit === -1 ? -1 : serviceInPackage.usage_limit,
            packageInfo: servicePackage
          };
        }
      }
    }
    
    // 3. Üyelik içindeki paketleri kontrol et
    const membershipPurchases = sampleUserPurchases.filter(
      purchase => purchase.user_id === userId && 
                 purchase.type === 'membership' &&
                 purchase.is_active &&
                 purchase.remaining_usage > 0 &&
                 new Date(purchase.expiry_date) > new Date()
    );
    
    for (const membershipPurchase of membershipPurchases) {
      const membership = sampleMemberships.find(
        m => m.id === membershipPurchase.reference_id
      );
      
      if (membership) {
        for (const packageRef of membership.packages) {
          const servicePackage = sampleServicePackages.find(
            pkg => pkg.id === packageRef.package_id
          );
          
          if (servicePackage) {
            const serviceInPackage = servicePackage.services.find(
              s => s.service_id === serviceId
            );
            
            if (serviceInPackage && (serviceInPackage.usage_limit === -1 || serviceInPackage.usage_limit > 0)) {
              return {
                hasRights: true,
                purchase: membershipPurchase,
                source: 'membership',
                remainingUsage: serviceInPackage.usage_limit === -1 ? -1 : serviceInPackage.usage_limit,
                membershipInfo: membership,
                packageInfo: servicePackage
              };
            }
          }
        }
      }
    }
    
    return { hasRights: false };
  }
  
  // Gerçek veritabanı sorgusu - burada üç sorgu birleştirilecek
  try {
    // 1. Doğrudan satın alınan hizmetleri kontrol et
    const { data: directPurchases, error: directError } = await supabase
      .from('user_purchases')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'service')
      .eq('reference_id', serviceId)
      .eq('is_active', true)
      .gt('remaining_usage', 0)
      .gte('expiry_date', new Date().toISOString())
      .order('expiry_date', { ascending: true })
      .limit(1);
      
    if (directError) throw directError;
    
    if (directPurchases && directPurchases.length > 0) {
      return {
        hasRights: true,
        purchase: directPurchases[0],
        source: 'direct',
        remainingUsage: directPurchases[0].remaining_usage
      };
    }
    
    // 2. Paket içindeki hizmetleri kontrol et
    const { data: packagePurchases, error: packageError } = await supabase
      .from('user_purchases')
      .select(`
        *,
        service_package:reference_id (
          id,
          name,
          services:service_package_services (
            service_id,
            usage_limit
          )
        )
      `)
      .eq('user_id', userId)
      .eq('type', 'package')
      .eq('is_active', true)
      .gt('remaining_usage', 0)
      .gte('expiry_date', new Date().toISOString());
      
    if (packageError) throw packageError;
    
    if (packagePurchases) {
      for (const packagePurchase of packagePurchases) {
        const serviceInPackage = packagePurchase.service_package?.services?.find(
          (s: any) => s.service_id === serviceId
        );
        
        if (serviceInPackage && (serviceInPackage.usage_limit === -1 || serviceInPackage.usage_limit > 0)) {
          return {
            hasRights: true,
            purchase: packagePurchase,
            source: 'package',
            remainingUsage: serviceInPackage.usage_limit === -1 ? -1 : serviceInPackage.usage_limit,
            packageInfo: packagePurchase.service_package
          };
        }
      }
    }
    
    // 3. Üyelik içindeki paketleri kontrol et
    const { data: membershipPurchases, error: membershipError } = await supabase
      .from('user_purchases')
      .select(`
        *,
        membership:reference_id (
          id,
          name,
          packages:membership_packages (
            package_id,
            multiplier,
            service_package:package_id (
              id,
              name,
              services:service_package_services (
                service_id,
                usage_limit
              )
            )
          )
        )
      `)
      .eq('user_id', userId)
      .eq('type', 'membership')
      .eq('is_active', true)
      .gt('remaining_usage', 0)
      .gte('expiry_date', new Date().toISOString());
      
    if (membershipError) throw membershipError;
    
    if (membershipPurchases) {
      for (const membershipPurchase of membershipPurchases) {
        for (const packageRef of membershipPurchase.membership?.packages || []) {
          const serviceInPackage = packageRef.service_package?.services?.find(
            (s: any) => s.service_id === serviceId
          );
          
          if (serviceInPackage && (serviceInPackage.usage_limit === -1 || serviceInPackage.usage_limit > 0)) {
            return {
              hasRights: true,
              purchase: membershipPurchase,
              source: 'membership',
              remainingUsage: serviceInPackage.usage_limit === -1 ? -1 : serviceInPackage.usage_limit,
              membershipInfo: membershipPurchase.membership,
              packageInfo: packageRef.service_package
            };
          }
        }
      }
    }
    
    return { hasRights: false };
  } catch (error) {
    console.error('Kullanım hakları kontrol edilirken hata:', error);
    throw new Error('Kullanım hakları kontrol edilirken bir sorun oluştu');
  }
};

/**
 * Bir hizmet için kullanım hakkını kullanır
 * @param userId Kullanıcı ID'si
 * @param serviceId Hizmet ID'si
 * @param appointmentId İlişkili randevu ID'si (opsiyonel)
 * @returns İşlem başarılı mı
 */
export const useServiceRight = async (userId: string, serviceId: string, appointmentId?: string) => {
  try {
    // Önce kullanım hakkını kontrol et
    const rights = await checkServiceUsageRights(userId, serviceId);
    
    if (!rights.hasRights) {
      throw new Error('Bu hizmet için kullanım hakkınız bulunmuyor');
    }
    
    if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_DATA === 'true') {
      // Örnek veriler için
      const purchase = rights.purchase;
      
      if (purchase.remaining_usage !== -1) {
        purchase.remaining_usage -= 1;
      }
      
      // Kullanım kaydı oluştur
      const usageRecord = {
        id: `usage-${Date.now()}`,
        user_id: userId,
        purchase_id: purchase.id,
        service_id: serviceId,
        usage_date: new Date().toISOString(),
        appointment_id: appointmentId,
      };
      
      console.log('Kullanım kaydı oluşturuldu:', usageRecord);
      
      return true;
    }
    
    // Gerçek veritabanı işlemleri
    // 1. Kalan kullanım hakkını azalt (eğer sınırsız değilse)
    if (rights.purchase.remaining_usage !== -1) {
      const { error: updateError } = await supabase
        .from('user_purchases')
        .update({ remaining_usage: rights.purchase.remaining_usage - 1 })
        .eq('id', rights.purchase.id);
        
      if (updateError) throw updateError;
    }
    
    // 2. Kullanım kaydı oluştur
    const { error: insertError } = await supabase
      .from('usage_records')
      .insert([
        {
          user_id: userId,
          purchase_id: rights.purchase.id,
          service_id: serviceId,
          usage_date: new Date().toISOString(),
          appointment_id: appointmentId,
        }
      ]);
      
    if (insertError) throw insertError;
    
    return true;
  } catch (error) {
    console.error('Kullanım hakkı kullanılırken hata:', error);
    throw new Error('Kullanım hakkı kullanılırken bir sorun oluştu');
  }
};

/**
 * Kullanıcının satın aldığı aktif paketleri getirir
 * @param userId Kullanıcı ID'si
 * @returns Aktif paketler listesi
 */
export const getUserActivePackages = async (userId: string) => {
  if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_DATA === 'true') {
    // Örnek paket satın alımlarını al
    const packagePurchases = sampleUserPurchases.filter(
      purchase => purchase.user_id === userId && 
                 purchase.type === 'package' &&
                 purchase.is_active &&
                 purchase.remaining_usage > 0 &&
                 new Date(purchase.expiry_date) > new Date()
    );
    
    // Paket detaylarını ekle
    const packagesWithDetails = packagePurchases.map(purchase => {
      const packageDetails = sampleServicePackages.find(pkg => pkg.id === purchase.reference_id);
      return {
        ...purchase,
        packageDetails
      };
    });
    
    return packagesWithDetails;
  }
  
  // Gerçek veritabanı sorgusu
  try {
    const { data, error } = await supabase
      .from('user_purchases')
      .select(`
        *,
        packageDetails:reference_id (*)
      `)
      .eq('user_id', userId)
      .eq('type', 'package')
      .eq('is_active', true)
      .gt('remaining_usage', 0)
      .gte('expiry_date', new Date().toISOString());
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Kullanıcı paketleri getirilirken hata:', error);
    throw new Error('Kullanıcı paketleri getirilirken bir sorun oluştu');
  }
};

/**
 * Belirli bir paket (veya alt paketi) bir randevu için kullanılabilir mi kontrol eder
 * @param packageId Paket veya üyelik ID'si
 * @param serviceId Hizmet ID'si
 * @returns Kullanılabilir mi
 */
export const usePackageForAppointment = async (packageId: string, serviceId: string): Promise<boolean> => {
  try {
    // Bu fonksiyon, randevu oluşturma aşamasında paket kullanımını onaylar
    // ve hizmeti bu paket üzerinden kullanır
    
    // Burada kullanıcı ID'sini de almalıyız, ancak örnek için basitleştirdik
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Kullanıcı kimliği doğrulanamadı');
    }
    
    // Kullanım hakkını kontrol et
    const userId = user.id;
    
    // Normalde useServiceRight fonksiyonunu kullanabiliriz, ancak
    // burada pakete özgü kullanım hakkını kontrol ediyoruz
    
    if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_DATA === 'true') {
      console.log(`Paket #${packageId} hizmet #${serviceId} için kullanıldı`);
      return true;
    }
    
    // Gerçek kullanım kontrolü useServiceRight ile yapılabilir
    await useServiceRight(userId, serviceId);
    return true;
    
  } catch (error) {
    console.error('Paket kullanımında hata:', error);
    Alert.alert('Hata', 'Paket kullanımında bir sorun oluştu.');
    return false;
  }
};

// Yeni paket satın alma
export const purchasePackage = async (userId: string, packageId: string): Promise<UserPackage> => {
  try {
    // Gerçek uygulamada Supabase'e yeni kayıt ekleyeceğiz
    console.log(`Yeni paket satın alındı: Kullanıcı ID ${userId}, Paket ID ${packageId}`);
    
    // Test için sahte bir UserPackage objesi döndürelim
    return {
      id: `userpackage-${Date.now()}`,
      user_id: userId,
      package_id: packageId,
      package_name: 'Yeni Satın Alınan Paket',
      business_id: 'business-uuid-1',
      business_name: 'Test İşletmesi',
      purchase_date: new Date(),
      expiry_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 gün sonra
      total_services: 10,
      used_services: 0,
      remaining_services: 10,
      status: 'active',
      services: [
        {
          service_id: 'service-uuid-1',
          service_name: 'Test Hizmeti',
          total_count: 10,
          used_count: 0,
          remaining_count: 10
        }
      ]
    };
  } catch (error) {
    console.error('Paket satın alınırken hata:', error);
    throw error;
  }
}; 