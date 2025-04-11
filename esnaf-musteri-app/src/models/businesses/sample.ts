import { Tables } from "../../types/supabase";

// Businesses için örnek veri
export const sampleBusinesses: Tables<'businesses'>[] = [
  {
    id: 'business-uuid-1',
    name: 'Ahmet Berber Salonu',
    description: 'Kaliteli berberlik hizmetleri sunan modern bir salon.',
    phone: '+905551112233',
    email: 'info@ahmetberber.com',
    owner_id: 'user-uuid-1', // Ahmet'in kullanıcı ID'si
    is_active: true,
    approval_status: 'approved',
    created_at: new Date().toISOString()
  },
  {
    id: 'business-uuid-2',
    name: 'Ayşe Güzellik Merkezi',
    description: 'Profesyonel güzellik ve bakım hizmetleri.',
    phone: '+905553334455',
    email: 'iletisim@ayseguzellik.com',
    owner_id: 'user-uuid-2', // Ayşe'nin kullanıcı ID'si
    is_active: true,
    approval_status: 'approved',
    created_at: new Date().toISOString()
  },
  {
    id: 'business-uuid-3',
    name: 'Profesyonel Temizlik Hizmetleri',
    description: 'Ev ve ofisler için kapsamlı temizlik çözümleri.',
    phone: '+905554443322',
    email: 'info@profesyoneltemizlik.com',
    owner_id: 'user-uuid-3', // Mehmet'in kullanıcı ID'si
    is_active: true,
    approval_status: 'pending',
    created_at: new Date().toISOString()
  },
  {
    id: 'business-uuid-4',
    name: 'Ace Tenis Kulübü',
    description: 'Profesyonel tenis kortları ve eğitmenlerle kaliteli tenis hizmeti.',
    phone: '+905559998877',
    email: 'info@acetenis.com',
    owner_id: 'user-uuid-4', // Tenis kulübü sahibinin ID'si
    is_active: true,
    approval_status: 'approved',
    created_at: new Date().toISOString(),
    category: 'Spor Tesisleri',
    location: {
      latitude: 40.9876,
      longitude: 29.1234
    },
    address: 'Ataşehir Spor Kompleksi Yanı, Ataşehir/İstanbul',
    rating: 4.8,
    distance: 3.2
  }
]; 