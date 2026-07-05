const SHADOW_COLOR = '#000000';

export const colors = {
  primary: '#1AFFD5',
  primaryGradient: ['#1AFFD5', '#08CDC5', '#00B7BF'],
  buttonPrimary: '#102852',
  buttonTextPrimary: '#FFFFFF',
  dark: '#15211F',

  background: '#EAF0F8',
  surface: '#F5F5F5',
  surfaceLight: '#F5F7FA',
  bgCard: '#FFFFFF',
  bgElevated: '#F0F4FF',
  bgInput: '#EDF2F7',
  bgModal: '#FFFFFF',
  bgGlass: 'rgba(255, 255, 255, 0.75)',
  bgGlassLight: 'rgba(255, 255, 255, 0.4)',

  text: '#08132A',
  textSecondary: '#666666',
  textMuted: '#999999',
  textLight: '#444444',
  textInverse: '#FFFFFF',
  iconMuted: '#A0A0A0',

  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  link: '#007AFF',
  accent: '#00FFC2',

  white: '#FFFFFF',
  black: '#000000',
  border: '#D0D5DD',
  borderLight: '#E2E8F0',

  nav: {
    inactive: '#C7CCE1',
    active: '#262A44',
    floatingBg: 'rgba(255, 255, 255, 0.45)',
    floatingBorder: 'rgba(255, 255, 255, 0.8)',
    floatingBorderBottom: 'rgba(255, 255, 255, 0.3)',
  },

  statCard: {
    blue: '#8CDEFF',
    blueDark: '#78BAFF',
    purple: '#F4C0FD',
    purpleDark: '#E2D6F8',
  },

  weeklyPlan: {
    theoryBg: '#8CDEFF',
    practiceBg: '#78BAFF',
    analysisBg: '#F4C0FD',
    tasksBg: '#F9A9FD',
    addTaskBg: '#D3DEEE',
    iconBg: '#08132A',
  },

  warningModal: {
    surface: '#FFFFFF',
    confirmDefault: '#E8E4DF',
  },

  subscription: {
    freeCardBg: '#C4DCFB',
    premiumAccent: '#43C2F8',
    confirmBg: '#E8E4DF',
  },

  auth: {
    divider: '#C8C8C8',
    dividerText: '#999999',
    socialBorder: '#C8C8C8',
  },
};

export const shadows = {
  card: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  elevated: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  subtle: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  glass: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  modal: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  taskCard: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  sidebar: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 16,
  lg: 25,
  full: 100,
};

export const typography = {
  fonts: {
    heading: 'Gramatika-Bold',
    headingMedium: 'Gramatika-Medium',
    headingRegular: 'Gramatika-Regular',
    headingLight: 'Gramatika-Light',
    body: 'Geometria-Light',
    bodyMedium: 'Geometria-Medium',
  },
  sizes: {
    h1: 28,
    h2: 22,
    h3: 18,
    body: 16,
    bodySmall: 14,
    caption: 12,
    tiny: 10,
  },
  lineHeight: {
    h1: 38,
    h2: 30,
    h3: 26,
    body: 24,
    bodySmall: 20,
  },
};
