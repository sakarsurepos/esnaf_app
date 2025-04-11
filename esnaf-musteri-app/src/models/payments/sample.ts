import { Payment } from "./types";

// Payments için örnek veri
export const samplePayments: Payment[] = [
  {
    id: 'payment-uuid-1',
    appointment_id: 'appointment-uuid-1',
    order_id: null,
    customer_id: 'user-uuid-3', // Mehmet
    business_id: 'business-uuid-1', // Ahmet Berber Salonu
    amount: 120.00,
    payment_method: 'credit_card',
    status: 'completed',
    payment_time: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), // 2 gün önce
    transaction_id: 'txn-12345',
    is_deposit: false,
    created_at: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    updated_at: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString()
  },
  {
    id: 'payment-uuid-2',
    appointment_id: 'appointment-uuid-2',
    order_id: null,
    customer_id: 'user-uuid-3', // Mehmet
    business_id: 'business-uuid-2', // Ayşe Güzellik Merkezi
    amount: 84.00, // %30 depozito
    payment_method: 'credit_card',
    status: 'completed',
    payment_time: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(), // 3 gün önce
    transaction_id: 'txn-23456',
    is_deposit: true,
    created_at: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    updated_at: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString()
  },
  {
    id: 'payment-uuid-3',
    appointment_id: 'appointment-uuid-4',
    order_id: null,
    customer_id: 'user-uuid-1', // Ahmet
    business_id: 'business-uuid-2', // Ayşe Güzellik Merkezi
    amount: 150.00,
    payment_method: 'cash',
    status: 'completed',
    payment_time: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(), // 15 gün önce
    transaction_id: null,
    is_deposit: false,
    created_at: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
    updated_at: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString()
  },
  {
    id: 'payment-uuid-4',
    appointment_id: 'appointment-uuid-6',
    order_id: null,
    customer_id: 'user-uuid-3', // Mehmet
    business_id: 'business-uuid-2', // Ayşe Güzellik Merkezi
    amount: 280.00,
    payment_method: 'credit_card',
    status: 'refunded',
    payment_time: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(), // 7 gün önce
    transaction_id: 'txn-34567',
    is_deposit: false,
    created_at: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    updated_at: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString() // 5 gün önce güncellenmiş (iade)
  },
  {
    id: 'payment-uuid-5',
    appointment_id: null,
    order_id: 'order-uuid-1', // Paket satın alımı
    customer_id: 'user-uuid-1', // Ahmet
    business_id: 'business-uuid-2', // Ayşe Güzellik Merkezi
    amount: 750.00, // 3 Seanslık Cilt Bakım Paketi
    payment_method: 'credit_card',
    status: 'completed',
    payment_time: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(), // 10 gün önce
    transaction_id: 'txn-45678',
    is_deposit: false,
    created_at: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    updated_at: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString()
  }
]; 