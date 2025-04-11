import { Tables } from "../../types/supabase";

// İşletme çalışma saatleri için örnek veri
export const sampleBusinessHours: Tables<'business_hours'>[] = [
  // Ahmet Berber Salonu (Pazartesi)
  {
    id: 'hours-uuid-1',
    business_id: 'business-uuid-1',
    branch_id: 'branch-uuid-1',
    day_of_week: 1,
    open_time: '09:00',
    close_time: '19:00',
    is_closed: false
  },
  // Ahmet Berber Salonu (Salı)
  {
    id: 'hours-uuid-2',
    business_id: 'business-uuid-1',
    branch_id: 'branch-uuid-1',
    day_of_week: 2,
    open_time: '09:00',
    close_time: '19:00',
    is_closed: false
  },
  // Ahmet Berber Salonu (Çarşamba)
  {
    id: 'hours-uuid-3',
    business_id: 'business-uuid-1',
    branch_id: 'branch-uuid-1',
    day_of_week: 3,
    open_time: '09:00',
    close_time: '19:00',
    is_closed: false
  },
  // Ahmet Berber Salonu (Perşembe)
  {
    id: 'hours-uuid-4',
    business_id: 'business-uuid-1',
    branch_id: 'branch-uuid-1',
    day_of_week: 4,
    open_time: '09:00',
    close_time: '19:00',
    is_closed: false
  },
  // Ahmet Berber Salonu (Cuma)
  {
    id: 'hours-uuid-5',
    business_id: 'business-uuid-1',
    branch_id: 'branch-uuid-1',
    day_of_week: 5,
    open_time: '09:00',
    close_time: '19:00',
    is_closed: false
  },
  // Ahmet Berber Salonu (Cumartesi)
  {
    id: 'hours-uuid-6',
    business_id: 'business-uuid-1',
    branch_id: 'branch-uuid-1',
    day_of_week: 6,
    open_time: '10:00',
    close_time: '18:00',
    is_closed: false
  },
  // Ahmet Berber Salonu (Pazar)
  {
    id: 'hours-uuid-7',
    business_id: 'business-uuid-1',
    branch_id: 'branch-uuid-1',
    day_of_week: 0,
    open_time: null,
    close_time: null,
    is_closed: true
  },

  // Ayşe Güzellik Merkezi
  {
    id: 'hours-uuid-8',
    business_id: 'business-uuid-2',
    branch_id: 'branch-uuid-2',
    day_of_week: 1,
    open_time: '10:00',
    close_time: '20:00',
    is_closed: false
  },
  {
    id: 'hours-uuid-9',
    business_id: 'business-uuid-2',
    branch_id: 'branch-uuid-2',
    day_of_week: 2,
    open_time: '10:00',
    close_time: '20:00',
    is_closed: false
  },
  {
    id: 'hours-uuid-10',
    business_id: 'business-uuid-2',
    branch_id: 'branch-uuid-2',
    day_of_week: 3,
    open_time: '10:00',
    close_time: '20:00',
    is_closed: false
  },
  {
    id: 'hours-uuid-11',
    business_id: 'business-uuid-2',
    branch_id: 'branch-uuid-2',
    day_of_week: 4,
    open_time: '10:00',
    close_time: '20:00',
    is_closed: false
  },
  {
    id: 'hours-uuid-12',
    business_id: 'business-uuid-2',
    branch_id: 'branch-uuid-2',
    day_of_week: 5,
    open_time: '10:00',
    close_time: '20:00',
    is_closed: false
  },
  {
    id: 'hours-uuid-13',
    business_id: 'business-uuid-2',
    branch_id: 'branch-uuid-2',
    day_of_week: 6,
    open_time: '11:00',
    close_time: '19:00',
    is_closed: false
  },
  {
    id: 'hours-uuid-14',
    business_id: 'business-uuid-2',
    branch_id: 'branch-uuid-2',
    day_of_week: 0,
    open_time: '12:00',
    close_time: '18:00',
    is_closed: false
  },

  // Profesyonel Temizlik Hizmetleri
  {
    id: 'hours-uuid-15',
    business_id: 'business-uuid-3',
    branch_id: 'branch-uuid-3',
    day_of_week: 1,
    open_time: '08:00',
    close_time: '18:00',
    is_closed: false
  },
  {
    id: 'hours-uuid-16',
    business_id: 'business-uuid-3',
    branch_id: 'branch-uuid-3',
    day_of_week: 2,
    open_time: '08:00',
    close_time: '18:00',
    is_closed: false
  },
  {
    id: 'hours-uuid-17',
    business_id: 'business-uuid-3',
    branch_id: 'branch-uuid-3',
    day_of_week: 3,
    open_time: '08:00',
    close_time: '18:00',
    is_closed: false
  },
  {
    id: 'hours-uuid-18',
    business_id: 'business-uuid-3',
    branch_id: 'branch-uuid-3',
    day_of_week: 4,
    open_time: '08:00',
    close_time: '18:00',
    is_closed: false
  },
  {
    id: 'hours-uuid-19',
    business_id: 'business-uuid-3',
    branch_id: 'branch-uuid-3',
    day_of_week: 5,
    open_time: '08:00',
    close_time: '18:00',
    is_closed: false
  },
  {
    id: 'hours-uuid-20',
    business_id: 'business-uuid-3',
    branch_id: 'branch-uuid-3',
    day_of_week: 6,
    open_time: '09:00',
    close_time: '14:00',
    is_closed: false
  },
  {
    id: 'hours-uuid-21',
    business_id: 'business-uuid-3',
    branch_id: 'branch-uuid-3',
    day_of_week: 0,
    open_time: null,
    close_time: null,
    is_closed: true
  },

  // Ace Tenis Kulübü (Pazartesi)
  {
    id: 'hours-uuid-22',
    business_id: 'business-uuid-4',
    branch_id: 'branch-uuid-4',
    day_of_week: 1,
    open_time: '08:00',
    close_time: '22:00',
    is_closed: false
  },
  // Ace Tenis Kulübü (Salı)
  {
    id: 'hours-uuid-23',
    business_id: 'business-uuid-4',
    branch_id: 'branch-uuid-4',
    day_of_week: 2,
    open_time: '08:00',
    close_time: '22:00',
    is_closed: false
  },
  // Ace Tenis Kulübü (Çarşamba)
  {
    id: 'hours-uuid-24',
    business_id: 'business-uuid-4',
    branch_id: 'branch-uuid-4',
    day_of_week: 3,
    open_time: '08:00',
    close_time: '22:00',
    is_closed: false
  },
  // Ace Tenis Kulübü (Perşembe)
  {
    id: 'hours-uuid-25',
    business_id: 'business-uuid-4',
    branch_id: 'branch-uuid-4',
    day_of_week: 4,
    open_time: '08:00',
    close_time: '22:00',
    is_closed: false
  },
  // Ace Tenis Kulübü (Cuma)
  {
    id: 'hours-uuid-26',
    business_id: 'business-uuid-4',
    branch_id: 'branch-uuid-4',
    day_of_week: 5,
    open_time: '08:00',
    close_time: '22:00',
    is_closed: false
  },
  // Ace Tenis Kulübü (Cumartesi)
  {
    id: 'hours-uuid-27',
    business_id: 'business-uuid-4',
    branch_id: 'branch-uuid-4',
    day_of_week: 6,
    open_time: '09:00',
    close_time: '21:00',
    is_closed: false
  },
  // Ace Tenis Kulübü (Pazar)
  {
    id: 'hours-uuid-28',
    business_id: 'business-uuid-4',
    branch_id: 'branch-uuid-4',
    day_of_week: 0,
    open_time: '09:00',
    close_time: '21:00',
    is_closed: false
  }
]; 