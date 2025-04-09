// Uygulama genelinde kullanılacak sabitler

// Renkler
export const COLORS = {
  primary: '#5C6BC0',     // Ana renk
  secondary: '#FF8A65',   // İkincil renk
  success: '#66BB6A',     // Başarı
  error: '#E53935',       // Hata
  warning: '#FFA726',     // Uyarı
  info: '#29B6F6',        // Bilgi
  
  black: '#333333',       // Metin rengi
  darkGray: '#555555',    // Koyu gri
  gray: '#757575',        // Orta gri
  lightGray: '#BBBBBB',   // Açık gri
  
  textDark: '#212121',    // Koyu metin
  textMedium: '#424242',  // Orta koyulukta metin
  textLight: '#757575',   // Açık metin
  
  border: '#EEEEEE',      // Kenarlık rengi
  background: '#F9F9F9',  // Arka plan rengi
  card: '#FFFFFF',        // Kart arka plan rengi
  
  yellow: '#FFC107',      // Yıldız derecelendirme için sarı
  orange: '#FF9800',      // Turuncu vurgu
  
  highlight: '#E3F2FD',   // Vurgulama rengi
  
  // Eksik renkleri ekliyoruz
  dark: '#333333',        // Koyu renk (black ile aynı)
  primaryLight: '#E8EAF6', // Ana rengin açık tonu
  lightBackground: '#F5F5F5', // Açık arka plan rengi
  errorLight: '#FFEBEE',   // Hata renginin açık tonu
};

// Fontlar
export const FONTS = {
  light: 'System',      // Hafif
  regular: 'System',    // Normal
  medium: 'System',     // Orta
  semiBold: 'System',   // Yarı kalın
  bold: 'System',       // Kalın
};

// Metrik değerler - padding, margin, vb.
export const SIZES = {
  // Genel kullanım için boyutlar
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  
  // Özel kenar boşluğu değerleri
  padding: {
    card: 16,
    container: 20,
    page: 16,
  },
  
  // Özel kenarlık yarıçapı değerleri
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    card: 12,
    button: 8,
  },
  
  // Font boyutları
  font: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    title: 22,
    subtitle: 20,
    header: 24,
    largeHeader: 28,
  },
}; 