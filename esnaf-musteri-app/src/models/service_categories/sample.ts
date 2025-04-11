import { Tables } from "../../types/supabase";
import { ServiceSubcategory, ExtendedServiceCategory } from "./types";

// Alt kategoriler
export const sampleServiceSubcategories: ServiceSubcategory[] = [
  // Sağlık ve Güzellik alt kategorileri
  {
    id: 'subcategory-uuid-101',
    name: 'Kuaför & Berber',
    parent_id: 'category-uuid-1',
    description: 'Saç kesimi, sakal tıraşı ve saç şekillendirme hizmetleri',
    icon_url: 'cut-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-102',
    name: 'Güzellik Salonları',
    parent_id: 'category-uuid-1',
    description: 'Manikür, pedikür, cilt bakımı ve makyaj hizmetleri',
    icon_url: 'flower-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-103',
    name: 'Cilt Bakım Merkezleri',
    parent_id: 'category-uuid-1',
    description: 'Profesyonel cilt bakımı ve tedavi hizmetleri',
    icon_url: 'sunny-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-104',
    name: 'Spa & Masaj Salonları',
    parent_id: 'category-uuid-1',
    description: 'Masaj, terapi ve spa hizmetleri',
    icon_url: 'body-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-105',
    name: 'Diyetisyen Ofisleri',
    parent_id: 'category-uuid-1',
    description: 'Beslenme ve diyet danışmanlığı hizmetleri',
    icon_url: 'nutrition-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-106',
    name: 'Estetik ve Kozmetik Klinikler',
    parent_id: 'category-uuid-1',
    description: 'Kozmetik prosedürler ve estetik işlemler',
    icon_url: 'medkit-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-107',
    name: 'Psikolog / Psikiyatrist',
    parent_id: 'category-uuid-1',
    description: 'Ruh sağlığı ve psikolojik destek hizmetleri',
    icon_url: 'brain-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-108',
    name: 'Diş Hekimi Muayenehaneleri',
    parent_id: 'category-uuid-1',
    description: 'Diş sağlığı ve tedavi hizmetleri',
    icon_url: 'bandage-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-109',
    name: 'Özel Hastane ve Doktor Muayenehaneleri',
    parent_id: 'category-uuid-1',
    description: 'Özel sağlık hizmetleri ve doktor konsültasyonları',
    icon_url: 'medical-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-110',
    name: 'Fizyoterapi Merkezleri',
    parent_id: 'category-uuid-1',
    description: 'Fizik tedavi ve rehabilitasyon hizmetleri',
    icon_url: 'fitness-outline',
    is_active: true
  },

  // Eğitim ve Danışmanlık alt kategorileri
  {
    id: 'subcategory-uuid-201',
    name: 'Özel Ders Veren Öğretmenler',
    parent_id: 'category-uuid-2',
    description: 'Birebir özel ders ve eğitim hizmetleri',
    icon_url: 'school-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-202',
    name: 'Sürücü Kursları',
    parent_id: 'category-uuid-2',
    description: 'Ehliyet eğitimi ve sürücü kursu hizmetleri',
    icon_url: 'car-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-203',
    name: 'Yaşam Koçları',
    parent_id: 'category-uuid-2',
    description: 'Bireysel gelişim ve yaşam koçluğu hizmetleri',
    icon_url: 'compass-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-204',
    name: 'Kariyer Danışmanları',
    parent_id: 'category-uuid-2',
    description: 'İş ve kariyer gelişimi danışmanlık hizmetleri',
    icon_url: 'briefcase-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-205',
    name: 'Dil Kursları (Birebir Seanslar)',
    parent_id: 'category-uuid-2',
    description: 'Birebir yabancı dil eğitimi ve özel dil dersleri',
    icon_url: 'language-outline',
    is_active: true
  },

  // Ev ve Yaşam Hizmetleri alt kategorileri
  {
    id: 'subcategory-uuid-301',
    name: 'Temizlik Hizmetleri',
    parent_id: 'category-uuid-3',
    description: 'Ev ve ofis temizliği hizmetleri',
    icon_url: 'water-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-302',
    name: 'Teknik Servis',
    parent_id: 'category-uuid-3',
    description: 'Beyaz eşya, klima vb. teknik servis hizmetleri',
    icon_url: 'build-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-303',
    name: 'İç Mimar & Dekorasyon Danışmanları',
    parent_id: 'category-uuid-3',
    description: 'İç mimarlık ve dekorasyon danışmanlığı hizmetleri',
    icon_url: 'home-outline',
    is_active: true
  },

  // Evcil Hayvan Hizmetleri alt kategorileri
  {
    id: 'subcategory-uuid-401',
    name: 'Veteriner Klinikleri',
    parent_id: 'category-uuid-4',
    description: 'Evcil hayvan sağlık hizmetleri',
    icon_url: 'medkit-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-402',
    name: 'Pet Kuaförleri',
    parent_id: 'category-uuid-4',
    description: 'Evcil hayvan bakım ve kuaförlük hizmetleri',
    icon_url: 'cut-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-403',
    name: 'Hayvan Eğitmenleri',
    parent_id: 'category-uuid-4',
    description: 'Evcil hayvan eğitimi ve davranış danışmanlığı',
    icon_url: 'school-outline',
    is_active: true
  },

  // Moda ve Sanat alt kategorileri
  {
    id: 'subcategory-uuid-501',
    name: 'Kişisel Stil Danışmanları',
    parent_id: 'category-uuid-5',
    description: 'Kişisel stil ve imaj danışmanlığı',
    icon_url: 'shirt-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-502',
    name: 'Moda Tasarımcıları',
    parent_id: 'category-uuid-5',
    description: 'Kişiye özel dikim ve tasarım hizmetleri',
    icon_url: 'create-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-503',
    name: 'Fotoğraf Stüdyoları',
    parent_id: 'category-uuid-5',
    description: 'Profesyonel fotoğraf çekimi hizmetleri',
    icon_url: 'camera-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-504',
    name: 'Dövme Stüdyoları',
    parent_id: 'category-uuid-5',
    description: 'Profesyonel dövme ve piercing hizmetleri',
    icon_url: 'color-palette-outline',
    is_active: true
  },

  // Hukuk ve Mali Hizmetler alt kategorileri
  {
    id: 'subcategory-uuid-601',
    name: 'Avukatlar',
    parent_id: 'category-uuid-6',
    description: 'Hukuki danışmanlık ve avukatlık hizmetleri',
    icon_url: 'document-text-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-602',
    name: 'Mali Müşavirler',
    parent_id: 'category-uuid-6',
    description: 'Mali danışmanlık ve muhasebe hizmetleri',
    icon_url: 'calculator-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-603',
    name: 'Emlak Danışmanları',
    parent_id: 'category-uuid-6',
    description: 'Emlak danışmanlığı ve gayrimenkul hizmetleri',
    icon_url: 'home-outline',
    is_active: true
  },

  // Otomotiv alt kategorileri
  {
    id: 'subcategory-uuid-701',
    name: 'Özel Oto Yıkama Hizmetleri',
    parent_id: 'category-uuid-7',
    description: 'Araç temizlik ve bakım hizmetleri',
    icon_url: 'water-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-702',
    name: 'Araç Ekspertiz Firmaları',
    parent_id: 'category-uuid-7',
    description: 'Araç ekspertiz ve değerlendirme hizmetleri',
    icon_url: 'car-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-703',
    name: 'Oto Bakım & Servis',
    parent_id: 'category-uuid-7',
    description: 'Araç bakım, onarım ve servis hizmetleri',
    icon_url: 'build-outline',
    is_active: true
  },

  // Spor ve Rekreasyon alt kategorileri
  {
    id: 'subcategory-uuid-801',
    name: 'Tenis Kortları',
    parent_id: 'category-uuid-8',
    description: 'Tenis kort kiralama ve eğitim hizmetleri',
    icon_url: 'tennisball-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-802',
    name: 'Fitness Merkezleri',
    parent_id: 'category-uuid-8',
    description: 'Kapalı spor salonları ve fitness merkezleri',
    icon_url: 'fitness-outline',
    is_active: true
  },
  {
    id: 'subcategory-uuid-803',
    name: 'Yüzme Havuzları',
    parent_id: 'category-uuid-8',
    description: 'Açık ve kapalı yüzme havuzları',
    icon_url: 'water-outline',
    is_active: true
  }
];

