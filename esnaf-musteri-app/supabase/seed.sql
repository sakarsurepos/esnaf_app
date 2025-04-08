-- Admin kullanıcı oluştur
INSERT INTO users (id, first_name, last_name, email, phone, password_hash, bio, profile_image)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Admin', 'Kullanıcı', 'admin@esnafapp.com', '+905551234567', 'hashlanmis_sifre', 'Sistem yöneticisi', 'https://example.com/admin.jpg');

-- Admin rolü ver
INSERT INTO user_roles (user_id, role_id)
SELECT '00000000-0000-0000-0000-000000000001', id FROM roles WHERE name = 'admin';

-- Test müşteri kullanıcısı
INSERT INTO users (id, first_name, last_name, email, phone, password_hash, latitude, longitude)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'Müşteri', 'Kullanıcı', 'musteri@ornek.com', '+905551234568', 'hashlanmis_sifre', 40.9876, 29.0213);

-- Müşteri rolü ver
INSERT INTO user_roles (user_id, role_id)
SELECT '00000000-0000-0000-0000-000000000002', id FROM roles WHERE name = 'customer';

-- Test işletme sahibi kullanıcısı
INSERT INTO users (id, first_name, last_name, email, phone, password_hash)
VALUES 
  ('00000000-0000-0000-0000-000000000003', 'İşletme', 'Sahibi', 'isletme@ornek.com', '+905551234569', 'hashlanmis_sifre');

-- İşletme sahibi rolü ver
INSERT INTO user_roles (user_id, role_id)
SELECT '00000000-0000-0000-0000-000000000003', id FROM roles WHERE name = 'business_owner';

-- Test işletmesi
INSERT INTO businesses (id, owner_id, name, description, phone, email)
VALUES 
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'Örnek Kuaför', 'Kadın ve erkek kuaför hizmetleri', '+902121234567', 'info@ornekkuafor.com');

-- Test şubesi
INSERT INTO branches (id, business_id, name, address, latitude, longitude, phone)
VALUES 
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000004', 'Merkez Şube', 'Bağdat Cad. No:123, Kadıköy, İstanbul', 40.9872, 29.0562, '+902121234568');

-- Servis kategorileri
INSERT INTO service_categories (id, name, description, icon_url)
VALUES 
  ('00000000-0000-0000-0000-000000000006', 'Saç Kesimi', 'Saç kesim hizmetleri', 'https://example.com/icons/haircut.png'),
  ('00000000-0000-0000-0000-000000000007', 'Saç Boyama', 'Saç boyama hizmetleri', 'https://example.com/icons/haircolor.png'),
  ('00000000-0000-0000-0000-000000000008', 'Cilt Bakımı', 'Cilt bakım hizmetleri', 'https://example.com/icons/skincare.png');

-- Servis tipleri
INSERT INTO service_types (id, name)
VALUES 
  ('00000000-0000-0000-0000-000000000009', 'Kişisel Bakım'),
  ('00000000-0000-0000-0000-000000000010', 'Ev Hizmetleri'),
  ('00000000-0000-0000-0000-000000000011', 'Teknik Servis');

-- Test servisleri
INSERT INTO services (id, title, description, price, category_id, business_id, branch_id, service_type_id, duration_minutes)
VALUES 
  ('00000000-0000-0000-0000-000000000012', 'Erkek Saç Kesimi', 'Modern erkek saç kesimi', 150.00, '00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000009', 30),
  ('00000000-0000-0000-0000-000000000013', 'Kadın Saç Kesimi', 'Kadın saç kesimi ve şekillendirme', 250.00, '00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000009', 45),
  ('00000000-0000-0000-0000-000000000014', 'Saç Boyama', 'Tek renk saç boyama', 350.00, '00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000009', 90);

-- Test personel
INSERT INTO staff_members (id, user_id, business_id, branch_id, position, expertise)
VALUES 
  ('00000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', 'Kuaför', 'Erkek saç kesimi, sakal tıraşı');

-- Test ürünleri
INSERT INTO products (id, business_id, branch_id, name, description, price, stock, category)
VALUES 
  ('00000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', 'Şampuan', 'Kepek karşıtı şampuan', 120.00, 50, 'Saç Bakım'),
  ('00000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', 'Saç Kremi', 'Onarıcı saç kremi', 90.00, 35, 'Saç Bakım');

-- Kullanıcı Ayarları
INSERT INTO user_settings (user_id, language, theme)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'tr', 'dark'),
  ('00000000-0000-0000-0000-000000000002', 'tr', 'light'),
  ('00000000-0000-0000-0000-000000000003', 'tr', 'system'); 