-- Migration: api_simulasyon_fonksiyonlari
-- Created at: Mon Apr  8 18:49:48 EEST 2025

-- API Entegrasyonları için Simülasyon Fonksiyonları

-- Ödemeler için simülasyon
CREATE OR REPLACE FUNCTION simulate_payment(
  p_amount NUMERIC,
  p_currency TEXT,
  p_appointment_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_payment_id UUID;
BEGIN
  -- Ödeme kaydı oluştur
  INSERT INTO payments (
    appointment_id,
    amount,
    payment_method,
    payment_status
  ) VALUES (
    p_appointment_id,
    p_amount,
    'card',
    'successful'
  ) RETURNING id INTO v_payment_id;
  
  -- Randevu durumunu güncelle
  UPDATE appointments 
  SET status = 'confirmed',
      total_price = p_amount
  WHERE id = p_appointment_id;
  
  -- Simüle edilmiş yanıt döndür
  RETURN jsonb_build_object(
    'success', TRUE,
    'payment_id', v_payment_id,
    'amount', p_amount,
    'currency', p_currency,
    'status', 'successful',
    'transaction_date', NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- İade işlemleri için simülasyon
CREATE OR REPLACE FUNCTION simulate_refund(
  p_payment_id UUID,
  p_amount NUMERIC DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_payment RECORD;
  v_refund_id UUID;
  v_refund_amount NUMERIC;
BEGIN
  -- Ödeme bilgilerini al
  SELECT * INTO v_payment FROM payments WHERE id = p_payment_id;
  
  IF v_payment IS NULL THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', 'Ödeme bulunamadı'
    );
  END IF;
  
  -- İade miktarını belirle
  v_refund_amount := COALESCE(p_amount, v_payment.amount);
  
  -- İade kaydı oluştur
  INSERT INTO refunds (
    payment_id,
    refund_amount,
    reason,
    status
  ) VALUES (
    p_payment_id,
    v_refund_amount,
    'Müşteri isteği',
    'completed'
  ) RETURNING id INTO v_refund_id;
  
  -- İlgili randevuyu iptal et
  UPDATE appointments 
  SET status = 'cancelled'
  WHERE id = v_payment.appointment_id;
  
  -- Simüle edilmiş yanıt döndür
  RETURN jsonb_build_object(
    'success', TRUE,
    'refund_id', v_refund_id,
    'payment_id', p_payment_id,
    'amount', v_refund_amount,
    'status', 'completed',
    'refund_date', NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Push bildirimleri için simülasyon
CREATE OR REPLACE FUNCTION simulate_push_notification(
  p_user_ids UUID[],
  p_title TEXT,
  p_body TEXT,
  p_data JSONB DEFAULT '{}'::JSONB
)
RETURNS JSONB AS $$
DECLARE
  v_notification_ids UUID[] := '{}';
  v_user_id UUID;
  v_notification_id UUID;
BEGIN
  -- Her kullanıcı için bildirim kaydı oluştur (gerçek bir tabloda)
  FOREACH v_user_id IN ARRAY p_user_ids LOOP
    -- Burada gerçek bir bildirim tablosu olsaydı INSERT yapılacaktı
    -- Simülasyon için rastgele UUID üret
    v_notification_id := gen_random_uuid();
    v_notification_ids := v_notification_ids || v_notification_id;
  END LOOP;
  
  -- Simüle edilmiş yanıt döndür
  RETURN jsonb_build_object(
    'success', TRUE,
    'notification_ids', v_notification_ids,
    'sent_count', array_length(p_user_ids, 1),
    'title', p_title,
    'body', p_body,
    'data', p_data,
    'sent_at', NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- E-posta gönderimi için simülasyon
CREATE OR REPLACE FUNCTION simulate_email(
  p_email TEXT,
  p_subject TEXT,
  p_content TEXT
)
RETURNS JSONB AS $$
BEGIN
  -- Simüle edilmiş yanıt döndür
  RETURN jsonb_build_object(
    'success', TRUE,
    'email', p_email,
    'subject', p_subject,
    'content_length', length(p_content),
    'sent_at', NOW(),
    'message_id', concat('<', gen_random_uuid(), '@esnafapp.com>')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- SMS gönderimi için simülasyon
CREATE OR REPLACE FUNCTION simulate_sms(
  p_phone TEXT,
  p_message TEXT
)
RETURNS JSONB AS $$
BEGIN
  -- Simüle edilmiş yanıt döndür
  RETURN jsonb_build_object(
    'success', TRUE,
    'phone', p_phone,
    'message_length', length(p_message),
    'sent_at', NOW(),
    'message_id', (random() * 1000000)::INTEGER
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
