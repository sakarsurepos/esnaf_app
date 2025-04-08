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