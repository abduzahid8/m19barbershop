import { Dimensions, ViewStyle } from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');
const BASE_WIDTH = 402;

export const rs = (size: number) => Math.round(size * (SCREEN_W / BASE_WIDTH));

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
  barberColors: ['#E8A87C', '#85A085', '#B5B59C', '#D4A88B', '#A8B8C8', '#C8A8B8'],
};

export const spacing = {
  xs: rs(4),
  sm: rs(8),
  md: rs(12),
  lg: rs(16),
  xl: rs(20),
  xxl: rs(24),
  xxxl: rs(32),
  huge: rs(48),
  massive: rs(64),
};

export const fontSize = {
  xs: rs(11),
  sm: rs(13),
  md: rs(15),
  lg: rs(17),
  xl: rs(20),
  xxl: rs(24),
  xxxl: rs(32),
  huge: rs(40),
  massive: rs(56),
};

export const borderRadius = {
  sm: rs(6),
  md: rs(10),
  lg: rs(14),
  xl: rs(20),
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
