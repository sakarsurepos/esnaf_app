import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Mock veri modu kontrolü
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';
const IS_DEV = process.env.NODE_ENV === 'development';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient<Database>;

// Mock veri modunda boş değerlerle bile çalışabilecek bir istemci oluştur
// veya gerçek bağlantı bilgileriyle bir istemci oluştur
try {
  if (IS_DEV && USE_MOCK_DATA) {
    console.log('🧪 Mock veri modu: Supabase minimalist istemci oluşturuluyor');
    // Mock veri modunda minimum düzeyde bir istemci oluştur
    // Bu istemci hiçbir API çağrısı yapmayacak ama referans olarak kullanılabilecek
    supabase = createClient<Database>(
      'https://placeholder-url.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-key'
    );
  } else {
    // Normal modda gerçek bağlantı bilgileriyle istemci oluştur
    console.log('🔌 Gerçek Supabase bağlantısı kurulmaya çalışılıyor');
    supabase = createClient<Database>(supabaseUrl, supabaseKey);
  }
} catch (error) {
  console.error('Supabase istemcisi oluşturulurken hata:', error);
  // Hata durumunda da çalışabilmesi için boş bir istemci oluştur
  supabase = createClient<Database>(
    'https://placeholder-url.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-key'
  );
}

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