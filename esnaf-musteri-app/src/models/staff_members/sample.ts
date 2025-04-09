import { Tables } from "../../types/supabase";

// Personeller için örnek veri
export const sampleStaffMembers: Tables<'staff_members'>[] = [
  {
    id: 'staff-uuid-1',
    user_id: 'user-uuid-1',
    business_id: 'business-uuid-1',
    branch_id: 'branch-uuid-1',
    position: 'Usta Berber',
    expertise: 'Saç ve Sakal Kesimi, Cilt Bakımı',
    is_active: true,
    joined_at: '2022-03-15T10:00:00Z',
    updated_at: new Date().toISOString()
  },
  {
    id: 'staff-uuid-2',
    user_id: 'user-uuid-4',
    business_id: 'business-uuid-1',
    branch_id: 'branch-uuid-1',
    position: 'Kalfa',
    expertise: 'Saç Kesimi, Fön',
    is_active: true,
    joined_at: '2022-06-20T10:00:00Z',
    updated_at: new Date().toISOString()
  },
  {
    id: 'staff-uuid-3',
    user_id: 'user-uuid-2',
    business_id: 'business-uuid-2',
    branch_id: 'branch-uuid-2',
    position: 'Salon Müdürü',
    expertise: 'Cilt Bakımı, Makyaj',
    is_active: true,
    joined_at: '2021-04-10T10:00:00Z',
    updated_at: new Date().toISOString()
  },
  {
    id: 'staff-uuid-4',
    user_id: 'user-uuid-5',
    business_id: 'business-uuid-2',
    branch_id: 'branch-uuid-2',
    position: 'Güzellik Uzmanı',
    expertise: 'Profesyonel Makyaj, Protez Tırnak',
    is_active: true,
    joined_at: '2022-01-05T10:00:00Z',
    updated_at: new Date().toISOString()
  },
  {
    id: 'staff-uuid-5',
    user_id: 'user-uuid-3',
    business_id: 'business-uuid-3',
    branch_id: 'branch-uuid-3',
    position: 'Temizlik Uzmanı',
    expertise: 'Derin Temizlik, Ofis Temizliği',
    is_active: true,
    joined_at: '2023-02-10T10:00:00Z',
    updated_at: new Date().toISOString()
  }
];

// Personel profilleri için ek bilgiler (gerçek bir tabloda bu veriler staff_profiles tablosunda olabilir)
export interface StaffProfileInfo {
  staff_id: string;
  full_name: string;
  profile_image: string | null;
  about: string | null;
  experience_years: number;
  average_rating: number;
  total_reviews: number;
  total_services: number;
}

// Personel profilleri için örnek veri
export const sampleStaffProfiles: StaffProfileInfo[] = [
  {
    staff_id: 'staff-uuid-1',
    full_name: 'Ahmet Yılmaz',
    profile_image: 'https://randomuser.me/api/portraits/men/32.jpg',
    about: '10 yılı aşkın deneyimli usta berber. Klasik ve modern tarzda saç ve sakal kesiminde uzman.',
    experience_years: 10,
    average_rating: 4.8,
    total_reviews: 235,
    total_services: 1250
  },
  {
    staff_id: 'staff-uuid-2',
    full_name: 'Hasan Kaya',
    profile_image: 'https://randomuser.me/api/portraits/men/44.jpg',
    about: 'Genç ve dinamik berber. Trend saç modellerinde uzmanlaşmış.',
    experience_years: 3,
    average_rating: 4.5,
    total_reviews: 78,
    total_services: 420
  },
  {
    staff_id: 'staff-uuid-3',
    full_name: 'Ayşe Demir',
    profile_image: 'https://randomuser.me/api/portraits/women/65.jpg',
    about: 'Profesyonel cilt bakımı ve kozmetik uzmanı. 15 yıllık sektör deneyimi ile hizmet vermektedir.',
    experience_years: 15,
    average_rating: 4.9,
    total_reviews: 310,
    total_services: 1850
  },
  {
    staff_id: 'staff-uuid-4',
    full_name: 'Zeynep Şahin',
    profile_image: 'https://randomuser.me/api/portraits/women/22.jpg',
    about: 'Profesyonel makyaj ve protez tırnak konusunda uzman. Özel günler için özel hizmet.',
    experience_years: 6,
    average_rating: 4.7,
    total_reviews: 126,
    total_services: 580
  },
  {
    staff_id: 'staff-uuid-5',
    full_name: 'Mehmet Temiz',
    profile_image: 'https://randomuser.me/api/portraits/men/57.jpg',
    about: 'Ev ve ofis temizliğinde uzmanlaşmış, detaylı ve özenli çalışma prensibini benimsemiş temizlik profesyoneli.',
    experience_years: 8,
    average_rating: 4.6,
    total_reviews: 95,
    total_services: 450
  }
]; 