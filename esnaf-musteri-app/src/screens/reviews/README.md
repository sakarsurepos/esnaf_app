# Değerlendirme ve Yorumlar Modülü

Bu modül, müşterilerin aldıkları hizmetlere ve ürünlere yorum ve değerlendirme yapmalarını sağlar.

## Özellikler

- **Puan Verme**: 5 yıldız üzerinden puanlama sistemi
- **Yorum Yazma**: Hizmetle ilgili deneyimlerini detaylı anlatma imkanı
- **Fotoğraf Ekleme**: Hizmet/ürün ile ilgili fotoğraflar ekleyebilme (max. 5 adet)
- **Değerlendirme Düzenleme**: Önceden yapılmış değerlendirmeleri düzenleme imkanı

## Ekranlar

### WriteReviewScreen

Bu ekran, tamamlanmış siparişler için değerlendirme ve yorum yazma imkanı sunar. Kullanıcı:

- 1-5 arasında yıldız puanı verebilir
- 500 karaktere kadar yorum yazabilir (isteğe bağlı)
- En fazla 5 adet fotoğraf ekleyebilir (isteğe bağlı)

## Kullanım

Kullanıcılar sipariş detay sayfasından (OrderDetailScreen) sipariş teslim edildikten sonra değerlendirme yapabilirler. 

```typescript
// Değerlendirme ekranına yönlendirme
navigation.navigate('WriteReview', { 
  orderId: 'sipariş-id', 
  businessName: 'İşletme Adı' 
});
```

## Servisler

Değerlendirme işlemleri için ReviewService kullanılır:

- **getOrderReviewStatus**: Bir siparişe değerlendirme yapılıp yapılmadığını kontrol eder
- **writeReview**: Yeni değerlendirme oluşturur
- **editReview**: Varolan değerlendirmeyi düzenler
- **getReviews**: İşletmeye yapılan değerlendirmeleri getirir

## Gelecek Geliştirmeler

- Detaylı puanlama sistemi (hizmet kalitesi, çalışan ilgisi, fiyat-performans, temizlik)
- Değerlendirme etkileşimleri (faydalı/faydasız oylaması)
- Üst yönetici/işletme yanıtları
- Yorum filtreleme ve sıralama özellikleri 