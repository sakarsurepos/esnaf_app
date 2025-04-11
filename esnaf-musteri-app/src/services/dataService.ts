import supabase, { getUser, getBusiness, getService, getAppointment } from './supabase';
import { sampleUsers, sampleBusinesses, sampleServices, sampleAppointments, sampleServiceCategories, sampleFavorites, sampleAddresses, samplePaymentMethods, sampleStaffMembers, sampleStaffProfiles, sampleBusinessHours, sampleCampaigns } from '../models';
import { Tables } from '../types/supabase';
import { PaymentMethod } from '../models/payment_methods/sample';
import { StaffProfileInfo } from '../models/staff_members/sample';
import { ExtendedServiceCategory } from "../models/service_categories/types";
import { Campaign } from '../models/campaigns/types';

// Geliştirme modunda örnek verileri kullanıp kullanmayacağımızı belirleyen değişken
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';
const IS_DEV = process.env.NODE_ENV === 'development';

// Mock veri mi yoksa gerçek Supabase'mi kullanacağımızı belirleyen fonksiyon
const useMockData = () => IS_DEV && USE_MOCK_DATA;

// KULLANICI İŞLEMLERİ
export const getUserData = async (userId: string) => {
  if (useMockData()) {
    const user = sampleUsers.find(user => user.id === userId);
    return { 
      data: user, 
      error: user ? null : { message: 'Kullanıcı bulunamadı' }
    };
  }
  
  return await getUser(userId);
};

export const getAllUsers = async () => {
  if (useMockData()) {
    return { 
      data: sampleUsers, 
      error: null 
    };
  }
  
  return await supabase.from('users').select('*');
};

// İŞLETME İŞLEMLERİ
export const getBusinessData = async (businessId: string) => {
  if (useMockData()) {
    const business = sampleBusinesses.find(business => business.id === businessId);
    return { 
      data: business, 
      error: business ? null : { message: 'İşletme bulunamadı' }
    };
  }
  
  return await getBusiness(businessId);
};

export const getAllBusinesses = async () => {
  if (useMockData()) {
    return { 
      data: sampleBusinesses, 
      error: null 
    };
  }
  
  return await supabase.from('businesses').select('*');
};

// HİZMET İŞLEMLERİ
export const getServiceData = async (serviceId: string) => {
  if (useMockData()) {
    const service = sampleServices.find(service => service.id === serviceId);
    return { 
      data: service, 
      error: service ? null : { message: 'Hizmet bulunamadı' }
    };
  }
  
  return await getService(serviceId);
};

export const getAllServices = async () => {
  if (useMockData()) {
    return { 
      data: sampleServices, 
      error: null 
    };
  }
  
  return await supabase.from('services').select('*');
};

// HİZMET KATEGORİLERİ
export const getAllServiceCategories = async () => {
  if (useMockData()) {
    return {
      data: sampleServiceCategories,
      error: null
    };
  }
  
  return {
    data: sampleServiceCategories,
    error: null
  };
};

// RANDEVU İŞLEMLERİ
export const getAppointmentData = async (appointmentId: string) => {
  if (useMockData()) {
    const appointment = sampleAppointments.find(appointment => appointment.id === appointmentId);
    return { 
      data: appointment, 
      error: appointment ? null : { message: 'Randevu bulunamadı' }
    };
  }
  
  return await getAppointment(appointmentId);
};

export const getAllAppointments = async () => {
  if (useMockData()) {
    return { 
      data: sampleAppointments, 
      error: null 
    };
  }
  
  return await supabase.from('appointments').select('*');
};

export const getUserAppointments = async (userId: string) => {
  if (useMockData()) {
    const userAppointments = sampleAppointments.filter(appointment => appointment.customer_id === userId);
    return { 
      data: userAppointments, 
      error: null 
    };
  }
  
  return await supabase
    .from('appointments')
    .select('*')
    .eq('customer_id', userId);
};

