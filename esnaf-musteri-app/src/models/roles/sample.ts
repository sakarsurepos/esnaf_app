import { Tables } from "../../types/supabase";

// Roles için örnek veri
export const sampleRoles: Tables<'roles'>[] = [
  {
    id: 'role-uuid-1',
    name: 'admin'
  },
  {
    id: 'role-uuid-2',
    name: 'customer'
  },
  {
    id: 'role-uuid-3',
    name: 'business_owner'
  },
  {
    id: 'role-uuid-4',
    name: 'staff'
  }
]; 