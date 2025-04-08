import * as yup from 'yup';

// Giriş şeması
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('E-posta adresi gereklidir')
    .email('Geçerli bir e-posta adresi giriniz'),
  password: yup
    .string()
    .required('Şifre gereklidir')
    .min(6, 'Şifre en az 6 karakter olmalıdır'),
});

// Kayıt şeması
export const registerSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('Ad gereklidir')
    .min(2, 'Ad en az 2 karakter olmalıdır'),
  lastName: yup
    .string()
    .required('Soyad gereklidir')
    .min(2, 'Soyad en az 2 karakter olmalıdır'),
  email: yup
    .string()
    .required('E-posta adresi gereklidir')
    .email('Geçerli bir e-posta adresi giriniz'),
  phone: yup
    .string()
    .required('Telefon numarası gereklidir')
    .matches(/^[0-9]{10}$/, 'Geçerli bir telefon numarası giriniz (10 haneli, başında 0 olmadan)'),
  password: yup
    .string()
    .required('Şifre gereklidir')
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
      'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir'
    ),
  confirmPassword: yup
    .string()
    .required('Şifre onayı gereklidir')
    .oneOf([yup.ref('password')], 'Şifreler eşleşmiyor'),
  acceptTerms: yup
    .boolean()
    .oneOf([true], 'Kullanım koşullarını kabul etmelisiniz'),
});

// Şifre sıfırlama şeması
export const resetPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required('E-posta adresi gereklidir')
    .email('Geçerli bir e-posta adresi giriniz'),
});

// Şifre yenileme şeması
export const updatePasswordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required('Mevcut şifre gereklidir'),
  newPassword: yup
    .string()
    .required('Yeni şifre gereklidir')
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
      'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir'
    ),
  confirmNewPassword: yup
    .string()
    .required('Şifre onayı gereklidir')
    .oneOf([yup.ref('newPassword')], 'Şifreler eşleşmiyor'),
});

// Profil güncelleme şeması
export const updateProfileSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('Ad gereklidir')
    .min(2, 'Ad en az 2 karakter olmalıdır'),
  lastName: yup
    .string()
    .required('Soyad gereklidir')
    .min(2, 'Soyad en az 2 karakter olmalıdır'),
  phone: yup
    .string()
    .required('Telefon numarası gereklidir')
    .matches(/^[0-9]{10}$/, 'Geçerli bir telefon numarası giriniz (10 haneli, başında 0 olmadan)'),
}); 