export const createAppointment = async (appointmentData: {
  service_id: string;
  staff_id: string;
  business_id: string;
  branch_id: string;
  appointment_time: string;
  location_type: 'business' | 'address';
  address?: string;
  address_id?: string | null;
  customer_id?: string;
  customer_note?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_price: number;
  payment_method_id?: string;
  payment_amount?: number;
  is_full_payment?: boolean;
  resources?: { // Seçilen kaynaklar (kort, raket vb.)
    resource_ids: string[];
    start_time?: string; // Belirtilmezse appointment_time kullanılır
    end_time?: string; // Belirtilmezse hizmetin süresine göre hesaplanır
  };
}) => {
  // Şu anda oturum açmış kullanıcı ID'sini al
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    return { 
      data: null, 
      error: { message: 'Kimlik doğrulama hatası: ' + userError.message } 
    };
  }
  
  if (!user) {
    return { 
      data: null, 
      error: { message: 'Randevu oluşturmak için giriş yapmalısınız' } 
    };
  }
  
  if (useMockData()) {
    const mockAppointment = {
      id: `appointment-uuid-${Date.now()}`,
      service_id: appointmentData.service_id,
      customer_id: appointmentData.customer_id || user.id,
      business_id: appointmentData.business_id,
      branch_id: appointmentData.branch_id,
      staff_id: appointmentData.staff_id,
      appointment_time: appointmentData.appointment_time,
      location_type: appointmentData.location_type,
      address: appointmentData.address || '',
      address_id: appointmentData.address_id || null,
      status: appointmentData.status,
      customer_note: appointmentData.customer_note || '',
      total_price: appointmentData.total_price,
      payment_method_id: appointmentData.payment_method_id || null,
      payment_amount: appointmentData.payment_amount || 0,
      is_full_payment: appointmentData.is_full_payment || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Mock randevu oluşturuldu:', mockAppointment);
    
    // Eğer kaynaklar (resources) belirtilmişse, bunları da kaydet
    if (appointmentData.resources && appointmentData.resources.resource_ids.length > 0) {
      // Kaynak rezervasyonlarını oluşturma işlemleri için resourceService'i kullanacağız
      // Bu kısım gerçek uygulamada ayrı bir serviste olacak
      console.log('Seçilen kaynaklar:', appointmentData.resources.resource_ids);
      
      // Gerçek uygulama için bu kaynakları rezerve etmek için resourceService kullanılabilir
    }
    
    // Mock gecikme oluşturarak asenkron çağrı davranışını simüle et
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ 
          data: mockAppointment,
          error: null
        });
      }, 1000);
    });
  }
  
  // Gerçek Supabase çağrısı
  const { resources, ...appointmentParams } = appointmentData; // resources'ı ayır
  
  // Önce randevuyu oluştur
  const { data: createdAppointment, error: appointmentError } = await supabase
    .from('appointments')
    .insert({
      ...appointmentParams,
      customer_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
    
  if (appointmentError || !createdAppointment) {
    return { data: null, error: appointmentError };
  }
  
  // Eğer kaynaklar belirtilmişse, kaynak rezervasyonlarını oluştur
  if (resources && resources.resource_ids.length > 0) {
    const appointmentId = createdAppointment.id;
    const startTime = resources.start_time || createdAppointment.appointment_time;
    
    // Bitiş zamanını hesapla (servis süresine göre)
    let endTime = resources.end_time;
    if (!endTime) {
      // Servis süresini al ve bitiş zamanını hesapla
      const { data: serviceData } = await getServiceData(createdAppointment.service_id);
      if (serviceData) {
        const startDate = new Date(startTime);
        const durationMinutes = serviceData.duration_minutes || 60; // Varsayılan 1 saat
        const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
        endTime = endDate.toISOString();
      } else {
        // Servis bilgisi bulunamazsa, varsayılan olarak 1 saat ekle
        const startDate = new Date(startTime);
        const endDate = new Date(startDate.getTime() + 60 * 60000);
        endTime = endDate.toISOString();
      }
    }
    
    // Her kaynak için rezervasyon oluştur
    const resourceReservationPromises = resources.resource_ids.map(resourceId => 
      supabase
        .from('resource_reservations')
        .insert({
          resource_id: resourceId,
          appointment_id: appointmentId,
          start_time: startTime,
          end_time: endTime,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
    );
    
    try {
      await Promise.all(resourceReservationPromises);
    } catch (error) {
      console.error('Kaynak rezervasyonu oluşturma hatası:', error);
      // Hata durumunda bile randevuyu dön, ama loglama yap
    }
  }
  
  return { data: createdAppointment, error: null };
};

// FAVORİ İŞLEMLERİ
export const getUserFavorites = async (userId: string) => {
  if (useMockData()) {
    const userFavorites = sampleFavorites.filter(favorite => favorite.user_id === userId);
    return { 
      data: userFavorites, 
      error: null 
    };
  }
  
  return await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId);
};

// ADRES İŞLEMLERİ
export const getUserAddresses = async (userId: string) => {
  if (useMockData()) {
    const userAddresses = sampleAddresses.filter(address => address.user_id === userId);
    return { 
      data: userAddresses, 
      error: null 
    };
  }
  
  return await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false });
};

