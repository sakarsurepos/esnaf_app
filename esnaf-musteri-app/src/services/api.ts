/**
 * API Entegrasyonları
 * 
 * Bu dosya, harici API'lar ile entegrasyonları içerir.
 */

import { GOOGLE_MAPS_API_KEY } from '@env';
import { supabase } from './supabase';

/**
 * Google Maps API istekleri için sarmalayıcı fonksiyonlar
 */
export const GoogleMapsAPI = {
  /**
   * Adres arama (geocoding) işlemi
   * @param address Aranacak adres
   * @returns 
   */
  geocode: async (address: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
          formattedAddress: data.results[0].formatted_address
        };
      }
      return null;
    } catch (error) {
      console.error('Google Maps API error:', error);
      return null;
    }
  },
  
  /**
   * Mesafe hesaplama
   * @param origin Başlangıç konumu (lat,lng)
   * @param destination Hedef konum (lat,lng)
   * @param mode Ulaşım modu (driving, walking, bicycling, transit)
   * @returns 
   */
  getDistance: async (origin: string, destination: string, mode: string = 'driving') => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&mode=${mode}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.rows.length > 0 && data.rows[0].elements.length > 0) {
        const element = data.rows[0].elements[0];
        if (element.status === 'OK') {
          return {
            distance: element.distance.text,
            duration: element.duration.text,
            distanceValue: element.distance.value, // metre cinsinden
            durationValue: element.duration.value  // saniye cinsinden
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Google Maps Distance Matrix API error:', error);
      return null;
    }
  },
  
  /**
   * Yakındaki yerler araması
   * @param location Konum (lat,lng)
   * @param radius Yarıçap (metre)
   * @param type Yer tipi (restaurant, cafe, vb.)
   * @returns 
   */
  nearbySearch: async (location: string, radius: number, type: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${encodeURIComponent(location)}&radius=${radius}&type=${type}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        return data.results.map((place: any) => ({
          id: place.place_id,
          name: place.name,
          address: place.vicinity,
          location: place.geometry.location,
          rating: place.rating,
          types: place.types
        }));
      }
      return [];
    } catch (error) {
      console.error('Google Maps Places API error:', error);
      return [];
    }
  }
};

/**
 * Ödeme işlemleri için API
 */
export const PaymentAPI = {
  /**
   * Ödeme işlemini başlat
   * @param amount Ödeme tutarı
   * @param currency Para birimi
   * @param appointmentId Randevu ID
   * @returns 
   */
  initiatePayment: async (amount: number, currency: string, appointmentId: string) => {
    try {
      // Bu kısımda gerçek bir ödeme sağlayıcısı entegrasyonu olacak (örn. iyzico, stripe)
      // Şu an için basit bir Supabase RPC çağrısı ile simüle ediyoruz
      const { data, error } = await supabase.rpc('simulate_payment', {
        p_amount: amount,
        p_currency: currency,
        p_appointment_id: appointmentId
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Payment API error:', error);
      return { success: false, error: 'Ödeme işlemi başarısız' };
    }
  },
  
  /**
   * Ödeme iptal/iade işlemi
   * @param paymentId Ödeme ID
   * @param amount İade edilecek miktar (kısmi iade için)
   * @returns 
   */
  refundPayment: async (paymentId: string, amount?: number) => {
    try {
      // Gerçek bir ödeme sağlayıcısı entegrasyonu burada olacak
      const { data, error } = await supabase.rpc('simulate_refund', {
        p_payment_id: paymentId,
        p_amount: amount
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Refund API error:', error);
      return { success: false, error: 'İade işlemi başarısız' };
    }
  }
};

/**
 * Bildirim servisi API
 */
export const NotificationAPI = {
  /**
   * Push bildirimi gönder
   * @param userIds Bildirim gönderilecek kullanıcı ID'leri
   * @param title Bildirim başlığı
   * @param body Bildirim içeriği
   * @param data Ek veri
   * @returns 
   */
  sendPushNotification: async (userIds: string[], title: string, body: string, data: any = {}) => {
    try {
      // Gerçek bir push notification servisi entegrasyonu burada olacak (örn. Firebase, Expo)
      const { data: result, error } = await supabase.rpc('simulate_push_notification', {
        p_user_ids: userIds,
        p_title: title,
        p_body: body,
        p_data: data
      });
      
      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Push Notification API error:', error);
      return { success: false, error: 'Bildirim gönderilemedi' };
    }
  },
  
  /**
   * E-posta bildirimi gönder
   * @param email E-posta adresi
   * @param subject Konu
   * @param content İçerik (HTML formatında olabilir)
   * @returns 
   */
  sendEmail: async (email: string, subject: string, content: string) => {
    try {
      // Gerçek bir e-posta servisi entegrasyonu burada olacak (örn. SendGrid, Mailgun)
      const { data, error } = await supabase.rpc('simulate_email', {
        p_email: email,
        p_subject: subject,
        p_content: content
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Email API error:', error);
      return { success: false, error: 'E-posta gönderilemedi' };
    }
  },
  
  /**
   * SMS bildirimi gönder
   * @param phone Telefon numarası
   * @param message Mesaj
   * @returns 
   */
  sendSMS: async (phone: string, message: string) => {
    try {
      // Gerçek bir SMS servisi entegrasyonu burada olacak (örn. Twilio, Netgsm)
      const { data, error } = await supabase.rpc('simulate_sms', {
        p_phone: phone,
        p_message: message
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('SMS API error:', error);
      return { success: false, error: 'SMS gönderilemedi' };
    }
  }
}; 