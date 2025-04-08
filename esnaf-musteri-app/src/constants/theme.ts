// Tema renkleri ve stilleri

export const COLORS = {
  primary: '#2E5A88',       // Ana marka rengi
  secondary: '#FF8E3C',     // İkincil renk (CTA'lar için)
  tertiary: '#F2F7FF',      // Üçüncül renk (arka plan için)
  
  white: '#FFFFFF',
  black: '#000000',
  
  gray10: '#F5F5F5',
  gray20: '#E0E0E0',
  gray30: '#BDBDBD',
  gray40: '#9E9E9E',
  gray50: '#757575',
  gray60: '#616161',
  gray70: '#424242',
  gray80: '#212121',
  
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
};

export const SIZES = {
  // Global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,
  margin: 16,

  // Font sizes
  largeTitle: 40,
  h1: 30,
  h2: 22,
  h3: 18,
  h4: 16,
  h5: 14,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,
};

export const FONTS = {
  largeTitle: { fontSize: SIZES.largeTitle, lineHeight: 55 },
  h1: { fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontSize: SIZES.h3, lineHeight: 22 },
  h4: { fontSize: SIZES.h4, lineHeight: 20 },
  h5: { fontSize: SIZES.h5, lineHeight: 18 },
  body1: { fontSize: SIZES.body1, lineHeight: 36 },
  body2: { fontSize: SIZES.body2, lineHeight: 30 },
  body3: { fontSize: SIZES.body3, lineHeight: 22 },
  body4: { fontSize: SIZES.body4, lineHeight: 20 },
  body5: { fontSize: SIZES.body5, lineHeight: 18 },
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
  dark: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6.27,
    elevation: 10,
  },
};

export default { COLORS, SIZES, FONTS, SHADOWS }; 