export const addUserAddress = async (userId: string, addressData: Omit<Tables<'addresses'>, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
  const newAddress = {
    ...addressData,
    user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  if (useMockData()) {
    // Mock veri ekleme işlemi - gerçek uygulamada burada bir işlem yapılmaz
    console.log('Mock adres eklendi:', newAddress);
    return { 
      data: {
        ...newAddress,
        id: `address-uuid-${Date.now()}`, // Örnek bir ID
        user_id: userId
      }, 
      error: null 
    };
  }
  
  return await supabase
    .from('addresses')
    .insert(newAddress)
    .select()
    .single();
};

export const updateUserAddress = async (userId: string, addressId: string, addressData: Partial<Tables<'addresses'>>) => {
  // updated_at'i otomatik olarak güncelle
  const updateData = {
    ...addressData,
    updated_at: new Date().toISOString()
  };
  
  if (useMockData()) {
    // Mock veri güncelleme işlemi
    console.log('Mock adres güncellendi:', addressId, updateData);
    return { 
      data: {
        id: addressId,
        user_id: userId,
        name: "Örnek Adres",
        type: "home",
        address_line1: "Örnek adres bilgisi",
        address_line2: null,
        city: "İstanbul",
        state: "İstanbul",
        country: "Türkiye",
        postal_code: "34100",
        latitude: 41.0,
        longitude: 29.0,
        is_default: false,
        created_at: new Date().toISOString(),
        ...updateData
      }, 
      error: null 
    };
  }
  
  return await supabase
    .from('addresses')
    .update(updateData)
    .eq('id', addressId)
    .eq('user_id', userId)
    .select()
    .single();
};

export const deleteUserAddress = async (userId: string, addressId: string) => {
  if (useMockData()) {
    // Mock veri silme işlemi
    console.log('Mock adres silindi:', addressId);
    return { 
      data: null, 
      error: null 
    };
  }
  
  return await supabase
    .from('addresses')
    .delete()
    .eq('id', addressId)
    .eq('user_id', userId);
};

// ÖDEME YÖNTEMLERİ İŞLEMLERİ
export const getUserPaymentMethods = async (userId: string) => {
  if (useMockData()) {
    const userPaymentMethods = samplePaymentMethods.filter(payment => payment.user_id === userId);
    return { 
      data: userPaymentMethods, 
      error: null 
    };
  }
  
  // Gerçek bir Supabase çağrısı - mock için simüle ediyoruz
  console.log('Mock: getUserPaymentMethods çağrıldı');
  return { data: [], error: null };
  
  // Gerçek uygulamada bu kullanılacak (şema oluşturulduğunda)
  /*
  return await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false });
  */
};

export const addUserPaymentMethod = async (userId: string, paymentData: Omit<PaymentMethod, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
  const newPayment = {
    ...paymentData,
    user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  if (useMockData()) {
    // Mock veri ekleme işlemi
    console.log('Mock ödeme yöntemi eklendi:', newPayment);
    return { 
      data: {
        ...newPayment,
        id: `payment-uuid-${Date.now()}` // Örnek bir ID
      }, 
      error: null 
    };
  }
  
  // Gerçek bir Supabase çağrısı - mock için simüle ediyoruz
  console.log('Mock: addUserPaymentMethod çağrıldı');
  return { data: null, error: null };
  
  // Gerçek uygulamada bu kullanılacak (şema oluşturulduğunda)
  /*
  return await supabase
    .from('payment_methods')
    .insert(newPayment)
    .select()
    .single();
  */
};

export const updateUserPaymentMethod = async (userId: string, paymentId: string, paymentData: Partial<PaymentMethod>) => {
  // updated_at'i otomatik olarak güncelle
  const updateData = {
    ...paymentData,
    updated_at: new Date().toISOString()
  };
  
  if (useMockData()) {
    // Mock veri güncelleme işlemi
    console.log('Mock ödeme yöntemi güncellendi:', paymentId, updateData);
    return { 
      data: {
        id: paymentId,
        user_id: userId,
        name: "Örnek Kart",
        card_type: "Visa",
        last_digits: "0000",
        expires_at: "01/25",
        is_default: false,
        created_at: new Date().toISOString(),
        ...updateData
      }, 
      error: null 
    };
  }
  
  // Gerçek bir Supabase çağrısı - mock için simüle ediyoruz
  console.log('Mock: updateUserPaymentMethod çağrıldı');
  return { data: null, error: null };
  
  // Gerçek uygulamada bu kullanılacak (şema oluşturulduğunda)
  /*
  return await supabase
    .from('payment_methods')
    .update(updateData)
    .eq('id', paymentId)
    .eq('user_id', userId)
    .select()
    .single();
  */
};

export const deleteUserPaymentMethod = async (userId: string, paymentId: string) => {
  if (useMockData()) {
    // Mock veri silme işlemi
    console.log('Mock ödeme yöntemi silindi:', paymentId);
    return { 
      data: null, 
      error: null 
    };
  }
  
  // Gerçek bir Supabase çağrısı - mock için simüle ediyoruz
  console.log('Mock: deleteUserPaymentMethod çağrıldı');
  return { data: null, error: null };
  
  // Gerçek uygulamada bu kullanılacak (şema oluşturulduğunda)
  /*
  return await supabase
    .from('payment_methods')
    .delete()
    .eq('id', paymentId)
    .eq('user_id', userId);
  */
};

// GELİŞTİRME MODUNDA ÖRNEK VERİLERİ SUPABASE'E YÜKLEME
export const seedDatabaseWithSampleData = async () => {
  if (!IS_DEV) {
    console.error('Örnek veriler sadece geliştirme modunda yüklenebilir!');
    return { success: false, error: 'Sadece geliştirme modunda' };
  }
  
  try {
    // Tabloları temizle
    await supabase.from('favorites').delete().neq('id', 'placeholder');
    await supabase.from('appointments').delete().neq('id', 'placeholder');
    await supabase.from('services').delete().neq('id', 'placeholder');
    await supabase.from('businesses').delete().neq('id', 'placeholder');
    await supabase.from('service_categories').delete().neq('id', 'placeholder');
    await supabase.from('users').delete().neq('id', 'placeholder');
    await supabase.from('roles').delete().neq('id', 'placeholder');
    await supabase.from('addresses').delete().neq('id', 'placeholder');
    await supabase.from('staff_members').delete().neq('id', 'placeholder');
    await supabase.from('business_hours').delete().neq('id', 'placeholder');
    // await supabase.from('payment_methods').delete().neq('id', 'placeholder');
    
    // Örnek verileri yükle
    await supabase.from('roles').upsert(sampleServiceCategories);
    await supabase.from('users').upsert(sampleUsers);
    await supabase.from('service_categories').upsert(sampleServiceCategories);
    await supabase.from('businesses').upsert(sampleBusinesses);
    await supabase.from('services').upsert(sampleServices);
    await supabase.from('appointments').upsert(sampleAppointments);
    await supabase.from('favorites').upsert(sampleFavorites);
    await supabase.from('addresses').upsert(sampleAddresses);
    await supabase.from('staff_members').upsert(sampleStaffMembers);
    await supabase.from('business_hours').upsert(sampleBusinessHours);
    // await supabase.from('payment_methods').upsert(samplePaymentMethods);
    
    console.log('Örnek veriler başarıyla yüklendi');
    return { success: true };
  } catch (error) {
    console.error('Veri yükleme hatası:', error);
    return { success: false, error };
  }
};

// PERSONEL İŞLEMLERİ
export const getBusinessStaff = async (businessId: string) => {
  if (useMockData()) {
    const staffMembers = sampleStaffMembers.filter(staff => staff.business_id === businessId);
    return { 
      data: staffMembers, 
      error: null 
    };
  }
  
  return await supabase
    .from('staff_members')
    .select('*')
    .eq('business_id', businessId);
};

// Belirli bir işletme ve servis için personel listesini getir
export const getStaffByBusinessService = async (businessId: string, serviceId: string) => {
  if (useMockData()) {
    // Öncelikle tüm personelleri getir
    const allStaff = sampleStaffMembers.filter(
      staff => staff.business_id === businessId && staff.is_active
    );
    
    // Personel profillerini al
    const staffProfiles = sampleStaffProfiles.filter(
      profile => allStaff.some(staff => staff.id === profile.staff_id)
    );
    
    // Personelleri döndür
    const staffList = allStaff.map(staff => {
      const profile = staffProfiles.find(p => p.staff_id === staff.id);
      return {
        id: staff.id,
        name: profile?.full_name || staff.position || 'İsimsiz Personel',
        position: staff.position || 'Görev Belirtilmemiş',
        avatar: profile?.profile_image || 'https://randomuser.me/api/portraits/lego/1.jpg',
        rating: profile?.average_rating || 4.0,
        experience: profile?.experience_years || 1,
        description: profile?.about || undefined,
        isAvailable: true
      };
    });
    
    // Simüle edilmiş rassal gecikmeli yanıt
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(staffList);
      }, 800);
    });
  }
  
  // Gerçek uygulamada burada personel listesi getirilecek
  try {
    // Personel ve servis bilgilerini al
    const { data: staffMembers, error: staffError } = await supabase
      .from('staff_members')
      .select('*, staff_profiles(*)')
      .eq('business_id', businessId)
      .eq('is_active', true);
      
    if (staffError) throw staffError;
    
    if (!staffMembers || staffMembers.length === 0) {
      return [];
    }
    
    // Staff-service ilişkisini kontrol et (gerçek uygulamada)
    // Burada örnek olarak tüm personeli dönüyoruz
    return staffMembers.map(staff => ({
      id: staff.id,
      name: staff.staff_profiles?.full_name || staff.position || 'İsimsiz Personel',
      position: staff.position || 'Görev Belirtilmemiş',
      avatar: staff.staff_profiles?.profile_image || 'https://randomuser.me/api/portraits/lego/1.jpg',
      rating: staff.staff_profiles?.average_rating || 4.0,
      experience: staff.staff_profiles?.experience_years || 1,
      description: staff.staff_profiles?.about || undefined,
      isAvailable: true
    }));
  } catch (error) {
    console.error('Personel listesi alınırken hata:', error);
    throw error;
  }
};

