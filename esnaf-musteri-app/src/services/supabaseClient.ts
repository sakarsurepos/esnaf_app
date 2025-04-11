import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Environment değişkenlerinden Supabase URL ve Anon Key değerlerini al
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.SUPABASE_URL || 'https://mocksupabse.co';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.SUPABASE_ANON_KEY || 'mock-key-for-development-only';

// Geliştirme ortamında uyarı göster
if (process.env.NODE_ENV === 'development' && (!supabaseUrl || supabaseUrl === 'https://mocksupabse.co')) {
  console.warn('Supabase URL yapılandırılmamış! Geliştirme ortamında mock Supabase kullanılıyor.');
}

// Supabase istemcisi oluştur
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase; 