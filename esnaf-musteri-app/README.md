# Esnaf Müşteri Uygulaması

Bu uygulama, esnaf ve hizmet sağlayıcılar ile müşterileri buluşturan, randevu, ödeme ve değerlendirme sistemlerini içeren kapsamlı bir mobil uygulamadır.

## Teknolojiler

- React Native
- Expo
- TypeScript
- Supabase (Auth, Database, Storage)
- Redux Toolkit
- React Navigation
- React Native Maps
- Formik & Yup

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. `.env.example` dosyasını `.env` olarak kopyalayın ve gereken değerleri girin:
```bash
cp .env.example .env
```

3. Uygulamayı başlatın:
```bash
npm start
```

## Proje Yapısı

```
src/
├── components/     # Yeniden kullanılabilir UI bileşenleri
├── screens/        # Ekran bileşenleri
├── navigation/     # Gezinme yapılandırması
├── services/       # API ve diğer servisler
├── utils/          # Yardımcı fonksiyonlar
├── hooks/          # Özel React hooks
├── assets/         # Resimler, fontlar ve diğer statik dosyalar
├── constants/      # Sabit değişkenler
└── types/          # TypeScript tipleri
```

## Geliştirme

- Android için: `npm run android`
- iOS için: `npm run ios`
- Web için: `npm run web`
- Linting: `npm run lint`
- Test: `npm run test`

## Katkıda Bulunma

1. Bu repoyu fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inize push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

MIT

## Örnek Veri Kullanımı

Bu projede, geliştirme aşamasında gerçek veritabanı olmadan çalışabilmek için örnek veri sistemi kurulmuştur. Bu sistem, çevre değişkenlerine bağlı olarak gerçek Supabase veritabanı veya yerel örnek veriler arasında geçiş yapmanıza olanak tanır.

### Kullanım

1. **Geliştirme Modunda Örnek Veriler:**

   Örnek verileri kullanmak için `.env.development` dosyasında `USE_MOCK_DATA=true` olarak ayarlanmıştır. Bu modda, uygulama gerçek Supabase yerine `src/models` dizinindeki örnek verileri kullanacaktır.

2. **Gerçek Veritabanı Kullanımı:**

   Gerçek Supabase veritabanını kullanmak için `.env.development` dosyasında `USE_MOCK_DATA=false` olarak ayarlayın ve gerçek Supabase kimlik bilgilerinizi girin.

3. **Üretim Modu:**

   Üretim ortamında `.env.production` dosyası kullanılır ve burada `USE_MOCK_DATA=false` olarak ayarlanmıştır. Üretim ortamında her zaman gerçek veritabanı kullanılır.

### API Kullanımı

Veri işlemleri için `src/services/dataService.ts` modülündeki fonksiyonları kullanın:

```typescript
import { getUserData, getAllServices, getBusinessData } from '../services/dataService';

// Örnek kullanım
const fetchUserData = async () => {
  const { data, error } = await getUserData('user-id');
  if (error) {
    console.error('Hata:', error);
    return;
  }
  console.log('Kullanıcı:', data);
};
```

### Örnek Verileri Veritabanına Yükleme

Geliştirme aşamasında örnek verileri gerçek Supabase veritabanınıza yüklemek için:

```typescript
import { seedDatabaseWithSampleData } from '../services/dataService';

const loadSampleData = async () => {
  const result = await seedDatabaseWithSampleData();
  if (result.success) {
    console.log('Örnek veriler başarıyla yüklendi');
  } else {
    console.error('Veri yükleme hatası:', result.error);
  }
};
```

Bu fonksiyon SADECE geliştirme modunda çalışacaktır.

## Örnek Veri Avantajları

- İnternet bağlantısı olmadan geliştirme yapabilirsiniz
- Tutarlı ve tahmin edilebilir test verileriyle çalışabilirsiniz
- Hızlı prototipleme ve UI geliştirme yapabilirsiniz
- Gerçek API çağrılarını taklit edebilirsiniz
- Üretim ortamına geçerken kod değişikliği gerektirmez 