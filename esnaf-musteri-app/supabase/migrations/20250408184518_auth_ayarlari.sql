-- Migration: auth_ayarlari
-- Created at: Mon Apr  8 18:45:18 EEST 2025

-- Kullanıcı Kimlik Doğrulama Ayarları

-- Auth şemasında E-posta / Telefon onayı
ALTER TABLE auth.users
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;

-- Custom User Meta Data için fonksiyon
CREATE OR REPLACE FUNCTION auth.build_metadata(first_name TEXT, last_name TEXT)
RETURNS JSONB AS $$
BEGIN
  RETURN jsonb_build_object(
    'first_name', first_name,
    'last_name', last_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Kullanıcı Profil Güncelleme Fonksiyonu
CREATE OR REPLACE FUNCTION update_user_profile(
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  bio TEXT,
  profile_image TEXT
) RETURNS void AS $$
BEGIN
  UPDATE public.users
  SET 
    first_name = COALESCE(update_user_profile.first_name, users.first_name),
    last_name = COALESCE(update_user_profile.last_name, users.last_name),
    phone = COALESCE(update_user_profile.phone, users.phone),
    bio = COALESCE(update_user_profile.bio, users.bio),
    profile_image = COALESCE(update_user_profile.profile_image, users.profile_image)
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Şifre Sıfırlama İşlemi için Tetikleyici
CREATE OR REPLACE FUNCTION handle_password_reset()
RETURNS TRIGGER AS $$
BEGIN
  -- Şifre değiştiğinde password_hash alanını güncelle
  UPDATE public.users
  SET password_hash = NEW.encrypted_password
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_password_reset
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.encrypted_password IS DISTINCT FROM NEW.encrypted_password)
  EXECUTE PROCEDURE handle_password_reset();

-- Kullanıcı Silme İşlemi için Tetikleyici
CREATE OR REPLACE FUNCTION handle_user_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Kullanıcı silindiğinde public.users tablosundan da sil
  DELETE FROM public.users WHERE id = OLD.id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE handle_user_delete();

-- Yeni Kayıt İşlemi için fonksiyonlarda iyileştirme
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_role_id UUID;
  meta_first_name TEXT;
  meta_last_name TEXT;
BEGIN
  -- Metadata'dan isim bilgilerini al
  meta_first_name := NEW.raw_user_meta_data->>'first_name';
  meta_last_name := NEW.raw_user_meta_data->>'last_name';

  -- Yeni kullanıcıyı public.users tablosuna ekle
  INSERT INTO public.users (
    id, 
    first_name, 
    last_name, 
    email, 
    password_hash
  )
  VALUES (
    NEW.id, 
    COALESCE(meta_first_name, ''), 
    COALESCE(meta_last_name, ''), 
    NEW.email, 
    NEW.encrypted_password
  );
  
  -- Customer rolünü varsayılan olarak ata
  SELECT id INTO default_role_id FROM public.roles WHERE name = 'customer';
  
  INSERT INTO public.user_roles (user_id, role_id)
  VALUES (NEW.id, default_role_id);
  
  -- Varsayılan kullanıcı ayarlarını oluştur
  INSERT INTO public.user_settings (user_id, language, theme)
  VALUES (NEW.id, 'tr', 'system');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supabase Auth ayarlarını yapılandır
-- Not: Bu kısım SQL olarak değil, Supabase Dashboard üzerinden veya API ile yapılır
-- Supabase Auth'un temel ayarları:
-- * Site URL: https://esnafapp.com
-- * Redirect URLs: https://esnafapp.com/auth/callback, esnafapp://auth/callback
-- * Auth providers: Email/Password, Phone, Google, Apple
-- * Email onayı zorunlu: true
-- * Secure host ayarları: *.esnafapp.com
