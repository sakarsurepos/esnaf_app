import { Appointment } from "./types";

// Tarih yardımcı fonksiyonları
function createFutureDate(days: number, hour: number, minute: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

function createPastDate(days: number, hour: number, minute: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

// Appointments için örnek veri
export const sampleAppointments: Appointment[] = [
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
    total_price: 120.00,
    // Yeni alanlar
    payment_status: 'fully_paid',
    flow_type: 'direct_booking_flow',
    check_in_time: null,
    check_out_time: null,
    cancellation_reason: null,
    cancellation_time: null,
    refund_status: 'none',
    order_item_id: null
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
    total_price: 280.00,
    // Yeni alanlar
    payment_status: 'deposit_paid',
    flow_type: 'service_purchase_flow',
    check_in_time: null,
    check_out_time: null,
    cancellation_reason: null,
    cancellation_time: null,
    refund_status: 'none',
    order_item_id: null
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
    total_price: 550.00,
    // Yeni alanlar
    payment_status: 'unpaid',
    flow_type: 'direct_booking_flow',
    check_in_time: null,
    check_out_time: null,
    cancellation_reason: null,
    cancellation_time: null,
    refund_status: 'none',
    order_item_id: null
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
    total_price: 150.00,
    // Yeni alanlar
    payment_status: 'fully_paid',
    flow_type: 'direct_booking_flow',
    check_in_time: createPastDate(15, 13, 0),
    check_out_time: createPastDate(15, 13, 45),
    cancellation_reason: null,
    cancellation_time: null,
    refund_status: 'none',
    order_item_id: null
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
    total_price: 350.00,
    // Yeni alanlar
    payment_status: 'paid_with_package',
    flow_type: 'service_purchase_flow',
    check_in_time: null,
    check_out_time: null,
    cancellation_reason: null,
    cancellation_time: null,
    refund_status: 'none',
    order_item_id: 'order-item-uuid-2' // Paketten oluşturulan randevu
  },
  {
    id: 'appointment-uuid-6',
    service_id: 'service-uuid-3', // Cilt Bakımı
    customer_id: 'user-uuid-3', // Mehmet
    business_id: 'business-uuid-2', // Ayşe Güzellik Merkezi
    branch_id: 'branch-uuid-2', // Varsayılan şube
    staff_id: 'staff-uuid-2', // Ayşe (kendisi)
    appointment_time: createPastDate(5, 16, 0), // 5 gün önce 16:00
    location_type: 'on_site',
    address: null,
    status: 'cancelled',
    customer_note: 'Akşam seansı olsun.',
    total_price: 280.00,
    // Yeni alanlar
    payment_status: 'fully_paid',
    flow_type: 'direct_booking_flow',
    check_in_time: null,
    check_out_time: null,
    cancellation_reason: 'Müşteri tarafından iptal edildi',
    cancellation_time: createPastDate(6, 10, 0), // 6 gün önce 10:00
    refund_status: 'full', // Tam iade
    order_item_id: null
  }
]; 