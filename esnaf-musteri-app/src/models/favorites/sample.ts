import { Tables } from "../../types/supabase";

// Favorites için örnek veri
export const sampleFavorites: Tables<'favorites'>[] = [
  {
    id: 'favorite-uuid-1',
    user_id: 'user-uuid-3', // Mehmet
    service_id: 'service-uuid-1' // Erkek Saç Kesimi
  },
  {
    id: 'favorite-uuid-2',
    user_id: 'user-uuid-3', // Mehmet
    service_id: 'service-uuid-3' // Cilt Bakımı
  },
  {
    id: 'favorite-uuid-3',
    user_id: 'user-uuid-2', // Ayşe
    service_id: 'service-uuid-4' // Ev Temizliği
  },
  {
    id: 'favorite-uuid-4',
    user_id: 'user-uuid-1', // Ahmet
    service_id: 'service-uuid-3' // Cilt Bakımı
  },
  {
    id: 'favorite-uuid-5',
    user_id: 'user-uuid-1', // Ahmet
    service_id: 'service-uuid-4' // Ev Temizliği
  }
]; 