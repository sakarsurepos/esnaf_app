import { supabase } from './supabase';
import { AuthError, Session } from '@supabase/supabase-js';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export const authService = {
  // Oturum açma işlemi
  async login({ email, password }: LoginCredentials): Promise<{ session: Session | null; error: AuthError | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { session: data?.session || null, error };
  },

  // Kayıt işlemi
  async register({ email, password, firstName, lastName, phone }: RegisterData): Promise<{ session: Session | null; error: AuthError | null }> {
    // Önce kullanıcıyı auth sistemine kaydet
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
        },
      },
    });

    return { session: data?.session || null, error };
  },

  // Oturumu kapat
  async logout(): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Mevcut oturumu kontrol et
  async getCurrentSession(): Promise<{ session: Session | null; error: AuthError | null }> {
    const { data, error } = await supabase.auth.getSession();
    return { session: data?.session || null, error };
  },

  // Mevcut kullanıcıyı kontrol et
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    return { user: data?.user || null, error };
  },

  // Şifre sıfırlama e-postası gönder
  async forgotPassword(email: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'esnafmusteri://reset-password',
    });
    return { error };
  },

  // Şifre sıfırlama
  async resetPassword(newPassword: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error };
  },

  // Email doğrulama kontrolü
  async checkEmailVerification(): Promise<boolean> {
    const { user } = await this.getCurrentUser();
    return user?.email_confirmed_at ? true : false;
  },

  // Kimlik doğrulama durumu dinleyicisi
  onAuthStateChange(callback: Function) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },
}; 