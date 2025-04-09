# Esnaf Veritabanı Şeması

Bu dizin, Esnaf Müşteri Uygulaması için veritabanı şemasını ve ilgili dosyaları içerir.

## Şema Dosyaları

- `schema.sql`: Ana veritabanı şema dosyası, tüm tabloları ve ilişkileri içerir
- `upload-schema.sh`: Şemayı Supabase veritabanına yüklemek için yardımcı script

## Şemayı Supabase'e Yükleme

Şemayı Supabase projenize yüklemek için iki yöntem vardır:

### 1. Upload-Schema.sh Scriptini Kullanma (Önerilen)

Bu yöntemi kullanmak için:

1. Terminali açın ve bu dizine gidin:
   ```
   cd esnaf-musteri-app/db
   ```

2. Script dosyasını çalıştırılabilir yapın:
   ```
   chmod +x upload-schema.sh
   ```

3. Scripti çalıştırın:
   ```
   ./upload-schema.sh
   ```

Script, `.env` dosyasından Supabase bilgilerini otomatik olarak alacak veya dosya yoksa bu bilgileri sizden isteyecektir.

**Not:** Bu script, PostgreSQL komut satırı aracı (`psql`) yüklü olmalıdır.

### 2. Supabase Web Arayüzünü Kullanma

Bu yöntemi kullanmak için:

1. [Supabase Dashboard](https://app.supabase.io/)'a giriş yapın
2. Projenizi seçin
3. Sol menüden "SQL Editor" seçeneğine tıklayın
4. "New Query" düğmesine tıklayın
5. `schema.sql` dosyasının içeriğini kopyalayın ve SQL editörüne yapıştırın
6. "Run" düğmesine tıklayın

## Veritabanı Tabloları

Şema aşağıdaki ana tabloları içerir:

1. **users** - Müşteriler ve işletme sahiplerini içerir
2. **user_settings** - Kullanıcı ayarları
3. **roles** - Kullanıcı rolleri (admin, customer, business_owner, staff)
4. **businesses** - İşletme bilgileri
5. **branches** - İşletmelere ait şubeler
6. **staff_members** - İşletme çalışanları
7. **service_categories** - Hizmet kategorileri
8. **services** - Sunulan hizmetler
9. **appointments** - Randevular
10. **payments** - Ödemeler
11. **reviews** - Hizmet değerlendirmeleri
12. **favorites** - Favori hizmetler

ve daha fazlası...

## Örnek Veriler

Şema dosyası aşağıdaki temel tablolar için örnek veri içerir:

- Roller (`roles`)
- Hizmet türleri (`service_types`)
- Hizmet kategorileri (`service_categories`)
- İşletme personel rolleri (`business_staff_roles`)

## Şemayı Güncelleme

Veritabanı şemasında değişiklik yapmak için:

1. `schema.sql` dosyasını güncelleyin
2. Değişiklikleri Supabase'e yüklemek için yukarıdaki yöntemlerden birini kullanın

**Not:** Mevcut bir veritabanında şemayı güncellerken veri kaybını önlemek için dikkatli olun. Özellikle üretim ortamında değişiklik yapmadan önce her zaman bir yedek alın. 