// ZAMAN DİLİMLERİ İŞLEMLERİ
export const getAvailableTimeSlots = async (businessId: string, serviceId: string, date: Date, staffId: string) => {
  if (useMockData()) {
    // Mock veri için saat 09:00'dan 19:00'a kadar 30 dakikalık zaman dilimleri oluştur
    const timeSlots = [];
    const startHour = 9;
    const endHour = 19;
    
    // Örnek olarak, bazı zaman dilimlerini dolu göstermek için rastgele bir sayı belirleyelim
    // Personel ID'sine bağlı olarak farklı zaman dilimleri göstermek için staffId'yi kullanabilirsiniz
    const randomUnavailableCount = Math.floor(Math.random() * 5) + 2; // 2-6 arası rastgele sayıda dolu slot
    const unavailableSlots = new Set();
    
    // staffId'yi rastgele sayı üreteci için seed olarak kullanıyoruz
    // Bu, aynı personel için her seferinde aynı zaman dilimlerinin gösterilmesini sağlar
    const staffSeed = parseInt(staffId.replace(/\D/g, '').slice(0, 5) || '0', 10);
    const seedRandom = (min: number, max: number) => {
      const seed = (staffSeed * 9301 + 49297) % 233280;
      const rnd = seed / 233280;
      return Math.floor(min + rnd * (max - min));
    };
    
    for (let i = 0; i < randomUnavailableCount; i++) {
      const randomHour = seedRandom(startHour, endHour);
      const randomMinute = seedRandom(0, 2) < 1 ? 0 : 30;
      unavailableSlots.add(`${randomHour.toString().padStart(2, '0')}:${randomMinute.toString().padStart(2, '0')}`);
    }
    
    // Tüm olası zaman dilimlerini oluşturma
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute of [0, 30]) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Eğer bu zaman dilimi dolu olarak işaretlenmediyse, kullanılabilir olarak ekle
        if (!unavailableSlots.has(timeString)) {
          timeSlots.push(timeString);
        }
      }
    }
    
    // Mock gecikme oluşturarak asenkron çağrı davranışını simüle et
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(timeSlots);
      }, 800);
    });
  }
  
  // Gerçek implementasyon
  try {
    const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD formatına dönüştür
    
    const { data, error } = await supabase
      .from('available_time_slots')
      .select('time_slot')
      .eq('business_id', businessId)
      .eq('service_id', serviceId)
      .eq('staff_id', staffId) // Personele göre filtreleme eklendi
      .eq('date', formattedDate)
      .order('time_slot');
      
    if (error) throw error;
    
    // Zaman dilimleri varsa, bunları basit string dizisine dönüştür
    if (data && data.length > 0) {
      return data.map(slot => slot.time_slot);
    }
    
    // Zaman dilimi yoksa, varsayılan olarak bazı zaman dilimleri döndür
    // Bu kısım gerçek uygulamada, işletme çalışma saatlerine göre özelleştirilmelidir
    return ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
  } catch (error) {
    console.error('Zaman dilimleri alınırken hata:', error);
    throw error;
  }
};

