-- Migration: supabase_fonksiyonlari
-- Created at: Mon Apr  8 18:46:46 EEST 2025

-- Faydalı Supabase Fonksiyonları

-- Kullanıcının Rollerini Alma
CREATE OR REPLACE FUNCTION get_user_roles(user_id UUID DEFAULT auth.uid())
RETURNS TABLE(role_name TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT r.name 
  FROM roles r
  JOIN user_roles ur ON r.id = ur.role_id
  WHERE ur.user_id = get_user_roles.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Kullanıcının İşletme Sahibi Olup Olmadığını Kontrol Etme
CREATE OR REPLACE FUNCTION is_business_owner(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
DECLARE
  owner_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO owner_count
  FROM user_roles ur
  JOIN roles r ON ur.role_id = r.id
  WHERE ur.user_id = is_business_owner.user_id AND r.name = 'business_owner';
  
  RETURN owner_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Kullanıcının Admin Olup Olmadığını Kontrol Etme
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
DECLARE
  admin_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO admin_count
  FROM user_roles ur
  JOIN roles r ON ur.role_id = r.id
  WHERE ur.user_id = is_admin.user_id AND r.name = 'admin';
  
  RETURN admin_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Yakındaki İşletmeleri Bulma (Coğrafi Sorgulama)
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;

CREATE OR REPLACE FUNCTION find_nearby_businesses(
  lat DOUBLE PRECISION,
  long DOUBLE PRECISION,
  max_distance_km DOUBLE PRECISION DEFAULT 5.0
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  description TEXT,
  distance_km DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.name,
    b.description,
    (point(b.longitude, b.latitude) <@> point(long, lat)) AS distance_km
  FROM branches b
  JOIN businesses bus ON b.business_id = bus.id
  WHERE 
    bus.is_active = true 
    AND bus.approval_status = 'approved'
    AND (point(b.longitude, b.latitude) <@> point(long, lat)) <= max_distance_km
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- İşletmeler İçin Kullanılabilir Randevu Saatlerini Bulma
CREATE OR REPLACE FUNCTION get_available_appointment_slots(
  business_id UUID,
  branch_id UUID,
  staff_id UUID,
  service_id UUID,
  appointment_date DATE
)
RETURNS TABLE(
  start_time TIMESTAMP,
  end_time TIMESTAMP
) AS $$
DECLARE
  service_duration INTEGER;
  working_start TIME := '09:00:00'::TIME;
  working_end TIME := '18:00:00'::TIME;
  lunch_start TIME := '12:00:00'::TIME;
  lunch_end TIME := '13:00:00'::TIME;
  slot_interval INTEGER := 30; -- 30 dakikalık slotlar
  current_slot TIMESTAMP;
  is_available BOOLEAN;
BEGIN
  -- Servis süresini al
  SELECT COALESCE(duration_minutes, 60) INTO service_duration
  FROM services
  WHERE id = service_id;
  
  -- Gün boyunca tüm slotları kontrol et
  current_slot := (appointment_date + working_start);
  
  WHILE (current_slot + (service_duration || ' minutes')::INTERVAL)::TIME <= working_end LOOP
    is_available := TRUE;
    
    -- Öğle molası kontrolü
    IF (current_slot::TIME >= lunch_start AND current_slot::TIME < lunch_end) OR
       ((current_slot + (service_duration || ' minutes')::INTERVAL)::TIME > lunch_start AND
        current_slot::TIME < lunch_end) THEN
      is_available := FALSE;
    END IF;
    
    -- Mevcut randevularla çakışma kontrolü
    IF is_available THEN
      is_available := NOT EXISTS (
        SELECT 1
        FROM appointments a
        WHERE 
          a.business_id = get_available_appointment_slots.business_id
          AND (a.branch_id = get_available_appointment_slots.branch_id OR get_available_appointment_slots.branch_id IS NULL)
          AND (a.staff_id = get_available_appointment_slots.staff_id OR get_available_appointment_slots.staff_id IS NULL)
          AND a.status NOT IN ('cancelled')
          AND tsrange(
            a.appointment_time, 
            a.appointment_time + (service_duration || ' minutes')::INTERVAL
          ) && tsrange(
            current_slot, 
            current_slot + (service_duration || ' minutes')::INTERVAL
          )
      );
    END IF;
    
    -- Personel bloke tarihleri kontrolü
    IF is_available AND staff_id IS NOT NULL THEN
      is_available := NOT EXISTS (
        SELECT 1
        FROM blocked_dates bd
        WHERE 
          bd.staff_id = get_available_appointment_slots.staff_id
          AND bd.date = appointment_date
      );
    END IF;
    
    -- Eğer slot müsaitse listeye ekle
    IF is_available THEN
      start_time := current_slot;
      end_time := current_slot + (service_duration || ' minutes')::INTERVAL;
      RETURN NEXT;
    END IF;
    
    -- Sonraki slota geç
    current_slot := current_slot + (slot_interval || ' minutes')::INTERVAL;
  END LOOP;
  
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- İşletme Performans Özeti
CREATE OR REPLACE FUNCTION business_performance_summary(business_id UUID)
RETURNS TABLE(
  total_appointments INTEGER,
  completed_appointments INTEGER,
  cancelled_appointments INTEGER,
  total_revenue NUMERIC,
  avg_service_price NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(a.id)::INTEGER AS total_appointments,
    COUNT(a.id) FILTER (WHERE a.status = 'completed')::INTEGER AS completed_appointments,
    COUNT(a.id) FILTER (WHERE a.status = 'cancelled')::INTEGER AS cancelled_appointments,
    SUM(p.amount) FILTER (WHERE p.payment_status = 'successful')::NUMERIC AS total_revenue,
    AVG(s.price)::NUMERIC AS avg_service_price
  FROM
    appointments a
    LEFT JOIN payments p ON a.id = p.appointment_id
    JOIN services s ON a.service_id = s.id
  WHERE
    a.business_id = business_performance_summary.business_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- İşletmenin Randevu İstatistikleri
CREATE OR REPLACE FUNCTION business_appointment_stats(
  business_id UUID,
  start_date DATE DEFAULT (CURRENT_DATE - INTERVAL '30 days')::DATE,
  end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
  date DATE,
  appointment_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH date_range AS (
    SELECT generate_series(start_date, end_date, '1 day'::INTERVAL)::DATE AS date
  )
  SELECT
    dr.date,
    COALESCE(COUNT(a.id), 0)::INTEGER AS appointment_count
  FROM
    date_range dr
    LEFT JOIN appointments a ON dr.date = (a.appointment_time::DATE)
      AND a.business_id = business_appointment_stats.business_id
  GROUP BY
    dr.date
  ORDER BY
    dr.date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- İşletmenin En Popüler Servisleri
CREATE OR REPLACE FUNCTION most_popular_services(
  business_id UUID,
  limit_count INTEGER DEFAULT 5
)
RETURNS TABLE(
  service_id UUID,
  service_title TEXT,
  appointment_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id AS service_id,
    s.title AS service_title,
    COUNT(a.id)::INTEGER AS appointment_count
  FROM
    services s
    LEFT JOIN appointments a ON s.id = a.service_id AND a.status != 'cancelled'
  WHERE
    s.business_id = most_popular_services.business_id
  GROUP BY
    s.id, s.title
  ORDER BY
    appointment_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
