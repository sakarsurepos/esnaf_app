-- Hizmetler, paketler ve kullanım hakları için tablolar

-- Tekil hizmetler tablosu
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  category_id UUID REFERENCES public.service_categories(id),
  business_id UUID REFERENCES public.businesses(id),
  is_active BOOLEAN DEFAULT TRUE,
  payment_policy TEXT DEFAULT 'free_booking', -- free_booking, deposit_required, full_payment_required
  deposit_amount DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Servis paketleri tablosu
CREATE TABLE IF NOT EXISTS public.service_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  business_id UUID REFERENCES public.businesses(id),
  price DECIMAL(10, 2) NOT NULL,
  validity_period INTEGER NOT NULL, -- gün cinsinden
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Paket içindeki hizmetler tablosu (çoka-çok ilişki)
CREATE TABLE IF NOT EXISTS public.service_package_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID REFERENCES public.service_packages(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  usage_limit INTEGER NOT NULL, -- -1 = sınırsız
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(package_id, service_id)
);

-- Üyelik planları tablosu
CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  business_id UUID REFERENCES public.businesses(id),
  price DECIMAL(10, 2) NOT NULL,
  duration INTEGER NOT NULL, -- ay cinsinden
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Üyelik içindeki paketler tablosu (çoka-çok ilişki)
CREATE TABLE IF NOT EXISTS public.membership_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  membership_id UUID REFERENCES public.memberships(id) ON DELETE CASCADE,
  package_id UUID REFERENCES public.service_packages(id) ON DELETE CASCADE,
  multiplier INTEGER NOT NULL DEFAULT 1, -- paket kaç kez kullanılabilir
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(membership_id, package_id)
);

-- Kullanıcı satın alımları tablosu
CREATE TABLE IF NOT EXISTS public.user_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('service', 'package', 'membership')),
  reference_id UUID NOT NULL, -- ilgili hizmet, paket veya üyelik ID'si
  remaining_usage INTEGER NOT NULL DEFAULT 1, -- kalan kullanım hakkı (-1 = sınırsız)
  is_active BOOLEAN DEFAULT TRUE,
  payment_method_id UUID REFERENCES public.payment_methods(id),
  total_paid DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kullanım kaydı tablosu
CREATE TABLE IF NOT EXISTS public.usage_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  purchase_id UUID REFERENCES public.user_purchases(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id),
  usage_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  appointment_id UUID REFERENCES public.appointments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mevcut randevular tablosuna yeni alanlar ekle
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS payment_type TEXT DEFAULT 'direct';
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS used_package_id UUID REFERENCES public.user_purchases(id);
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'cancelled'));

-- RLS politikaları
ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_package_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_records ENABLE ROW LEVEL SECURITY;

-- Herkes aktif paketleri görebilir
CREATE POLICY "Herkes aktif paketleri görebilir" ON public.service_packages
  FOR SELECT USING (is_active = TRUE);

-- İşletme sahipleri kendi paketlerini yönetebilir
CREATE POLICY "İşletme sahipleri kendi paketlerini yönetebilir" ON public.service_packages
  USING (business_id IN (
    SELECT business_id FROM public.business_staff_roles
    WHERE user_id = auth.uid() AND role = 'owner'
  ));

-- Kullanıcılar kendi satın alımlarını görebilir
CREATE POLICY "Kullanıcılar kendi satın alımlarını görebilir" ON public.user_purchases
  FOR SELECT USING (user_id = auth.uid());

-- Kullanıcılar kendi kullanım kayıtlarını görebilir
CREATE POLICY "Kullanıcılar kendi kullanım kayıtlarını görebilir" ON public.usage_records
  FOR SELECT USING (user_id = auth.uid());

-- İşletme sahipleri kendi işletmelerindeki kullanım kayıtlarını görebilir
CREATE POLICY "İşletme sahipleri kendi işletmelerindeki kullanım kayıtlarını görebilir" ON public.usage_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.services s
      JOIN public.business_staff_roles bsr ON s.business_id = bsr.business_id
      WHERE s.id = service_id AND bsr.user_id = auth.uid() AND bsr.role IN ('owner', 'manager')
    )
  );

-- Fonksiyonlar
-- Yeni bir kullanıcı satın alımı oluşturan fonksiyon
CREATE OR REPLACE FUNCTION create_user_purchase(
  p_user_id UUID,
  p_type TEXT,
  p_reference_id UUID,
  p_payment_method_id UUID,
  p_total_paid DECIMAL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_expiry_date TIMESTAMP WITH TIME ZONE;
  v_remaining_usage INTEGER;
  v_purchase_id UUID;
BEGIN
  -- Satın alma tipine göre son kullanma tarihi ve kullanım hakkı hesapla
  IF p_type = 'service' THEN
    -- Tekil hizmet satın alımı
    SELECT NOW() + INTERVAL '1 year' INTO v_expiry_date;
    v_remaining_usage := 1;
  ELSIF p_type = 'package' THEN
    -- Paket satın alımı
    SELECT NOW() + (validity_period * INTERVAL '1 day') INTO v_expiry_date
    FROM public.service_packages
    WHERE id = p_reference_id;
    
    -- Pakette toplam kaç hizmet var
    SELECT COUNT(*) INTO v_remaining_usage
    FROM public.service_package_services
    WHERE package_id = p_reference_id;
  ELSIF p_type = 'membership' THEN
    -- Üyelik satın alımı
    SELECT NOW() + (duration * INTERVAL '1 month') INTO v_expiry_date
    FROM public.memberships
    WHERE id = p_reference_id;
    
    v_remaining_usage := 1; -- Üyelik için 1 kullanım (paketler içinde kullanım hakları var)
  END IF;

  -- Satın alma kaydını oluştur
  INSERT INTO public.user_purchases (
    user_id,
    purchase_date,
    expiry_date,
    type,
    reference_id,
    remaining_usage,
    is_active,
    payment_method_id,
    total_paid
  ) VALUES (
    p_user_id,
    NOW(),
    v_expiry_date,
    p_type,
    p_reference_id,
    v_remaining_usage,
    TRUE,
    p_payment_method_id,
    p_total_paid
  ) RETURNING id INTO v_purchase_id;
  
  RETURN v_purchase_id;
END;
$$; 