import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
import 'react-native-url-polyfill/auto';
import { Database } from '../types/supabase';

// Supabase projesinin URL ve anonim API anahtarı
const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;

// Supabase istemcisini tip tanımlarıyla oluştur
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Veri sorgulama işlemleri için yardımcı fonksiyonlar

/**
 * Kullanıcı bilgilerini getirir
 * @param userId Kullanıcı ID'si
 */
export const getUser = async (userId: string) => {
  return await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
};

/**
 * İşletme bilgilerini getirir
 * @param businessId İşletme ID'si
 */
export const getBusiness = async (businessId: string) => {
  return await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .single();
};

/**
 * Hizmet bilgilerini getirir
 * @param serviceId Hizmet ID'si
 */
export const getService = async (serviceId: string) => {
  return await supabase
    .from('services')
    .select('*')
    .eq('id', serviceId)
    .single();
};

/**
 * Randevu bilgilerini getirir
 * @param appointmentId Randevu ID'si
 */
export const getAppointment = async (appointmentId: string) => {
  return await supabase
    .from('appointments')
    .select('*')
    .eq('id', appointmentId)
    .single();
};

export default supabase; 