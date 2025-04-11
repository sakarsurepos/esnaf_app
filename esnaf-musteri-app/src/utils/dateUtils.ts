/**
 * Tarih işlemleri için yardımcı fonksiyonlar
 */

/**
 * ISO 8601 formatındaki tarihi okunabilir formata çevirir
 * @param isoDate ISO 8601 formatında tarih string'i
 * @returns Gün/Ay/Yıl formatında tarih string'i
 */
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * ISO 8601 formatındaki tarihi gün, ay, yıl bilgileriyle formatlar ve döndürür
 * @param isoDate ISO 8601 formatında tarih string'i
 * @returns Gün Ay Yıl formatında tarih string'i (ör: 15 Ocak 2023)
 */
export const formatDateLong = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * ISO 8601 formatındaki tarihi saat ve dakika bilgisiyle formatlar
 * @param isoDate ISO 8601 formatında tarih string'i
 * @returns Gün Ay Yıl, Saat:Dakika formatında tarih string'i (ör: 15 Ocak 2023, 14:30)
 */
export const formatDateTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * İki tarih arasındaki farkı gün olarak hesaplar
 * @param startDate Başlangıç tarihi (ISO 8601 formatında)
 * @param endDate Bitiş tarihi (ISO 8601 formatında)
 * @returns Gün farkı
 */
export const daysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Tarihin bugün, dün veya gelecek tarih olarak durumunu döndürür
 * @param isoDate ISO 8601 formatında tarih string'i
 * @returns "bugün", "dün" veya tarih formatında string
 */
export const getRelativeDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const today = new Date();
  
  if (date.toDateString() === today.toDateString()) {
    return 'Bugün';
  }
  
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Dün';
  }
  
  return formatDate(isoDate);
}; 