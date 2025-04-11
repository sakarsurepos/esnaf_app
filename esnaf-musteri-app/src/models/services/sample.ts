import { Service, ServiceType } from "./types";

// Services için örnek veri
export const sampleServices: Service[] = [
  {
    id: 'service-uuid-1',
    title: 'Erkek Saç Kesimi',
    description: 'Profesyonel erkek saç kesimi hizmetimizde, deneyimli kuaförlerimiz tarafından kişiye özel stil ve kesim uygulanır.',
    price: 120.00,
    category_id: 'category-uuid-1', // Berber & Kuaför
    business_id: 'business-uuid-1', // Ahmet Berber Salonu
    duration_minutes: 30,
    branch_id: 'branch-uuid-1', // Varsayılan şube
    staff_id: 'staff-uuid-1', // Ahmet (kendisi)
    service_type_id: 'service-type-uuid-1', // on_site
    is_active: true,
    approval_status: 'approved',
    // Yeni alanlar
    service_type: ServiceType.SERVICE,
    requires_staff: true,
    requires_resource: false,
    is_purchasable: false,
    flow_type: 'direct_booking_flow',
    override_business_settings: false,
    allow_package_purchase: true
  },
  {
    id: 'service-uuid-2',
    title: 'Sakal Tıraşı',
    description: 'Klasik ustura ile hassas sakal tıraşı, yüz masajı ve bakım sonrası losyon uygulaması dahildir.',
    price: 70.00,
    category_id: 'category-uuid-1', // Berber & Kuaför
    business_id: 'business-uuid-1', // Ahmet Berber Salonu
    duration_minutes: 20,
    branch_id: 'branch-uuid-1', // Varsayılan şube
    staff_id: 'staff-uuid-1', // Ahmet (kendisi)
    service_type_id: 'service-type-uuid-1', // on_site
    is_active: true,
    approval_status: 'approved',
    // Yeni alanlar
    service_type: ServiceType.SERVICE,
    requires_staff: true,
    requires_resource: false,
    is_purchasable: false,
    flow_type: 'direct_booking_flow',
    override_business_settings: false,
    allow_package_purchase: true
  },
  {
    id: 'service-uuid-3',
    title: 'Cilt Bakımı',
    description: 'Derin temizleme, peeling ve maske uygulamasını içeren profesyonel cilt bakımı.',
    price: 280.00,
    category_id: 'category-uuid-2', // Güzellik & Bakım
    business_id: 'business-uuid-2', // Ayşe Güzellik Merkezi
    duration_minutes: 60,
    branch_id: 'branch-uuid-2', // Varsayılan şube
    staff_id: 'staff-uuid-2', // Ayşe (kendisi)
    service_type_id: 'service-type-uuid-1', // on_site
    is_active: true,
    approval_status: 'approved',
    // Yeni alanlar
    flow_type: 'service_purchase_flow',
    override_business_settings: true,
    custom_settings: {
      payment_policy: 'full_payment_required',
      deposit_rate: 0
    },
    allow_package_purchase: true
  },
  {
    id: 'service-uuid-4',
    title: 'Ev Temizliği',
    description: '2+1 ev için kapsamlı temizlik hizmeti, mutfak ve banyo dahil.',
    price: 550.00,
    category_id: 'category-uuid-4', // Temizlik
    business_id: 'business-uuid-3', // Profesyonel Temizlik Hizmetleri
    duration_minutes: 180,
    branch_id: 'branch-uuid-3', // Varsayılan şube
    staff_id: 'staff-uuid-3', // Mehmet'in ekibinden biri
    service_type_id: 'service-type-uuid-2', // home_service
    is_active: true,
    approval_status: 'approved',
    // Yeni alanlar
    flow_type: 'direct_booking_flow',
    override_business_settings: false,
    allow_package_purchase: false
  },
  {
    id: 'service-uuid-5',
    title: '3 Seanslık Cilt Bakım Paketi',
    description: 'Üç seanslık profesyonel cilt bakım paketi. Her seans 60 dakika sürmektedir.',
    price: 750.00,
    category_id: 'category-uuid-2', // Güzellik & Bakım
    business_id: 'business-uuid-2', // Ayşe Güzellik Merkezi
    duration_minutes: 60,
    branch_id: 'branch-uuid-2', // Varsayılan şube
    staff_id: 'staff-uuid-2', // Ayşe (kendisi)
    service_type_id: 'service-type-uuid-1', // on_site
    is_active: true,
    approval_status: 'approved',
    // Yeni alanlar
    flow_type: 'service_purchase_flow',
    override_business_settings: false,
    allow_package_purchase: true
  },
  // Depozito gerektiren yeni hizmet örneği
  {
    id: 'service-uuid-6',
    title: 'Özel Masaj Terapisi',
    description: 'Kişiye özel masaj terapisi, aromaterapi ve sıcak taş uygulaması ile rahatlama ve yenilenme sağlar.',
    price: 350.00,
    category_id: 'category-uuid-2', // Güzellik & Bakım
    business_id: 'business-uuid-2', // Ayşe Güzellik Merkezi
    duration_minutes: 90,
    branch_id: 'branch-uuid-2', // Varsayılan şube
    staff_id: 'staff-uuid-2', // Ayşe (kendisi)
    service_type_id: 'service-type-uuid-1', // on_site
    is_active: true,
    approval_status: 'approved',
    // Yeni alanlar
    flow_type: 'direct_booking_flow',
    override_business_settings: true,
    custom_settings: {
      payment_policy: 'deposit_required',
      deposit_rate: 0.25 // %25 depozito
    },
    allow_package_purchase: true
  },
  // Tam ödeme gerektiren yeni hizmet örneği
  {
    id: 'service-uuid-7',
    title: 'Profesyonel Fotoğraf Çekimi',
    description: 'Stüdyo ortamında profesyonel portre fotoğraf çekimi, dijital rötuş ve 5 adet basılı fotoğraf dahildir.',
    price: 600.00,
    category_id: 'category-uuid-5', // Fotoğrafçılık
    business_id: 'business-uuid-4', // Profesyonel Fotoğrafçılık
    duration_minutes: 120,
    branch_id: 'branch-uuid-4', // Varsayılan şube
    staff_id: 'staff-uuid-4', // Fotoğrafçı
    service_type_id: 'service-type-uuid-1', // on_site
    is_active: true,
    approval_status: 'approved',
    // Yeni alanlar
    flow_type: 'direct_booking_flow',
    override_business_settings: true,
    custom_settings: {
      payment_policy: 'full_payment_required',
      deposit_rate: 0
    },
    allow_package_purchase: false
  },
  // Ace Tenis Kulübü hizmetleri - RESOURCE tipi
  {
    id: 'service-uuid-8',
    title: 'Tek Kort Kiralama',
    description: 'Saatlik tekli kort kiralama hizmeti. Raket kiralama ayrı ücrete tabidir.',
    price: 150.00,
    category_id: 'category-uuid-8', // Spor ve Rekreasyon
    business_id: 'business-uuid-4', // Ace Tenis Kulübü
    duration_minutes: 60,
    branch_id: 'branch-uuid-4', // Varsayılan şube
    staff_id: 'staff-uuid-4', // Tenis Kulübü sorumlusu
    service_type_id: 'service-type-uuid-1', // on_site
    is_active: true,
    approval_status: 'approved',
    // Yeni alanlar
    service_type: ServiceType.RESOURCE,
    requires_staff: false,
    requires_resource: true,
    resource_type_id: 'tennis-court',
    is_purchasable: false,
    flow_type: 'direct_booking_flow',
    override_business_settings: false,
    allow_package_purchase: true
  },
  {
    id: 'service-uuid-9',
    title: 'Çift Kort Kiralama',
    description: 'Saatlik çiftli kort kiralama hizmeti. 4 kişiye kadar kullanılabilir. Raket kiralama ayrı ücrete tabidir.',
    price: 200.00,
    category_id: 'category-uuid-8', // Spor ve Rekreasyon
    business_id: 'business-uuid-4', // Ace Tenis Kulübü
    duration_minutes: 60,
    branch_id: 'branch-uuid-4', // Varsayılan şube
    staff_id: 'staff-uuid-4', // Tenis Kulübü sorumlusu
    service_type_id: 'service-type-uuid-1', // on_site
    is_active: true,
    approval_status: 'approved',
    // Yeni alanlar
    service_type: ServiceType.RESOURCE,
    requires_staff: false,
    requires_resource: true,
    resource_type_id: 'tennis-court',
    is_purchasable: false,
    flow_type: 'direct_booking_flow',
    override_business_settings: false,
    allow_package_purchase: true
  },
  {
    id: 'service-uuid-10',
    title: 'Özel Tenis Dersi',
    description: 'Lisanslı eğitmenlerimizden birebir tenis dersi. Başlangıç, orta ve ileri seviye seçenekleri mevcuttur.',
    price: 300.00,
    category_id: 'category-uuid-8', // Spor ve Rekreasyon
    business_id: 'business-uuid-4', // Ace Tenis Kulübü
    duration_minutes: 60,
    branch_id: 'branch-uuid-4', // Varsayılan şube
    staff_id: 'staff-uuid-5', // Tenis Eğitmeni
    service_type_id: 'service-type-uuid-1', // on_site
    is_active: true,
    approval_status: 'approved',
    // Yeni alanlar
    service_type: ServiceType.SERVICE,
    requires_staff: true,
    requires_resource: true,
    resource_type_id: 'tennis-court',
    is_purchasable: false,
    flow_type: 'direct_booking_flow',
    override_business_settings: true,
    custom_settings: {
      payment_policy: 'deposit_required',
      deposit_rate: 0.30 // %30 depozito
    },
    allow_package_purchase: true
  },
  {
    id: 'service-uuid-11',
    title: '10 Saatlik Tenis Paketi',
    description: '10 saat tenis kortu kullanımı içeren paket. 2 ay içerisinde kullanılmalıdır.',
    price: 1300.00,
    category_id: 'category-uuid-8', // Spor ve Rekreasyon
    business_id: 'business-uuid-4', // Ace Tenis Kulübü
    duration_minutes: 600, // 10 saat
    branch_id: 'branch-uuid-4', // Varsayılan şube
    staff_id: 'staff-uuid-4', // Tenis Kulübü sorumlusu
    service_type_id: 'service-type-uuid-1', // on_site
    is_active: true,
    approval_status: 'approved',
    flow_type: 'service_purchase_flow',
    override_business_settings: true,
    custom_settings: {
      payment_policy: 'full_payment_required',
      deposit_rate: 0
    },
    allow_package_purchase: false
  },
  {
    id: 'service-uuid-12',
    title: 'Raket Kiralama',
    description: 'Profesyonel tenis raketi kiralama hizmeti. Kort kiralama ile birlikte alınabilir.',
    price: 50.00,
    category_id: 'category-uuid-8', // Spor ve Rekreasyon
    business_id: 'business-uuid-4', // Ace Tenis Kulübü
    duration_minutes: 60,
    branch_id: 'branch-uuid-4', // Varsayılan şube
    staff_id: 'staff-uuid-4', // Tenis Kulübü sorumlusu
    service_type_id: 'service-type-uuid-1', // on_site
    is_active: true,
    approval_status: 'approved',
    flow_type: 'direct_booking_flow',
    override_business_settings: true,
    custom_settings: {
      payment_policy: 'free_booking',
      deposit_rate: 0
    },
    allow_package_purchase: false
  },
  // Ürünler - PRODUCT tipi
  {
    id: 'product-uuid-1',
    title: 'Wilson Pro Staff 97 Tenis Raketi',
    description: 'Profesyonel seviye Wilson Pro Staff 97 tenis raketi. 315g ağırlık, 97 inç kafa boyutu.',
    price: 2500.00,
    category_id: 'category-uuid-8', // Spor ve Rekreasyon
    business_id: 'business-uuid-4', // Ace Tenis Kulübü
    duration_minutes: null,
    branch_id: 'branch-uuid-4',
    staff_id: null,
    service_type_id: null,
    is_active: true,
    approval_status: 'approved',
    // Ürün özellikleri
    service_type: ServiceType.PRODUCT,
    requires_staff: false,
    requires_resource: false,
    is_purchasable: true,
    has_stock: true,
    stock_quantity: 5,
    flow_type: 'service_purchase_flow',
    override_business_settings: true,
    custom_settings: {
      payment_policy: 'full_payment_required',
    },
    allow_package_purchase: false
  },
  {
    id: 'product-uuid-2',
    title: 'Profesyonel Saç Bakım Seti',
    description: 'Şampuan, saç kremi ve saç maskesi içeren profesyonel bakım seti.',
    price: 450.00,
    category_id: 'category-uuid-1', // Berber & Kuaför
    business_id: 'business-uuid-1', // Ahmet Berber Salonu
    duration_minutes: null,
    branch_id: 'branch-uuid-1',
    staff_id: null,
    service_type_id: null,
    is_active: true,
    approval_status: 'approved',
    // Ürün özellikleri
    service_type: ServiceType.PRODUCT,
    requires_staff: false,
    requires_resource: false,
    is_purchasable: true,
    has_stock: true,
    stock_quantity: 12,
    flow_type: 'service_purchase_flow',
    override_business_settings: false,
    allow_package_purchase: false
  },
  // Paket örneği - PACKAGE tipi
  {
    id: 'package-uuid-1',
    title: 'Aylık Tenis Üyelik Paketi',
    description: 'Ayda 8 saat kort kullanımı ve 2 saat özel ders içeren aylık üyelik paketi.',
    price: 1200.00,
    category_id: 'category-uuid-8', // Spor ve Rekreasyon
    business_id: 'business-uuid-4', // Ace Tenis Kulübü
    duration_minutes: null,
    branch_id: 'branch-uuid-4',
    staff_id: null,
    service_type_id: null,
    is_active: true,
    approval_status: 'approved',
    // Paket özellikleri
    service_type: ServiceType.PACKAGE,
    requires_staff: false,
    requires_resource: false,
    is_purchasable: true,
    flow_type: 'service_purchase_flow',
    override_business_settings: true,
    custom_settings: {
      payment_policy: 'full_payment_required',
    },
    allow_package_purchase: false,
    included_services: ['service-uuid-8', 'service-uuid-10'] // Kort kiralama ve özel ders
  }
]; 