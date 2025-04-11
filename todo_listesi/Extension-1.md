🧭 GENEL İŞ AKIŞI KURALLARI
🎯 Amaç:

Kullanıcının hizmet rezervasyonu, randevu oluşturması ve ödeme yapabilmesi için esnek ve işletme kontrolünde bir yapı sağlamak.
1️⃣ İŞ AKIŞ TİPLERİ ✅
İş Akışı	Açıklama
service_purchase_flow	Kullanıcı önceden paket/tekil hizmet satın alır, daha sonra randevu oluşturur
direct_booking_flow	Kullanıcı doğrudan randevu alır, ödeme randevu öncesi ya da sonrasında yapılır
2️⃣ İŞLETMEYE AİT KONTROL KURALLARI ✅

Her hizmet veya işletme, aşağıdaki kuralları tanımlar:

{
  payment_policy: 'free_booking' | 'deposit_required' | 'full_payment_required',
  deposit_rate: number, // Örnek: 0.3 => %30
  allow_package_use: boolean,    // Önceden alınan hizmet kullanılabilir mi?
  allow_walkin_payment: boolean, // Salonda ödeme yapılabilir mi?
  cancellation_policy: {
    refundable_until_hours: number,  // İptal/iade hakkı kaç saat kala biter?
    charge_on_noshow: boolean        // Gelmeyene ceza uygulanır mı?
  }
}

3️⃣ RANDEVU OLUŞTURMA KURALLARI ✅

    Kullanıcı sistemde oturum açmış olmalı

    Randevu almak için:

        Uygun saat & personel seçilmeli

        Gerekli ödeme yapılmalı (politika kontrol edilir)

        Paket hakkı varsa kullanılabilir

function canCreateReservation(user, service, businessSettings) {
  if (businessSettings.payment_policy === 'free_booking') return true;

  if (businessSettings.payment_policy === 'deposit_required') {
    return userHasPaidDeposit();
  }

  if (businessSettings.payment_policy === 'full_payment_required') {
    return userHasPaidFullAmount();
  }

  return false;
}

4️⃣ CHECK-IN KURALLARI ✅

Kullanıcı randevu günü geldiğinde:

    Check-in yapılmadan hizmet başlatılamaz

    Sistem check-in sırasında şunu kontrol eder:

        Ödeme tamamlanmış mı?

        Paket hakkı var mı?

        Ödeme eksikse, salon POS ekranı açılır

function canCheckIn(reservation) {
  if (reservation.payment_status === 'paid') return true;
  if (reservation.payment_status === 'partially_paid') return true;
  if (reservation.paid_with_package) return true;
  return false;
}

5️⃣ ÖDEME KURALLARI ✅

Ödeme 3 farklı aşamada olabilir:
Aşama	İzin Verilir mi?	Açıklama
Randevu Anı	✅ Opsiyonel	Tam ödeme veya depozito alınabilir
Check-in	✅ Opsiyonel	Hizmet başlamadan önce ödeme istenebilir
Check-out	✅ Opsiyonel	Hizmet sonunda ödeme alınabilir

    Kullanıcı ödeme yaparken daha önce aldığı hizmeti seçebilir, varsa ödeme düşer.

6️⃣ PAKET HİZMET KULLANIMI ✅

    Kullanıcının aktif paketi varsa:

        Randevu sırasında sistem bunu teklif eder

        Kullanım hakkı randevuya bağlanır ve kalan haklar güncellenir

7️⃣ İPTAL & NO-SHOW KURALLARI ✅

    Randevu, işletmenin belirttiği saatten önce iptal edilirse:

        Ücret iade edilir (depozito veya tam ödeme)

    Randevu iptal edilmezse ve kullanıcı gelmezse:

        No-show olarak işaretlenir

        Ceza uygulanabilir (paket hakkı düşer veya ücret iadesi yapılmaz)

🔐 SİSTEMSEL KURALLARIN ÖZETİ ✅
Kural	Açıklama
payment_policy	Rezervasyon anında ödeme zorunluluğu
deposit_rate	Depozito oranı
allow_package_use	Kullanıcı daha önce aldığı hizmeti kullanabilir mi
allow_walkin_payment	Salonda ödeme yapılabilir mi
refundable_until_hours	Ücretsiz iptal için zaman sınırı
charge_on_noshow	Gelmeyene ceza