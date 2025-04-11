import supabase from './supabase';
import { samplePaymentMethods } from '../models';

/**
 * Kullanıcıya ait ödeme yöntemlerini getiren fonksiyon
 * @param userId Kullanıcı ID'si
 * @returns Ödeme yöntemleri listesi
 */
export const getPaymentMethods = async (userId: string) => {
  // Geliştirme aşamasında örnek veriler kullanılabilir
  if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_DATA === 'true') {
    const userPaymentMethods = samplePaymentMethods.filter(method => method.user_id === userId);
    return userPaymentMethods;
  }
  
  // Gerçek implementasyon
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', userId);
    
  if (error) {
    console.error('Ödeme yöntemleri getirilirken hata:', error);
    throw new Error('Ödeme yöntemleri yüklenirken bir sorun oluştu');
  }
  
  return data || [];
};

/**
 * Yeni bir ödeme yöntemi ekleyen fonksiyon
 * @param userId Kullanıcı ID'si
 * @param paymentMethodData Ödeme yöntemi bilgileri
 * @returns Eklenen ödeme yöntemi
 */
export const addPaymentMethod = async (userId: string, paymentMethodData: {
  card_type: string;
  last_digits: string;
  expires_at: string;
  name: string;
  is_default?: boolean;
}) => {
  // Geliştirme aşamasında
  if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_DATA === 'true') {
    const newPaymentMethod = {
      id: `pm-${Date.now()}`,
      user_id: userId,
      ...paymentMethodData,
      is_default: paymentMethodData.is_default || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Eğer bu yeni yöntem varsayılan olarak ayarlandıysa, diğerlerinin varsayılan değerini kaldır
    if (newPaymentMethod.is_default) {
      samplePaymentMethods.forEach(method => {
        if (method.user_id === userId && method.id !== newPaymentMethod.id) {
          method.is_default = false;
        }
      });
    }
    
    samplePaymentMethods.push(newPaymentMethod);
    return newPaymentMethod;
  }
  
  // Gerçek implementasyon
  // Eğer yeni yöntem varsayılan olarak ayarlandıysa, diğerlerinin varsayılan değerini kaldır
  if (paymentMethodData.is_default) {
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId);
  }
  
  const { data, error } = await supabase
    .from('payment_methods')
    .insert([
      {
        user_id: userId,
        ...paymentMethodData
      }
    ])
    .select();
    
  if (error) {
    console.error('Ödeme yöntemi eklenirken hata:', error);
    throw new Error('Ödeme yöntemi eklenirken bir sorun oluştu');
  }
  
  return data?.[0] || null;
};

/**
 * Ödeme işlemini gerçekleştiren fonksiyon
 * @param paymentMethodId Ödeme yöntemi ID'si
 * @param amount Ödeme tutarı
 * @returns İşlem başarılı mı
 */
export const processPayment = async (paymentMethodId: string, amount: number): Promise<boolean> => {
  // Geliştirme aşamasında her zaman başarılı döndürebiliriz
  if (process.env.NODE_ENV === 'development') {
    // Gerçek bir ödeme API'si entegrasyonu burada yapılacak
    // Şimdilik başarılı kabul ediyoruz
    console.log(`Ödeme işlemi simüle ediliyor: ${amount} TL, Ödeme Yöntemi: ${paymentMethodId}`);
    return true;
  }
  
  try {
    // Gerçek ödeme işlemi burada gerçekleştirilecek
    // Örnek: Iyzico, Stripe, PayTR vb. bir ödeme işlemcisi API'si kullanılabilir
    
    // Başarılı ödeme işlemi simüle ediliyor
    return true;
  } catch (error) {
    console.error('Ödeme işlemi sırasında hata:', error);
    throw new Error('Ödeme işlemi sırasında bir sorun oluştu');
  }
};

/**
 * Ödeme yöntemini silen fonksiyon
 * @param paymentMethodId Ödeme yöntemi ID'si
 * @returns İşlem başarılı mı
 */
export const deletePaymentMethod = async (paymentMethodId: string): Promise<boolean> => {
  // Geliştirme aşamasında
  if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_DATA === 'true') {
    const index = samplePaymentMethods.findIndex(method => method.id === paymentMethodId);
    if (index !== -1) {
      samplePaymentMethods.splice(index, 1);
      return true;
    }
    return false;
  }
  
  // Gerçek implementasyon
  const { error } = await supabase
    .from('payment_methods')
    .delete()
    .eq('id', paymentMethodId);
    
  if (error) {
    console.error('Ödeme yöntemi silinirken hata:', error);
    throw new Error('Ödeme yöntemi silinirken bir sorun oluştu');
  }
  
  return true;
};

/**
 * Ödeme yöntemini varsayılan olarak ayarlayan fonksiyon
 * @param userId Kullanıcı ID'si
 * @param paymentMethodId Ödeme yöntemi ID'si
 * @returns İşlem başarılı mı
 */
export const setDefaultPaymentMethod = async (userId: string, paymentMethodId: string): Promise<boolean> => {
  // Geliştirme aşamasında
  if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_DATA === 'true') {
    samplePaymentMethods.forEach(method => {
      if (method.user_id === userId) {
        method.is_default = method.id === paymentMethodId;
      }
    });
    return true;
  }
  
  // Gerçek implementasyon
  // Önce tüm ödeme yöntemlerinin varsayılan değerini kaldır
  await supabase
    .from('payment_methods')
    .update({ is_default: false })
    .eq('user_id', userId);
  
  // Seçilen ödeme yöntemini varsayılan olarak ayarla
  const { error } = await supabase
    .from('payment_methods')
    .update({ is_default: true })
    .eq('id', paymentMethodId);
    
  if (error) {
    console.error('Varsayılan ödeme yöntemi ayarlanırken hata:', error);
    throw new Error('Varsayılan ödeme yöntemi ayarlanırken bir sorun oluştu');
  }
  
  return true;
}; 