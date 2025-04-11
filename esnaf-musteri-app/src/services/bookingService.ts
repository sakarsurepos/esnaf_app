import { supabase } from './supabaseClient';
import { 
  sampleAppointments, 
  sampleServices, 
  sampleBusinessSettings,
  sampleOrderItems
} from '../models';
import { Appointment } from '../models/appointments/types';
import { Service } from '../models/services/types';
import { BusinessSettings } from '../models/business_settings/types';
import { useMockData } from '../utils/mockUtils';

/**
 * Randevu oluşturabilme kontrolü yapar
 */
export const canCreateReservation = async (
  userId: string,
  serviceId: string,
  businessId: string,
  selectedTime: string,
  orderItemId?: string
): Promise<{ canCreate: boolean; reason?: string }> => {
  // Mock data için
  if (useMockData()) {
    // Hizmet ve işletme ayarlarını getir
    const service = sampleServices.find(s => s.id === serviceId);
    const businessSettings = sampleBusinessSettings.find(bs => bs.business_id === businessId);
    
    if (!service || !businessSettings) {
      return { canCreate: false, reason: 'Hizmet veya işletme bulunamadı' };
    }
    
    // Servis özel ayarları kullanılacak mı?
    const settings = service.override_business_settings && service.custom_settings
      ? service.custom_settings
      : businessSettings;
    
    // Direct booking flow kontrolü
    if (service.flow_type === 'direct_booking_flow') {
      // Free booking ise doğrudan izin ver
      if (settings.payment_policy === 'free_booking') {
        return { canCreate: true };
      }
      
      // Depozito gerekliyse, depozito kontrolü yap
      if (settings.payment_policy === 'deposit_required') {
        // Gerçek uygulamada payment service ile entegrasyon olacak
        return { canCreate: true, reason: 'Depozito ödemesi gerekiyor' };
      }
      
      // Tam ödeme gerekliyse, ödeme kontrolü yap
      if (settings.payment_policy === 'full_payment_required') {
        return { canCreate: true, reason: 'Tam ödeme gerekiyor' };
      }
    }
    
    // Service purchase flow kontrolü (paket kullanımı)
    if (service.flow_type === 'service_purchase_flow') {
      // Paket kullanımına izin var mı?
      if (!businessSettings.allow_package_use) {
        return { canCreate: false, reason: 'Bu işletme paket kullanımına izin vermiyor' };
      }
      
      // OrderItemId verilmişse, bu bir paket kullanımıdır
      if (orderItemId) {
        const orderItem = sampleOrderItems.find(oi => oi.id === orderItemId);
        if (!orderItem) {
          return { canCreate: false, reason: 'Geçersiz paket' };
        }
        
        if (orderItem.status !== 'unused') {
          return { canCreate: false, reason: 'Bu paket kullanılmış veya süresi dolmuş' };
        }
        
        return { canCreate: true };
      }
      
      // Paket belirtilmemişse, işletmenin ödeme politikasına göre kontrol et
      return canCreateReservation(userId, serviceId, businessId, selectedTime);
    }
    
    return { canCreate: false, reason: 'Bilinmeyen akış tipi' };
  }
  
  // Gerçek implementasyon için Supabase sorguları
  try {
    // İlgili servisi getir
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single();
      
    if (serviceError || !service) {
      return { canCreate: false, reason: 'Hizmet bulunamadı' };
    }
    
    // İşletme ayarlarını getir
    const { data: businessSettings, error: settingsError } = await supabase
      .from('business_settings')
      .select('*')
      .eq('business_id', businessId)
      .single();
      
    if (settingsError || !businessSettings) {
      return { canCreate: false, reason: 'İşletme ayarları bulunamadı' };
    }
    
    // ... (yukarıdaki mantık benzer şekilde implement edilir)
    
    return { canCreate: true };
  } catch (error) {
    console.error('Randevu kontrolü hatası:', error);
    return { canCreate: false, reason: 'Bir hata oluştu' };
  }
};

/**
 * Check-in yapabilme kontrolü
 */