// Ana Kategoriler
export const sampleServiceCategories: ExtendedServiceCategory[] = [
  {
    id: 'category-uuid-1',
    name: 'Sağlık ve Güzellik Sektörü',
    description: 'Sağlık, güzellik ve kişisel bakım hizmetleri',
    icon_url: 'heart-outline',
    is_active: true,
    subcategories: sampleServiceSubcategories.filter(item => item.parent_id === 'category-uuid-1')
  },
  {
    id: 'category-uuid-2',
    name: 'Eğitim ve Danışmanlık',
    description: 'Kişisel ve profesyonel gelişim danışmanlık hizmetleri',
    icon_url: 'school-outline',
    is_active: true,
    subcategories: sampleServiceSubcategories.filter(item => item.parent_id === 'category-uuid-2')
  },
  {
    id: 'category-uuid-3',
    name: 'Ev ve Yaşam Hizmetleri',
    description: 'Ev yaşamını kolaylaştıran hizmetler',
    icon_url: 'home-outline',
    is_active: true,
    subcategories: sampleServiceSubcategories.filter(item => item.parent_id === 'category-uuid-3')
  },
  {
    id: 'category-uuid-4',
    name: 'Evcil Hayvan Hizmetleri',
    description: 'Evcil hayvanlarınız için profesyonel hizmetler',
    icon_url: 'paw-outline',
    is_active: true,
    subcategories: sampleServiceSubcategories.filter(item => item.parent_id === 'category-uuid-4')
  },
  {
    id: 'category-uuid-5',
    name: 'Moda ve Sanat',
    description: 'Kişisel stil, tasarım ve sanat ile ilgili hizmetler',
    icon_url: 'color-palette-outline',
    is_active: true,
    subcategories: sampleServiceSubcategories.filter(item => item.parent_id === 'category-uuid-5')
  },
  {
    id: 'category-uuid-6',
    name: 'Hukuk ve Mali Hizmetler',
    description: 'Hukuki ve finansal danışmanlık hizmetleri',
    icon_url: 'document-text-outline',
    is_active: true,
    subcategories: sampleServiceSubcategories.filter(item => item.parent_id === 'category-uuid-6')
  },
  {
    id: 'category-uuid-7',
    name: 'Otomotiv',
    description: 'Araç bakım ve servis hizmetleri',
    icon_url: 'car-outline',
    is_active: true,
    subcategories: sampleServiceSubcategories.filter(item => item.parent_id === 'category-uuid-7')
  },
  {
    id: 'category-uuid-8',
    name: 'Spor ve Rekreasyon',
    description: 'Spor tesisleri ve rekreasyon alanları',
    icon_url: 'basketball-outline',
    is_active: true,
    subcategories: sampleServiceSubcategories.filter(item => item.parent_id === 'category-uuid-8')
  }
]; 