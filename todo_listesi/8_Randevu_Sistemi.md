# 8. Randevu Sistemi

## Geliştirme Durumu

### Tamamlanan İşler
- [x] Randevu modeli ve örnek veriler oluşturuldu
- [x] Randevu bilgilerini gösterme (ProfileScreen içinde mevcut randevuları listeleme)
- [x] Randevu detaylarını görüntüleme ekranı (AppointmentDetailScreen)
- [x] Randevu detayına geçiş için ProfileScreen'e navigasyon eklendi
- [x] 8.1. Randevu oluşturma akışı
- [x] 8.2. Tarih ve saat seçimi (personele göre müsait zaman dilimleri)
- [x] 8.3. Personel seçimi
- [x] 8.4. Hizmet seçimi
- [x] 8.5. Randevu özeti ve onay

### Devam Eden İşler
- [~] Randevu iptal etme işlevi (UI hazır, backend entegrasyonu eksik)
- [~] Randevu yeniden planlama işlevi (UI hazır, backend entegrasyonu eksik)
- [~] 8.6. Randevu düzenleme ve iptal (backend entegrasyonu eksik)

### Yapılan Geliştirmeler
- Randevu oluşturma akışı değiştirildi:
  - Önce servis seçimi
  - Sonra personel seçimi
  - Ardından seçilen personelin müsait olduğu tarih ve saatler
  - Son olarak randevu özeti ve onay
- `getStaffByBusinessService` fonksiyonu eklendi (belirli bir işletme ve servis için personel listesi)
- `getAvailableTimeSlots` fonksiyonu, personel ID'sine göre müsait zaman dilimlerini getiriyor
- Bileşenler arasındaki veri akışı düzenlendi

### Tamamlanacak İşler
- [ ] Bildirim entegrasyonu
- [ ] Randevu düzenleme işlevi için backend entegrasyonu
- [ ] Randevu iptal işlevi için backend entegrasyonu

## Planlanan Görevler

### 1. Bildirim Entegrasyonu (2 gün)
- Randevu oluşturulduğunda bildirim
- Randevu yaklaştığında hatırlatma
- Randevu değişikliklerinde bildirim

### 2. Backend Entegrasyonu (3 gün)
- Randevu düzenleme API endpoint'leri
- Randevu iptal API endpoint'leri
- Bildirim gönderme servisleri

### 3. Test ve İyileştirme (2 gün)
- Akış testleri
- Hata düzeltmeleri
- Performans iyileştirmeleri

## Sprint Planlaması

### Sonraki Sprint (1-2 Hafta)
- Bildirim entegrasyonu (Frontend Geliştirici)
- Randevu düzenleme ve iptal API endpoint'leri (Backend Geliştirici)
- Testler ve hata düzeltmeleri (Tüm Takım)
- Dokümantasyon (Teknik Yazar) 