// Kullanıcı Tipleri
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  bio?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
}

// İşletme Tipleri
export interface Business {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// Şube Tipleri
export interface Branch {
  id: string;
  businessId: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
}

// Servis Kategorisi Tipleri
export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  isActive: boolean;
}

// Servis Tipleri
export interface Service {
  id: string;
  title: string;
  description?: string;
  price: number;
  categoryId?: string;
  businessId?: string;
  branchId?: string;
  staffId?: string;
  serviceTypeId?: string;
  durationMinutes?: number;
  isActive: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
}

// Randevu Tipleri
export interface Appointment {
  id: string;
  serviceId: string;
  customerId: string;
  businessId: string;
  branchId: string;
  staffId?: string;
  appointmentTime: string;
  locationType: 'on_site' | 'at_home' | 'online';
  address?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  customerNote?: string;
  totalPrice: number;
}

// Ödeme Tipleri
export interface Payment {
  id: string;
  appointmentId: string;
  paymentDate: string;
  paymentMethod: 'card' | 'bank_transfer' | 'QR' | 'wallet';
  amount: number;
  paymentStatus: 'successful' | 'failed' | 'pending';
} 