import { Tables } from "../../types/supabase";

// Users için örnek veri
export const sampleUsers: Tables<'users'>[] = [
  {
    id: 'user-uuid-1',
    first_name: 'Ahmet',
    last_name: 'Yılmaz',
    email: 'ahmet.yilmaz@example.com',
    password_hash: '123456', // Basit şifre: 123456
    bio: 'Profesyonel berber ve stilist',
    phone: '+905551234567',
    profile_image: 'https://example.com/images/ahmet.jpg',
    latitude: 41.0082,
    longitude: 28.9784,
    created_at: new Date().toISOString()
  },
  {
    id: 'user-uuid-2',
    first_name: 'Ayşe',
    last_name: 'Demir',
    email: 'ayse.demir@example.com',
    password_hash: '123456', // Basit şifre: 123456
    bio: 'Uzman makyaj sanatçısı',
    phone: '+905559876543',
    profile_image: 'https://example.com/images/ayse.jpg',
    latitude: 40.9916,
    longitude: 29.0210,
    created_at: new Date().toISOString()
  },
  {
    id: 'user-uuid-3',
    first_name: 'Mehmet',
    last_name: 'Kaya',
    email: 'mehmet.kaya@example.com',
    password_hash: '123456', // Basit şifre: 123456
    bio: 'Kurumsal müşteri',
    phone: '+905557894561',
    profile_image: null,
    latitude: 39.9208,
    longitude: 32.8541,
    created_at: new Date().toISOString()
  }
]; 