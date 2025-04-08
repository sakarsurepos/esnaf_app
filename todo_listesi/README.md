# Esnaf Müşteri Uygulaması Yapılacaklar Listesi

Bu klasör, "Esnaf Müşteri Uygulaması" projesinin yapılacaklar listesini içermektedir. Her ana başlık için ayrı bir dosya oluşturulmuştur.

## Ana Başlıklar

1. [Proje Kurulumu](1_Proje_Kurulumu.md)
2. [Veritabanı ve Backend İşlemleri](2_Veritabani_ve_Backend_Islemleri.md)
3. [Kimlik Doğrulama Modülü](3_Kimlik_Dogrulama_Modulu.md)
4. [Ana Ekran ve Keşfet](4_Ana_Ekran_ve_Kesfet.md)
5. [Profil Yönetimi](5_Profil_Yonetimi.md)
6. [Hizmet Keşfi](6_Hizmet_Kesfi.md)
7. [İşletme Detay Sayfası](7_Isletme_Detay_Sayfasi.md)
8. [Randevu Sistemi](8_Randevu_Sistemi.md)
9. [Ödeme İşlemleri](9_Odeme_Islemleri.md)
10. [Randevu ve Sipariş Geçmişi](10_Randevu_ve_Siparis_Gecmisi.md)
11. [Değerlendirme ve Yorumlar](11_Degerlendirme_ve_Yorumlar.md)
12. [Bildirimler](12_Bildirimler.md)
13. [Sadakat Programı](13_Sadakat_Programi.md)
14. [Destek ve Yardım](14_Destek_ve_Yardim.md)
15. [Referans Sistemi](15_Referans_Sistemi.md)
16. [Performans Optimizasyonu](16_Performans_Optimizasyonu.md)
17. [Test ve Hata Giderme](17_Test_ve_Hata_Giderme.md)
18. [Yayınlama ve Dağıtım](18_Yayinlama_ve_Dagitim.md)

## Cursor Rules

Bu projedeki tüm görevlerin düzenlenmesi ve durumlarının takibi için `.cursorrules` dosyası oluşturulmuştur. Bu dosya, görev işaretleme kurallarını ve düzenleme standartlarını içerir. Proje üzerinde çalışmaya başlamadan önce bu dosyayı incelemeniz önerilir.

## Kullanım

Görevlerin durumunu belirtmek için aşağıdaki işaretleme kuralları kullanılabilir:

| İşaret | Anlam | Açıklama |
|--------|-------|----------|
| `[ ]` | Beklemede | Henüz başlanmamış, durumu belirtilmemiş görev |
| `[x]` | Tamamlandı | Görevi tamamen tamamlandı, başarıyla bitirildi |
| `[t]` | Yapılacak | Bekleyen, yapılması planlanan görev |
| `[1]` | 1. Öncelikli | Acil olarak tamamlanması gereken birinci öncelikli görev |
| `[2]` | 2. Öncelikli | Önemli ama birinci öncelik kadar acil olmayan görev |
| `[p]` | Pass (Geçildi) | Şu an için ertelenen veya atlanması kararlaştırılan görev |

Örnek kullanım:
```markdown
- [x] 1.1. React Native & Expo kurulumu
- [1] 1.2. Supabase projesi oluşturma
- [2] 1.3. Temel klasör yapısının oluşturulması
- [t] 1.4. Gerekli kütüphanelerin kurulumu
- [p] 1.5. Ortam değişkenlerinin yapılandırılması
```

## İlerleme Durumu

Bu bölüm, projenin genel ilerleme durumunu gösterecektir.

- Tamamlanan Görevler: 5
- Toplam Görevler: 90
- İlerleme: %5.6 