export const canCheckIn = async (appointmentId: string): Promise<{ canCheckIn: boolean; reason?: string }> => {
  if (useMockData()) {
    const appointment = sampleAppointments.find(a => a.id === appointmentId);
    
    if (!appointment) {
      return { canCheckIn: false, reason: 'Randevu bulunamadı' };
    }
    
    // Ödeme durumu kontrolü
    if (appointment.payment_status === 'fully_paid' || 
        appointment.payment_status === 'deposit_paid' || 
        appointment.payment_status === 'paid_with_package') {
      return { canCheckIn: true };
    }
    
    return { canCheckIn: false, reason: 'Ödeme tamamlanmamış' };
  }
  
  // Gerçek implementasyon
  try {
    const { data: appointment, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single();
      
    if (error || !appointment) {
      return { canCheckIn: false, reason: 'Randevu bulunamadı' };
    }
    
    if (appointment.payment_status === 'fully_paid' || 
        appointment.payment_status === 'deposit_paid' || 
        appointment.payment_status === 'paid_with_package') {
      return { canCheckIn: true };
    }
    
    return { canCheckIn: false, reason: 'Ödeme tamamlanmamış' };
  } catch (error) {
    console.error('Check-in kontrolü hatası:', error);
    return { canCheckIn: false, reason: 'Bir hata oluştu' };
  }
};

/**
 * Randevu iptal edebilme ve iade kontrolü
 */
export const canCancelAppointment = async (
  appointmentId: string
): Promise<{ canCancel: boolean; refundType: 'none' | 'partial' | 'full'; reason?: string }> => {
  if (useMockData()) {
    const appointment = sampleAppointments.find(a => a.id === appointmentId);
    
    if (!appointment) {
      return { canCancel: false, refundType: 'none', reason: 'Randevu bulunamadı' };
    }
    
    // Randevu zamanını kontrol et
    const appointmentTime = new Date(appointment.appointment_time);
    const currentTime = new Date();
    
    // İşletme ayarlarını getir
    const businessSettings = sampleBusinessSettings.find(bs => bs.business_id === appointment.business_id);
    
    if (!businessSettings) {
      return { canCancel: false, refundType: 'none', reason: 'İşletme ayarları bulunamadı' };
    }
    
    // İade için zaman kontrolü
    const hoursDifference = (appointmentTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
    
    if (hoursDifference >= businessSettings.cancellation_policy.refundable_until_hours) {
      return { canCancel: true, refundType: 'full' };
    } else {
      return { canCancel: true, refundType: 'none', reason: 'İptal süresi geçmiş' };
    }
  }
  
  // Gerçek implementasyon...
  return { canCancel: true, refundType: 'full' };
};

/**
 * Paket kullanımı ile randevu oluşturma
 */
export const createAppointmentWithPackage = async (
  appointmentData: {
    customer_id: string;
    business_id: string;
    staff_id: string;
    service_id: string;
    start_time: string;
    end_time: string;
    notes?: string;
  },
  orderItemId: string
): Promise<{ data?: Appointment; error?: any }> => {
  if (useMockData()) {
    const orderItem = sampleOrderItems.find(oi => oi.id === orderItemId);
    
    if (!orderItem || orderItem.status !== 'unused') {
      return { error: 'Geçersiz veya kullanılmış paket' };
    }
    
    // Yeni randevu oluştur
    const newAppointment: Appointment = {
      id: `appointment-uuid-${Date.now()}`,
      ...appointmentData,
      appointment_time: appointmentData.start_time,
      location_type: 'on_site',
      address: null,
      branch_id: null,
      status: 'scheduled',
      customer_note: appointmentData.notes || null,
      total_price: 0, // Paket kullanımı olduğu için 0
      // Yeni alanlar
      payment_status: 'paid_with_package',
      flow_type: 'service_purchase_flow',
      check_in_time: null,
      check_out_time: null,
      cancellation_reason: null,
      cancellation_time: null,
      refund_status: 'none',
      order_item_id: orderItemId
    };
    
    // OrderItem'ı güncelle (kullanıldı olarak işaretle)
    // Bu gerçek uygulamada bir transaction içinde yapılmalı
    
    return { data: newAppointment };
  }
  
  // Gerçek implementasyon...
  return { data: undefined, error: 'Bu özellik henüz uygulanmadı' };
}; 