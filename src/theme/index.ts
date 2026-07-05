import { ViewStyle } from 'react-native';

export const colors = {
  background: '#000000',
  surface: '#F5F5F5',
  surfaceAlt: '#E8E8E8',
  card: '#F5F5F5',
  cardText: '#1C1814',
  cardTextSecondary: '#7A7268',
  cardTextTertiary: '#B0A89B',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  textTertiary: '#666666',
  accent: '#FFFFFF',
  accentSecondary: '#CCCCCC',
  onAccent: '#000000',
  border: '#E0DDD7',
  borderLight: '#E8E8E8',
  white: '#FFFFFF',
  black: '#000000',
  success: '#4CAF50',
  error: '#EF5350',
  warning: '#FFD54F',
  overlay: 'rgba(0,0,0,0.6)',
  barberColors: ['#E8A87C', '#85A085', '#B5B59C', '#D4A88B'],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  massive: 64,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 56,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
};

export const fonts = {
  display: 'Gramatika-Bold',
  displayRegular: 'Gramatika-Regular',
  body: 'Geometria-Medium',
  bodyLight: 'Geometria-Light',
};

export const cardShadow: ViewStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 4,
};
