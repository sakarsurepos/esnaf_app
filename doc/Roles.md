# 👥 Kullanıcı Rolleri (Roles)

## 📌 Güncellenmiş Roller

| Rol Adı | Açıklama |
|---------|----------|
| Customer | Hizmet alan birey veya kurumsal kullanıcı. Randevu alır, ödeme yapar, değerlendirme bırakır. |
| Service Performer (Staff) | Hizmeti uygulayan personel. İşletmeye bağlı çalışır, randevuya gelir, hizmeti gerçekleştirir, teslimat ve onay işlemlerini yürütür. |
| Service Provider | Hizmeti sistemde tanımlayan ve satışa sunan taraf. Tek bir kişi, merkezi bir sistem ya da işletme olabilir. |
| Business Owner | Bir işletmeyi yöneten kişi. Personel, hizmet, stok, ödeme, yorum ve kampanyaları yönetir. |
| Admin | Sistemi genel olarak yöneten üst düzey yetkili. Denetim, moderasyon ve yapılandırma işlemleri yapar. |

> Not: "Service Provider" kavramı hizmeti sistemde tanımlayan ve işleten taraf anlamında, "Staff" ise hizmeti uygulayan personel olarak kullanılmaktadır.

## 🎭 Rol Bazlı Yetki Matrisi (Özet)

| Aksiyon | Customer | Staff | Service Provider | Business Owner | Admin |
|---------|----------|-------|-----------------|----------------|-------|
| Hizmet satın alma | ✅ | ❌ | ❌ | ❌ | ❌ |
| Randevu oluşturma / iptal | ✅ | ❌ | ❌ | ❌ | ❌ |
| Hizmeti başlat / bitir | ❌ | ✅ | ❌ | ❌ | ❌ |
| Randevu takvimini görüntüleme | ✅ | ✅ | ✅ | ✅ | ✅ |
| Hizmet tanımlama / paket oluşturma | ❌ | ❌ | ✅ | ✅ | ✅ |
| Stok ve depo yönetimi | ❌ | ❌ | ✅ | ✅ | ✅ |
| Geri bildirim & puanlama | ✅ | ❌ | ❌ | ❌ | ❌ |
| Performans ve gelir raporları | ❌ | ✅(*) | ✅ | ✅ | ✅ |
| Kullanıcı yönetimi | ❌ | ❌ | ✅ | ✅ | ✅ |
| Platform ayarları / tüm erişim | ❌ | ❌ | ❌ | ❌ | ✅ |

> (*) Staff yalnızca kendi performansını görebilir.

## ✅ Güncellenmiş Kullanıcı Senaryoları (Use Case Listesi)

### 👤 1. Customer (Müşteri)

**Kullanım Senaryoları:**

- ✅ Kayıt olma, giriş yapma
- ✅ Profilini düzenleme
- ✅ Hizmetleri ve servis detaylarını görüntüleme
- ✅ Favori hizmet ve personel listesi oluşturma
- ✅ Konum tabanlı hizmet arama
- ✅ Hizmet sağlayıcı ve personel profillerini inceleme
- ✅ Randevu oluşturma, iptal etme
- ✅ Tekil hizmet, paket veya üyelik satın alma ve ödeme
- ✅ Satın alınan kullanım haklarını görüntüleme
- ✅ Sipariş ve randevu geçmişini izleme
- ✅ Hizmet sonrası puan ve yorum bırakma
- ✅ Sadakat puanı kazanma, ödül talebi oluşturma
- ✅ Referans sistemi ile arkadaş davet etme
- ✅ Destek talebi oluşturma
- ✅ Adres bilgisi kaydetme ve düzenleme

### 👨‍🔧 2. Service Performer / Staff (Personel)

**Kullanım Senaryoları:**

- ✅ Kendi çalışma takvimini düzenleme (vardiya, izin vs.)
- ✅ Atandığı randevuları görüntüleme
- ✅ Hizmeti başlatma / bitirme (check-in / check-out)
- ✅ Teslimat bilgilerini oluşturma (fotoğraf, onay, not)
- ✅ Kendi hizmet geçmişini ve müşteri geri bildirimlerini görüntüleme
- ✅ Müşteri ile sistem içi mesajlaşma
- ✅ Kendi performans ve ortalama puanlarını takip etme

### 💼 3. Business Owner (İşletme Sahibi)

**Kullanım Senaryoları:**

- ✅ İşletme ve şube bilgilerini oluşturma, düzenleme
- ✅ Şube açma/kapama ve lokasyon yönetimi
- ✅ Hizmet ve paket tanımları oluşturma, düzenleme
- ✅ Personel ekleme, çıkarma, randevu atama
- ✅ Ürün tanımlama, stok ve fiyat yönetimi
- ✅ Randevu ve rezervasyon akışlarını onaylama / iptal etme
- ✅ Satışlar, ödemeler ve iadeleri takip etme
- ✅ Hizmet geçmişi ve personel performanslarını görüntüleme
- ✅ Yorumlar, şikayetler ve memnuniyet istatistiklerini görüntüleme
- ✅ Sadakat kampanyası, ödül tanımı ve indirim oranlarını yapılandırma
- ✅ Sipariş durumu güncelleme, teslimat onayı

### 📦 4. Service Provider (Hizmet Sunucu / Platform veya Franchise Yetkili)

**Kullanım Senaryoları:**

- ✅ Farklı işletmelere ait hizmetleri sisteme dahil etme
- ✅ Genel hizmet kataloglarını belirleme
- ✅ Üyelik planları ve paket yapılarını tanımlama
- ✅ Franchise işletmelere genel kural, şablon ve kategori oluşturma
- ✅ Bölge veya kategori bazlı kampanya planlama
- ✅ Sistem üzerinden özel anlaşmalı servis noktalarını yönetme

> Not: Bu rol opsiyoneldir, eğer sistemde merkezi bir hizmet sağlayıcı varsa aktif kullanılır.

### 🛡️ 5. Admin (Sistem Yöneticisi)

**Kullanım Senaryoları:**

- ✅ Tüm kullanıcı ve işletmeleri görüntüleme
- ✅ Şikayetleri, kötüye kullanımları denetleme
- ✅ Hesap kapatma, dondurma ve kullanıcı rollerini güncelleme
- ✅ Yeni hizmet kategorisi, sistem tanımı ve ödül yapısı oluşturma
- ✅ Randevu, sipariş ve işlem geçmişine tam erişim
- ✅ Sistem bildirimlerini yönetme ve gönderme
- ✅ Tüm audit log kayıtlarını görüntüleme
- ✅ Platform genel istatistik ve raporlarını inceleme
- ✅ İşletme başvurularını onaylama / reddetme
- ✅ Erişim yetkilerini ve sistem ayarlarını yönetme

## 🎯 İsteğe Bağlı Ek Roller Önerileri (Gelecek için)

| Rol Adı | Açıklama |
|---------|----------|
| Corporate Manager | Kurumsal müşteriler için filo yöneticisi. Araç/randevu yönetimi yapar. |
| Call Center Agent | Gelen çağrıları yanıtlar, randevu oluşturur. |
| Delivery Agent | Fiziksel teslimat, saklama iadesi, QR teslimat gibi işlemleri yürütür. |