// PERSONEL ERİŞİLEBİLİRLİK
export const getAvailableStaff = async (businessId: string, serviceId: string, dateTime: Date) => {
  if (useMockData()) {
    // Öncelikle tüm personelleri getir
    const allStaff = sampleStaffMembers.filter(
      staff => staff.business_id === businessId && staff.is_active
    );
    
    // İlgili hizmeti sunabilen personelleri filtrele
    // Gerçek uygulamada burada staff_services tablosundan kontrol yapılacak
    const serviceStaff = allStaff;
    
    // Personel profillerini al
    const staffProfiles = sampleStaffProfiles.filter(
      profile => serviceStaff.some(staff => staff.id === profile.staff_id)
    );
    
    // Randevuları kontrol et ve çakışan randevusu olan personelleri filtrele
    const appointmentDate = dateTime.toISOString().split('T')[0];
    const appointmentTime = dateTime.toISOString().split('T')[1].substring(0, 5);
    
    const bookedStaffIds = sampleAppointments
      .filter(appointment => {
        const appDate = new Date(appointment.appointment_time);
        return appDate.toISOString().split('T')[0] === appointmentDate &&
               appointment.status !== 'cancelled' &&
               serviceStaff.some(staff => staff.id === appointment.staff_id);
      })
      .map(appointment => appointment.staff_id);
    
    // Uygun personelleri döndür
    const availableStaff = serviceStaff
      .filter(staff => !bookedStaffIds.includes(staff.id))
      .map(staff => {
        const profile = staffProfiles.find(p => p.staff_id === staff.id);
        return {
          id: staff.id,
          name: profile?.full_name || staff.position || 'İsimsiz Personel',
          position: staff.position || 'Görev Belirtilmemiş',
          avatar: profile?.profile_image || 'https://randomuser.me/api/portraits/lego/1.jpg',
          rating: profile?.average_rating || 4.0,
          experience: profile?.experience_years || 1,
          description: profile?.about || undefined,
          isAvailable: true
        };
      });
    
    // Simüle edilmiş rassal gecikmeli yanıt
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(availableStaff);
      }, 800);
    });
  }
  
  // Gerçek uygulamada burada personel uygunluk kontrolü yapılacak
  console.log('Mock: getAvailableStaff çağrıldı');
  return [];
};

