# 5. Profil Yönetimi

## Genel Durum
Profil yönetimi modülü için temel ekranlar geliştirildi. Kullanıcı profil bilgilerini görüntüleme, profil düzenleme ve adres yönetimi ekranları oluşturuldu. Şu an için tüm ekranlar örnek verilerle çalışıyor. Supabase entegrasyonu henüz tamamlanmadı.

## Görevler

- [x] 5.1. Kullanıcı profili görüntüleme 
  - [x] 5.1.1. Profil ekranı tasarımı
  - [ ] 5.1.2. Kullanıcı bilgilerinin Supabase'den çekilmesi
  - [x] 5.1.3. Profil verilerinin görüntülenmesi
  - [ ] 5.1.4. Profil durumu (aktif/çevrimdışı) göstergesi

- [x] 5.2. Profil düzenleme
  - [x] 5.2.1. Profil düzenleme formu
  - [x] 5.2.2. Form validasyonu
  - [ ] 5.2.3. Supabase ile profil güncelleme entegrasyonu
  - [x] 5.2.4. Başarılı/başarısız güncelleme bildirimleri

- [ ] 5.3. Profil fotoğrafı yükleme
  - [ ] 5.3.1. Cihaz galerisinden fotoğraf seçme
  - [ ] 5.3.2. Kamera ile fotoğraf çekme
  - [ ] 5.3.3. Fotoğraf kırpma/düzenleme
  - [ ] 5.3.4. Supabase storage'a fotoğraf yükleme
  - [ ] 5.3.5. Profil fotoğrafı önbelleğe alma

- [x] 5.4. Adres yönetimi
  - [x] 5.4.1. Adres listesi görüntüleme
  - [x] 5.4.2. Yeni adres ekleme formu
  - [x] 5.4.3. Adres düzenleme ve silme
  - [x] 5.4.4. Varsayılan adres belirleme
  - [ ] 5.4.5. Harita entegrasyonu ve konum seçimi

- [ ] 5.5. Ödeme yöntemleri yönetimi
  - [ ] 5.5.1. Kayıtlı ödeme yöntemlerini görüntüleme
  - [ ] 5.5.2. Yeni ödeme yöntemi ekleme
  - [ ] 5.5.3. Ödeme yöntemi düzenleme ve silme
  - [ ] 5.5.4. Varsayılan ödeme yöntemi belirleme
  - [ ] 5.5.5. Ödeme güvenliği için maskeleme ve şifreleme

- [ ] 5.6. Güvenlik ayarları 
  - [ ] 5.6.1. Şifre değiştirme
  - [ ] 5.6.2. İki faktörlü kimlik doğrulama
  - [ ] 5.6.3. Oturum açma geçmişi
  - [ ] 5.6.4. Hesap silme veya devre dışı bırakma
  - [ ] 5.6.5. Bildirim tercihleri yönetimi

## Bağımlılıklar
- Supabase kullanıcı tablosu ve ilişkili tablolar (adresler, ödeme yöntemleri) oluşturulmalı
- Profil fotoğrafları için Supabase storage ayarlanmalı
- Expo Image Picker gibi bir kütüphane ile kamera ve galeri erişimi sağlanmalı
- Form validasyonu için Formik veya React Hook Form kullanılabilir
- Harita entegrasyonu için Google Maps veya başka bir harita servisi kullanılmalı

## Tamamlanan İşlemler
1. ProfileScreen bileşeni oluşturuldu - kullanıcı bilgileri, adresler, ödeme yöntemleri ve randevuların gösterilmesi
2. EditProfileScreen bileşeni oluşturuldu - form validasyonu ile profil bilgileri güncelleme
3. AddressManagementScreen bileşeni oluşturuldu - adres ekleme, düzenleme, silme ve varsayılan adres belirleme
4. Tüm ekranlar örnek verilerle entegre edildi ve navigasyon yapısına eklendi

## Bir Sonraki Adımlar
1. Supabase ile veri tabanı entegrasyonunun tamamlanması
2. Profil fotoğrafı yükleme özelliğinin eklenmesi (Expo ImagePicker ve Supabase Storage kullanılarak)
3. Ödeme yöntemleri yönetimi modülünün geliştirilmesi
4. Güvenlik ayarları ekranının oluşturulması
5. Adres yönetimi için harita entegrasyonu eklenmesi

## Notlar
- Tüm ekranlar şu anda örnek veri ile çalışıyor, gerçek uygulamada Supabase'den veri çekilecek
- Profil fotoğrafı ve güvenlik ayarları için ek kütüphaneler gerekecek
- Ödeme bilgileri güvenliği önemli, kredi kartı bilgileri maskelenmiş olarak saklanmalı
- Adres yönetimi için harita entegrasyonu özelliği daha sonra eklenecek 