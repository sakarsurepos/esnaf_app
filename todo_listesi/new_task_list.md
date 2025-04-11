# 📋 TASK LİSTESİ: RANDEVU VE ÖDEME İŞ AKIŞI ENTEGRASYONu
🔄 İŞ AKIŞI KURALLARI ENTEGRASYONU
1. Veri Modeli Güncellemeleri
[ ] Business Settings tablosu oluştur
[ ] Payment policy özellikleri ekle (free_booking, deposit_required, full_payment_required)
[ ] Deposit rate alanı ekle
[ ] Allow package use özelliği ekle
[ ] Allow walkin payment özelliği ekle
[ ] Cancellation policy alanlarını ekle
[ ] Services tablosunu genişlet
[ ] Flow type alanı ekle (service_purchase_flow, direct_booking_flow)
[ ] Override business settings alanı ekle
[ ] Custom settings alanı ekle (JSON/nested)
[ ] Allow package purchase alanı ekle
[ ] Appointments tablosunu genişlet
[ ] Payment status alanı ekle (unpaid, deposit_paid, fully_paid, paid_with_package)
[ ] Flow type alanı ekle
[ ] Check-in ve check-out zaman alanları ekle
[ ] İptal detayları ve iade durum alanları ekle
[ ] Payments tablosu oluştur
[ ] Appointment ve order referansları ekle
[ ] Ödeme tipi, tutarı ve durum alanları ekle
[ ] Depozito alanı ekle
2. Backend Servislerin Geliştirilmesi
[ ] BookingService oluştur
[ ] canCreateReservation fonksiyonu ekle
[ ] canCheckIn fonksiyonu ekle
[ ] canCancelAppointment fonksiyonu ekle
[ ] createAppointmentWithPackage fonksiyonu ekle
[ ] PaymentService oluştur
[ ] calculatePaymentAmount fonksiyonu ekle
[ ] createPaymentForAppointment fonksiyonu ekle
[ ] createPaymentForPackage fonksiyonu ekle
[ ] processRefund fonksiyonu ekle
[ ] PackageService oluştur
[ ] getUserPackages fonksiyonu ekle
[ ] validatePackageForService fonksiyonu ekle
[ ] usePackageForAppointment fonksiyonu ekle
3. UI Bileşenleri ve Ekranlar
[ ] Randevu Oluşturma Ekranını Güncelle
[ ] Kullanıcı paketlerini gösterme
[ ] Farklı ödeme politikaları için bilgilendirme alanı
[ ] Ödeme tutarını açıkça belirtme (depozito veya tam ödeme)
[ ] Randevu Ödeme Ekranı Oluştur
[ ] Ödeme yöntemleri seçimi
[ ] İşlem onayı
[ ] Ödeme sonrası durum gösterimi
[ ] Randevu Detay Ekranını Güncelle
[ ] Ödeme durumu gösterimi
[ ] Check-in / Check-out düğmeleri
[ ] İptal politikası bilgisi
[ ] İşletme Paneli Ayarlar Ekranını Güncelle
[ ] Payment policy ayarları
[ ] Cancellation policy ayarları
[ ] Package use ayarları