export const getStaffProfiles = async (staffIds: string[]) => {
  if (useMockData()) {
    const profiles = sampleStaffProfiles.filter(
      profile => staffIds.includes(profile.staff_id)
    );
    return { 
      data: profiles, 
      error: null 
    };
  }
  
  // Gerçek uygulamada burada staffIds listesi kullanılarak staff_profiles tablosundan veri çekilecek
  console.log('Mock: getStaffProfiles çağrıldı');
  return { data: [], error: null };
};

// ÇALIŞMA SAATLERİ İŞLEMLERİ
export const getBusinessHours = async (businessId: string) => {
  if (useMockData()) {
    const hours = sampleBusinessHours.filter(
      hour => hour.business_id === businessId
    );
    return { 
      data: hours, 
      error: null 
    };
  }
  
  return await supabase
    .from('business_hours')
    .select('*')
    .eq('business_id', businessId)
    .order('day_of_week', { ascending: true });
};

// İŞLETME DEĞERLENDİRME VE YORUMLARI
export interface BusinessReview {
  id: string;
  business_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export const getBusinessReviews = async (businessId: string) => {
  if (useMockData()) {
    // Örnek veri - gerçek uygulamada veritabanından gelecek
    const mockReviews: BusinessReview[] = [
      {
        id: 'review-uuid-1',
        business_id: businessId,
        user_id: 'user-uuid-1',
        user_name: 'Mehmet Y.',
        rating: 5,
        comment: 'Harika bir hizmet, çok memnun kaldım. Özellikle saç kesimi konusunda ustalar.',
        created_at: '2023-03-15T10:30:00Z'
      },
      {
        id: 'review-uuid-2',
        business_id: businessId,
        user_id: 'user-uuid-2',
        user_name: 'Ali K.',
        rating: 4,
        comment: 'İyi bir deneyimdi, fiyatlar biraz yüksek ama hizmet kaliteli.',
        created_at: '2023-02-28T15:45:00Z'
      },
      {
        id: 'review-uuid-3',
        business_id: businessId,
        user_id: 'user-uuid-3',
        user_name: 'Hasan T.',
        rating: 5,
        comment: 'Çok temiz bir salon, personel çok ilgili. Kesinlikle tavsiye ederim.',
        created_at: '2023-01-20T11:20:00Z'
      }
    ];
    
    return { 
      data: mockReviews, 
      error: null 
    };
  }
  
  // Gerçek uygulamada burada business_reviews tablosundan veri çekilecek
  console.log('Mock: getBusinessReviews çağrıldı');
  return { data: [], error: null };
};

// KAMPANYA İŞLEMLERİ
export const getAllCampaigns = async () => {
  if (useMockData()) {
    // Aktif ve öne çıkan kampanyaları filtrele
    const activeCampaigns = sampleCampaigns.filter(
      campaign => campaign.status === 'active' && campaign.isFeatured
    );
    
    return {
      data: activeCampaigns,
      error: null
    };
  }
  
  // Gerçek uygulamada Supabase'den kampanyaları getir
  return await supabase
    .from('campaigns')
    .select('*')
    .eq('status', 'active')
    .eq('is_featured', true);
};

// Geliştirici bilgisi
if (IS_DEV && USE_MOCK_DATA) {
  console.log('🧪 Geliştirme modu: Örnek veri kaynağı kullanılıyor');
} else {
  console.log('🔌 Gerçek Supabase veritabanı kullanılıyor');
} 