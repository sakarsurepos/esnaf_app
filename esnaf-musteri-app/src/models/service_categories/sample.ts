import { Tables } from "../../types/supabase";

// Service Categories için örnek veri
export const sampleServiceCategories: Tables<'service_categories'>[] = [
  {
    id: 'category-uuid-1',
    name: 'Berber & Kuaför',
    description: 'Saç kesimi, sakal tıraşı ve saç şekillendirme hizmetleri',
    icon_url: 'cut-outline',
    is_active: true
  },
  {
    id: 'category-uuid-2',
    name: 'Güzellik & Bakım',
    description: 'Manikür, pedikür, cilt bakımı ve makyaj hizmetleri',
    icon_url: 'flower-outline',
    is_active: true
  },
  {
    id: 'category-uuid-3',
    name: 'Masaj & Spa',
    description: 'Masaj, terapi ve spa hizmetleri',
    icon_url: 'body-outline',
    is_active: true
  },
  {
    id: 'category-uuid-4',
    name: 'Temizlik',
    description: 'Ev ve ofis temizlik hizmetleri',
    icon_url: 'water-outline',
    is_active: true
  },
  {
    id: 'category-uuid-5',
    name: 'Tamir & Tadilat',
    description: 'Genel tamir ve tadilat hizmetleri',
    icon_url: 'hammer-outline',
    is_active: true
  }
]; 