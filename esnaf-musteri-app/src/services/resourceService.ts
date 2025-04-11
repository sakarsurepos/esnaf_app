import supabase from './supabase';
import { sampleResources, sampleResourceReservations, Resource, ResourceType, ResourceStatus, ResourceReservation } from '../models/resources';

// Geliştirme modunda örnek verileri kullanıp kullanmayacağımızı belirleyen değişken
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';
const IS_DEV = process.env.NODE_ENV === 'development';

// Mock veri mi yoksa gerçek Supabase'mi kullanacağımızı belirleyen fonksiyon
const useMockData = () => IS_DEV && USE_MOCK_DATA;

// Belirli bir işletme için tüm kaynakları getir
export const getBusinessResources = async (businessId: string, resourceType?: ResourceType) => {
  if (useMockData()) {
    let filteredResources = sampleResources.filter(resource => resource.business_id === businessId);
    
    // Eğer bir kaynak tipi belirtilmişse, o tipteki kaynakları filtrele
    if (resourceType) {
      filteredResources = filteredResources.filter(resource => resource.resource_type === resourceType);
    }
    
    return { 
      data: filteredResources, 
      error: null 
    };
  }
  
  // Gerçek Supabase sorgusu
  let query = supabase
    .from('resources')
    .select('*')
    .eq('business_id', businessId);
    
  if (resourceType) {
    query = query.eq('resource_type', resourceType);
  }
    
  return await query;
};

// Belirli bir kaynağın detaylarını getir
export const getResourceById = async (resourceId: string) => {
  if (useMockData()) {
    const resource = sampleResources.find(resource => resource.id === resourceId);
    return { 
      data: resource, 
      error: resource ? null : { message: 'Kaynak bulunamadı' }
    };
  }
  
  return await supabase
    .from('resources')
    .select('*')
    .eq('id', resourceId)
    .single();
};

// Belirli bir tarih ve saat aralığında müsait kaynakları getir
export const getAvailableResources = async (
  businessId: string,
  resourceType: ResourceType,
  startTime: string,
  endTime: string
) => {
  if (useMockData()) {
    // Önce işletmeye ait ve istenilen türdeki tüm aktif kaynakları al
    const resources = sampleResources.filter(resource => 
      resource.business_id === businessId && 
      resource.resource_type === resourceType &&
      resource.is_active === true &&
      resource.status === ResourceStatus.AVAILABLE
    );
    
    // Belirtilen zaman aralığında rezervasyonu olan kaynak ID'lerini bul
    const reservedResourceIds = sampleResourceReservations
      .filter(reservation => {
        const reservationStart = new Date(reservation.start_time);
        const reservationEnd = new Date(reservation.end_time);
        const requestStart = new Date(startTime);
        const requestEnd = new Date(endTime);
        
        // Zaman aralıkları çakışıyor mu kontrol et
        return (reservationStart < requestEnd && reservationEnd > requestStart);
      })
      .map(reservation => reservation.resource_id);
    
    // Rezerve edilmemiş kaynakları filtrele
    const availableResources = resources.filter(resource => 
      !reservedResourceIds.includes(resource.id)
    );
    
    return { 
      data: availableResources, 
      error: null 
    };
  }
  
  // Gerçek Supabase sorgusu (bu karmaşık bir sorgudur, örnek olarak gösterilmiştir)
  // Bu sorgu gerçek bir veritabanında nasıl uygulanacağına bağlı olarak değişebilir
  return await supabase.rpc('get_available_resources', {
    p_business_id: businessId,
    p_resource_type: resourceType,
    p_start_time: startTime,
    p_end_time: endTime
  });
};

// Yeni bir kaynak rezervasyonu oluştur
export const createResourceReservation = async (
  resourceId: string,
  appointmentId: string,
  startTime: string,
  endTime: string
) => {
  if (useMockData()) {
    // Kaynağın müsait olup olmadığını kontrol et
    const isAvailable = await checkResourceAvailability(resourceId, startTime, endTime);
    
    if (!isAvailable.data) {
      return {
        data: null,
        error: { message: 'Kaynak seçilen zaman aralığında müsait değil' }
      };
    }
    
    // Yeni rezervasyon oluştur
    const newReservation = {
      id: `resource-reservation-uuid-${Date.now()}`,
      resource_id: resourceId,
      appointment_id: appointmentId,
      start_time: startTime,
      end_time: endTime,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Mock gecikme simülasyonu
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: newReservation,
          error: null
        });
      }, 500);
    });
  }
  
  // Önce kaynağın müsaitliğini kontrol et
  const { data: isAvailable, error: availabilityError } = await checkResourceAvailability(resourceId, startTime, endTime);
  
  if (availabilityError) {
    return { data: null, error: availabilityError };
  }
  
  if (!isAvailable) {
    return { data: null, error: { message: 'Kaynak seçilen zaman aralığında müsait değil' } };
  }
  
  // Gerçek rezervasyon ekleme
  return await supabase
    .from('resource_reservations')
    .insert({
      resource_id: resourceId,
      appointment_id: appointmentId,
      start_time: startTime,
      end_time: endTime,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
};

// Belirli bir kaynağın müsaitlik durumunu kontrol et
export const checkResourceAvailability = async (
  resourceId: string,
  startTime: string,
  endTime: string
) => {
  if (useMockData()) {
    // Önce kaynağın aktif olup olmadığını kontrol et
    const resource = sampleResources.find(resource => resource.id === resourceId);
    
    if (!resource || !resource.is_active || resource.status !== ResourceStatus.AVAILABLE) {
      return { 
        data: false, 
        error: { message: 'Kaynak aktif değil veya kullanılamaz durumda' }
      };
    }
    
    // Kaynağın o zaman aralığında rezervasyonu var mı kontrol et
    const hasOverlappingReservation = sampleResourceReservations.some(reservation => {
      if (reservation.resource_id !== resourceId) return false;
      
      const reservationStart = new Date(reservation.start_time);
      const reservationEnd = new Date(reservation.end_time);
      const requestStart = new Date(startTime);
      const requestEnd = new Date(endTime);
      
      // Zaman aralıkları çakışıyor mu kontrol et
      return (reservationStart < requestEnd && reservationEnd > requestStart);
    });
    
    return { 
      data: !hasOverlappingReservation, 
      error: null 
    };
  }
  
  // Gerçek Supabase sorgusu
  return await supabase.rpc('check_resource_availability', {
    p_resource_id: resourceId,
    p_start_time: startTime,
    p_end_time: endTime
  });
};

// Belirli bir randevunun kaynak rezervasyonlarını getir
export const getAppointmentResources = async (appointmentId: string) => {
  if (useMockData()) {
    const reservations = sampleResourceReservations.filter(res => res.appointment_id === appointmentId);
    
    // Rezervasyon yapılan kaynakların detaylarını ekle
    const resourcesWithDetails = await Promise.all(
      reservations.map(async (reservation) => {
        const { data: resource } = await getResourceById(reservation.resource_id);
        return {
          ...reservation,
          resource
        };
      })
    );
    
    return { 
      data: resourcesWithDetails, 
      error: null 
    };
  }
  
  // Gerçek Supabase sorgusu
  return await supabase
    .from('resource_reservations')
    .select(`
      *,
      resource:resources(*)
    `)
    .eq('appointment_id', appointmentId);
}; 