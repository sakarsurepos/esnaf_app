export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          password_hash: string
          latitude: number | null
          longitude: number | null
          profile_image: string | null
          bio: string | null
          created_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          password_hash: string
          latitude?: number | null
          longitude?: number | null
          profile_image?: string | null
          bio?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          password_hash?: string
          latitude?: number | null
          longitude?: number | null
          profile_image?: string | null
          bio?: string | null
          created_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          owner_id: string
          name: string
          description: string | null
          phone: string | null
          email: string | null
          is_active: boolean
          approval_status: string
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          description?: string | null
          phone?: string | null
          email?: string | null
          is_active?: boolean
          approval_status?: string
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          description?: string | null
          phone?: string | null
          email?: string | null
          is_active?: boolean
          approval_status?: string
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number
          category_id: string | null
          business_id: string | null
          branch_id: string | null
          staff_id: string | null
          service_type_id: string | null
          duration_minutes: number | null
          is_active: boolean
          approval_status: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price: number
          category_id?: string | null
          business_id?: string | null
          branch_id?: string | null
          staff_id?: string | null
          service_type_id?: string | null
          duration_minutes?: number | null
          is_active?: boolean
          approval_status?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          category_id?: string | null
          business_id?: string | null
          branch_id?: string | null
          staff_id?: string | null
          service_type_id?: string | null
          duration_minutes?: number | null
          is_active?: boolean
          approval_status?: string
        }
      }
      appointments: {
        Row: {
          id: string
          service_id: string
          customer_id: string
          business_id: string
          branch_id: string
          staff_id: string | null
          appointment_time: string
          location_type: string
          address: string | null
          status: string
          customer_note: string | null
          total_price: number | null
        }
        Insert: {
          id?: string
          service_id: string
          customer_id: string
          business_id: string
          branch_id: string
          staff_id?: string | null
          appointment_time: string
          location_type?: string
          address?: string | null
          status?: string
          customer_note?: string | null
          total_price?: number | null
        }
        Update: {
          id?: string
          service_id?: string
          customer_id?: string
          business_id?: string
          branch_id?: string
          staff_id?: string | null
          appointment_time?: string
          location_type?: string
          address?: string | null
          status?: string
          customer_note?: string | null
          total_price?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 