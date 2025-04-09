export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          country: string | null
          created_at: string | null
          id: string
          is_default: boolean | null
          latitude: number | null
          longitude: number | null
          name: string | null
          postal_code: string | null
          state: string | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          country?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          postal_code?: string | null
          state?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          country?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          postal_code?: string | null
          state?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          address: string | null
          appointment_time: string
          branch_id: string | null
          business_id: string | null
          customer_id: string | null
          customer_note: string | null
          id: string
          location_type: string | null
          service_id: string | null
          staff_id: string | null
          status: string | null
          total_price: number | null
        }
        Insert: {
          address?: string | null
          appointment_time: string
          branch_id?: string | null
          business_id?: string | null
          customer_id?: string | null
          customer_note?: string | null
          id?: string
          location_type?: string | null
          service_id?: string | null
          staff_id?: string | null
          status?: string | null
          total_price?: number | null
        }
        Update: {
          address?: string | null
          appointment_time?: string
          branch_id?: string | null
          business_id?: string | null
          customer_id?: string | null
          customer_note?: string | null
          id?: string
          location_type?: string | null
          service_id?: string | null
          staff_id?: string | null
          status?: string | null
          total_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string | null
          changes: Json | null
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          action?: string | null
          changes?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string | null
          changes?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      blocked_dates: {
        Row: {
          date: string
          id: string
          reason: string | null
          staff_id: string | null
        }
        Insert: {
          date: string
          id?: string
          reason?: string | null
          staff_id?: string | null
        }
        Update: {
          date?: string
          id?: string
          reason?: string | null
          staff_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blocked_dates_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          address: string | null
          business_id: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          business_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          business_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branches_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_hours: {
        Row: {
          branch_id: string | null
          business_id: string | null
          close_time: string | null
          day_of_week: number | null
          id: string
          is_closed: boolean | null
          open_time: string | null
        }
        Insert: {
          branch_id?: string | null
          business_id?: string | null
          close_time?: string | null
          day_of_week?: number | null
          id?: string
          is_closed?: boolean | null
          open_time?: string | null
        }
        Update: {
          branch_id?: string | null
          business_id?: string | null
          close_time?: string | null
          day_of_week?: number | null
          id?: string
          is_closed?: boolean | null
          open_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_hours_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_hours_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_payout_accounts: {
        Row: {
          account_identifier: string
          account_name: string | null
          business_id: string | null
          created_at: string | null
          id: string
          is_default: boolean | null
          is_verified: boolean | null
          metadata: Json | null
          provider: string
          updated_at: string | null
        }
        Insert: {
          account_identifier: string
          account_name?: string | null
          business_id?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          is_verified?: boolean | null
          metadata?: Json | null
          provider: string
          updated_at?: string | null
        }
        Update: {
          account_identifier?: string
          account_name?: string | null
          business_id?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          is_verified?: boolean | null
          metadata?: Json | null
          provider?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_payout_accounts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_staff_roles: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      businesses: {
        Row: {
          approval_status: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          owner_id: string | null
          phone: string | null
        }
        Insert: {
          approval_status?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          owner_id?: string | null
          phone?: string | null
        }
        Update: {
          approval_status?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          owner_id?: string | null
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          id: string
          service_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          service_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          service_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          is_primary: boolean | null
          type: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_primary?: boolean | null
          type?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_primary?: boolean | null
          type?: string | null
          url?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string | null
          product_id: string | null
          quantity: number | null
          total_price: number | null
          unit_price: number
        }
        Insert: {
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number | null
          total_price?: number | null
          unit_price: number
        }
        Update: {
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number | null
          total_price?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_id: string | null
          delivery_address: string | null
          delivery_method: string | null
          id: string
          status: string | null
          total_amount: number | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          delivery_address?: string | null
          delivery_method?: string | null
          id?: string
          status?: string | null
          total_amount?: number | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          delivery_address?: string | null
          delivery_method?: string | null
          id?: string
          status?: string | null
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number | null
          appointment_id: string | null
          id: string
          payment_date: string | null
          payment_method: string | null
          payment_status: string | null
        }
        Insert: {
          amount?: number | null
          appointment_id?: string | null
          id?: string
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
        }
        Update: {
          amount?: number | null
          appointment_id?: string | null
          id?: string
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          branch_id: string | null
          business_id: string | null
          category: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          stock: number | null
        }
        Insert: {
          branch_id?: string | null
          business_id?: string | null
          category?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          stock?: number | null
        }
        Update: {
          branch_id?: string | null
          business_id?: string | null
          category?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          stock?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      promotion_usages: {
        Row: {
          appointment_id: string | null
          id: string
          promotion_id: string | null
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          appointment_id?: string | null
          id?: string
          promotion_id?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          appointment_id?: string | null
          id?: string
          promotion_id?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promotion_usages_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_usages_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_usages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          business_id: string | null
          code: string | null
          description: string | null
          discount_amount: number | null
          discount_percent: number | null
          end_date: string | null
          id: string
          is_active: boolean | null
          start_date: string | null
          title: string
        }
        Insert: {
          business_id?: string | null
          code?: string | null
          description?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          start_date?: string | null
          title: string
        }
        Update: {
          business_id?: string | null
          code?: string | null
          description?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          start_date?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      refunds: {
        Row: {
          id: string
          payment_id: string | null
          reason: string | null
          refund_amount: number
          refund_date: string | null
          status: string | null
        }
        Insert: {
          id?: string
          payment_id?: string | null
          reason?: string | null
          refund_amount: number
          refund_date?: string | null
          status?: string | null
        }
        Update: {
          id?: string
          payment_id?: string | null
          reason?: string | null
          refund_amount?: number
          refund_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refunds_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          business_id: string | null
          comment: string | null
          created_at: string | null
          id: string
          rating: number | null
          service_id: string | null
          staff_id: string | null
          user_id: string | null
        }
        Insert: {
          business_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          service_id?: string | null
          staff_id?: string | null
          user_id?: string | null
        }
        Update: {
          business_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          service_id?: string | null
          staff_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      service_areas: {
        Row: {
          business_id: string | null
          city: string | null
          district: string | null
          id: string
          radius_km: number | null
        }
        Insert: {
          business_id?: string | null
          city?: string | null
          district?: string | null
          id?: string
          radius_km?: number | null
        }
        Update: {
          business_id?: string | null
          city?: string | null
          district?: string | null
          id?: string
          radius_km?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_areas_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          description: string | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      service_types: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      service_working_days: {
        Row: {
          day_of_week: number | null
          end_time: string | null
          id: string
          service_id: string | null
          start_time: string | null
        }
        Insert: {
          day_of_week?: number | null
          end_time?: string | null
          id?: string
          service_id?: string | null
          start_time?: string | null
        }
        Update: {
          day_of_week?: number | null
          end_time?: string | null
          id?: string
          service_id?: string | null
          start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_working_days_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          approval_status: string | null
          branch_id: string | null
          business_id: string | null
          category_id: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          price: number
          service_type_id: string | null
          staff_id: string | null
          title: string
        }
        Insert: {
          approval_status?: string | null
          branch_id?: string | null
          business_id?: string | null
          category_id?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          price: number
          service_type_id?: string | null
          staff_id?: string | null
          title: string
        }
        Update: {
          approval_status?: string | null
          branch_id?: string | null
          business_id?: string | null
          category_id?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          price?: number
          service_type_id?: string | null
          staff_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_service_type_id_fkey"
            columns: ["service_type_id"]
            isOneToOne: false
            referencedRelation: "service_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_member_roles: {
        Row: {
          id: string
          role_id: string | null
          staff_id: string | null
        }
        Insert: {
          id?: string
          role_id?: string | null
          staff_id?: string | null
        }
        Update: {
          id?: string
          role_id?: string | null
          staff_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_member_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "business_staff_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_member_roles_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_members: {
        Row: {
          branch_id: string
          business_id: string
          expertise: string | null
          id: string
          is_active: boolean | null
          joined_at: string | null
          position: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          branch_id: string
          business_id: string
          expertise?: string | null
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          position?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          branch_id?: string
          business_id?: string
          expertise?: string | null
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          position?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_members_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_members_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_performance_logs: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          points: number | null
          reference_id: string | null
          source: string | null
          staff_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          points?: number | null
          reference_id?: string | null
          source?: string | null
          staff_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          points?: number | null
          reference_id?: string | null
          source?: string | null
          staff_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_performance_logs_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_profiles: {
        Row: {
          about: string | null
          average_rating: number | null
          experience_years: number | null
          id: string
          staff_id: string | null
          total_services: number | null
        }
        Insert: {
          about?: string | null
          average_rating?: number | null
          experience_years?: number | null
          id?: string
          staff_id?: string | null
          total_services?: number | null
        }
        Update: {
          about?: string | null
          average_rating?: number | null
          experience_years?: number | null
          id?: string
          staff_id?: string | null
          total_services?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_profiles_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_schedule_exceptions: {
        Row: {
          created_at: string | null
          exception_date: string
          id: string
          is_working_day: boolean | null
          reason: string | null
          staff_id: string | null
          time_range: string | null
        }
        Insert: {
          created_at?: string | null
          exception_date: string
          id?: string
          is_working_day?: boolean | null
          reason?: string | null
          staff_id?: string | null
          time_range?: string | null
        }
        Update: {
          created_at?: string | null
          exception_date?: string
          id?: string
          is_working_day?: boolean | null
          reason?: string | null
          staff_id?: string | null
          time_range?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_schedule_exceptions_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          role_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          role_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string | null
          custom_preferences: Json | null
          email_notifications: boolean | null
          id: string
          language: string | null
          marketing_emails: boolean | null
          preferred_currency: string | null
          preferred_location: string | null
          push_notifications: boolean | null
          sms_notifications: boolean | null
          theme: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          custom_preferences?: Json | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          marketing_emails?: boolean | null
          preferred_currency?: string | null
          preferred_location?: string | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          custom_preferences?: Json | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          marketing_emails?: boolean | null
          preferred_currency?: string | null
          preferred_location?: string | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          bio: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          latitude: number | null
          longitude: number | null
          password_hash: string
          phone: string | null
          profile_image: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          latitude?: number | null
          longitude?: number | null
          password_hash: string
          phone?: string | null
          profile_image?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          latitude?: number | null
          longitude?: number | null
          password_hash?: string
          phone?: string | null
          profile_image?: string | null
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          reference_id: string | null
          reference_type: string | null
          transaction_type: string | null
          wallet_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: string | null
          wallet_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: string | null
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          currency: string | null
          id: string
          last_transaction_at: string | null
          user_id: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          last_transaction_at?: string | null
          user_id?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          last_transaction_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
