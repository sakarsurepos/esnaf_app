import { Tables } from "../../types/supabase";

// Gelecek tarihli randevu oluşturmak için yardımcı fonksiyon
const createFutureDate = (daysFromNow: number, hours: number, minutes: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

// Geçmiş tarihli randevu oluşturmak için yardımcı fonksiyon
const createPastDate = (daysAgo: number, hours: number, minutes: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

// Appointments için örnek veri
export const sampleAppointments: Tables<'appointments'>[] = [
  {
    id: 'appointment-uuid-1',
    service_id: 'service-uuid-1', // Erkek Saç Kesimi
    customer_id: 'user-uuid-3', // Mehmet
    business_id: 'business-uuid-1', // Ahmet Berber Salonu
    branch_id: 'branch-uuid-1', // Varsayılan şube
    staff_id: 'staff-uuid-1', // Ahmet (kendisi)
    appointment_time: createFutureDate(1, 14, 30), // Yarın 14:30
    location_type: 'on_site',
    address: null,
    status: 'confirmed',
    customer_note: 'Yanlardan kısa üstten az almayı tercih ediyorum.',
    total_price: 120.00
  },
  {
    id: 'appointment-uuid-2',
    service_id: 'service-uuid-3', // Cilt Bakımı
    customer_id: 'user-uuid-3', // Mehmet
    business_id: 'business-uuid-2', // Ayşe Güzellik Merkezi
    branch_id: 'branch-uuid-2', // Varsayılan şube
    staff_id: 'staff-uuid-2', // Ayşe (kendisi)
    appointment_time: createFutureDate(2, 11, 0), // 2 gün sonra 11:00
    location_type: 'on_site',
    address: null,
    status: 'pending',
    customer_note: 'İlk kez geliyorum.',
    total_price: 280.00
  },
  {
    id: 'appointment-uuid-3',
    service_id: 'service-uuid-4', // Ev Temizliği
    customer_id: 'user-uuid-2', // Ayşe
    business_id: 'business-uuid-3', // Profesyonel Temizlik Hizmetleri
    branch_id: 'branch-uuid-3', // Varsayılan şube 
    staff_id: 'staff-uuid-3', // Mehmet'in ekibinden biri
    appointment_time: createFutureDate(5, 10, 0), // 5 gün sonra 10:00
    location_type: 'at_home',
    address: 'Bağdat Caddesi No: 123, Kadıköy, İstanbul',
    status: 'confirmed',
    customer_note: 'Kapı kodu: 4567, 3. kat, daire 8.',
    total_price: 550.00
  },
  {
    id: 'appointment-uuid-4',
    service_id: 'service-uuid-1', // Erkek Saç Kesimi
    customer_id: 'user-uuid-1', // Ahmet
    business_id: 'business-uuid-2', // Ayşe Güzellik Merkezi
    branch_id: 'branch-uuid-2', // Varsayılan şube
    staff_id: 'staff-uuid-2', // Ayşe (kendisi)
    appointment_time: createPastDate(15, 13, 0), // 15 gün önce 13:00
    location_type: 'on_site',
    address: null,
    status: 'completed',
    customer_note: 'Klasik tarz istiyorum.',
    total_price: 150.00
  },
  {
    id: 'appointment-uuid-5',
    service_id: 'service-uuid-3', // Cilt Bakımı
    customer_id: 'user-uuid-1', // Ahmet
    business_id: 'business-uuid-2', // Ayşe Güzellik Merkezi
    branch_id: 'branch-uuid-2', // Varsayılan şube
    staff_id: 'staff-uuid-2', // Ayşe (kendisi)
    appointment_time: createFutureDate(7, 15, 30), // 7 gün sonra 15:30
    location_type: 'on_site',
    address: null,
    status: 'confirmed',
    customer_note: 'Yüz bakımı ve masaj istiyorum.',
    total_price: 350.00
  }
]; 