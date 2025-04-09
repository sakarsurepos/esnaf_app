import { Tables } from "../../types/supabase";

// Services için örnek veri
export const sampleServices: Tables<'services'>[] = [
  {
    id: 'service-uuid-1',
    title: 'Erkek Saç Kesimi',
    description: 'Profesyonel erkek saç kesimi hizmetimizde, deneyimli kuaförlerimiz tarafından kişiye özel stil ve kesim uygulanır.',
    price: 120.00,
    category_id: 'category-uuid-1', // Berber & Kuaför
    business_id: 'business-uuid-1', // Ahmet Berber Salonu
    duration_minutes: 30,
    branch_id: 'branch-uuid-1', // Varsayılan şube
    staff_id: 'staff-uuid-1', // Ahmet (kendisi)
    service_type_id: 'service-type-uuid-1', // on_site
    is_active: true,
    approval_status: 'approved'
  },
  {
    id: 'service-uuid-2',
    title: 'Sakal Tıraşı',
    description: 'Klasik ustura ile hassas sakal tıraşı, yüz masajı ve bakım sonrası losyon uygulaması dahildir.',
    price: 70.00,
    category_id: 'category-uuid-1', // Berber & Kuaför
    business_id: 'business-uuid-1', // Ahmet Berber Salonu
    duration_minutes: 20,
    branch_id: 'branch-uuid-1', // Varsayılan şube
    staff_id: 'staff-uuid-1', // Ahmet (kendisi)
    service_type_id: 'service-type-uuid-1', // on_site
    is_active: true,
    approval_status: 'approved'
  },
  {
    id: 'service-uuid-3',
    title: 'Cilt Bakımı',
    description: 'Derin temizleme, peeling ve maske uygulamasını içeren profesyonel cilt bakımı.',
    price: 280.00,
    category_id: 'category-uuid-2', // Güzellik & Bakım
    business_id: 'business-uuid-2', // Ayşe Güzellik Merkezi
    duration_minutes: 60,
    branch_id: 'branch-uuid-2', // Varsayılan şube
    staff_id: 'staff-uuid-2', // Ayşe (kendisi)
    service_type_id: 'service-type-uuid-1', // on_site
    is_active: true,
    approval_status: 'approved'
  },
  {
    id: 'service-uuid-4',
    title: 'Ev Temizliği',
    description: '2+1 ev için kapsamlı temizlik hizmeti, mutfak ve banyo dahil.',
    price: 550.00,
    category_id: 'category-uuid-4', // Temizlik
    business_id: 'business-uuid-3', // Profesyonel Temizlik Hizmetleri
    duration_minutes: 180,
    branch_id: 'branch-uuid-3', // Varsayılan şube
    staff_id: 'staff-uuid-3', // Mehmet'in ekibinden biri
    service_type_id: 'service-type-uuid-2', // home_service
    is_active: true,
    approval_status: 'approved'
  }
]; 