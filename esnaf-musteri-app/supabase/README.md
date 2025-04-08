# Supabase Veritabanı Yönetimi

Bu klasör, Esnaf Müşteri Uygulaması için Supabase veritabanı yapılandırmasını ve migrasyon dosyalarını içerir.

## Yerel Geliştirme Ortamı

Yerel geliştirme ortamınızı başlatmak için:

```bash
supabase start
```

Bu komut, Docker konteynerlerinde yerel bir Supabase örneği başlatacaktır. Aşağıdaki bilgiler komut çıktısında görüntülenecektir:
- API URL
- GraphQL URL
- Studio URL
- Anon key
- Service role key

## Migrasyon Yönetimi

### Yeni Migrasyon Oluşturma

Yeni bir migrasyon oluşturmak için, scripts klasöründeki `create_migration.sh` betiğini kullanabilirsiniz:

```bash
./scripts/create_migration.sh <migrasyon_adi>
```

Bu, `supabase/migrations` klasöründe tarih damgalı bir SQL dosyası oluşturacaktır.

### Migrasyonları Uygulama

Mevcut tüm migrasyonları veritabanına uygulamak için:

```bash
supabase db reset
```

Bu komut, veritabanınızı sıfırlayacak ve tüm migrasyon dosyalarını sırayla uygulayacaktır.

## Seed Verileri

`seed.sql` dosyası, veritabanınızın başlangıç verilerini içerir. Bu veriler, `supabase db reset` komutu çalıştırıldığında otomatik olarak uygulanır.

## Yerel ve Uzak Senkronizasyon

Uzak Supabase projenize bağlanmak için:

```bash
supabase login
supabase link --project-ref <proje-id>
```

Yerel şemanızı uzak projeye aktarmak için:

```bash
supabase db push
```

Uzak şemanızı yerel ortamınıza çekmek için:

```bash
supabase db pull
```

## Yardımcı İpuçları

1. Supabase Studio'ya erişmek için: [http://localhost:54323](http://localhost:54323)
2. API'ye doğrudan erişmek için: [http://localhost:54321](http://localhost:54321)
3. GraphQL arayüzüne erişmek için: [http://localhost:54321/graphql/v1](http://localhost:54321/graphql/v1)

## Row Level Security (RLS) Politikaları

Tablolarımız için RLS politikaları etkinleştirilmiştir. Bunlar, kullanıcıların yalnızca kendi verilerine erişebilmesini sağlar.

## Kullanıcı Kimlik Doğrulama

Auth triggers, new user kaydı yaptığında `public.users` tablosuna otomatik olarak kayıt ekler.

## Daha Fazla Yardım

Daha fazla bilgi için [Supabase Dokümantasyonu](https://supabase.io/docs)nu ziyaret edebilirsiniz. 