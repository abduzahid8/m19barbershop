import { Dimensions, Platform } from 'react-native';

const getDims = () => {
  const { width, height } = Dimensions.get('window');
  return {
    w: width > 0 ? width : 402,
    h: height > 0 ? height : 874,
  };
};

const d = getDims();

export const SCREEN_WIDTH = d.w;
export const SCREEN_HEIGHT = d.h;

const FIGMA_WIDTH = 402;
const FIGMA_HEIGHT = 874;

const widthScale = d.w / FIGMA_WIDTH;
const heightScale = d.h / FIGMA_HEIGHT;

export const scale = (size) => {
  if (typeof size !== 'number' || isNaN(size)) return 0;
  return Math.round(size * Math.min(widthScale, heightScale));
};

export const scaleWidth = (size) => {
  if (typeof size !== 'number' || isNaN(size)) return 0;
  return Math.round(size * widthScale);
};

export const scaleHeight = (size) => {
  if (typeof size !== 'number' || isNaN(size)) return 0;
  return Math.round(size * heightScale);
};

export const scaleFont = (size) => {
  if (typeof size !== 'number' || isNaN(size)) return 0;
  const factor = Math.min(widthScale, heightScale);
  return Math.round(size * Math.min(factor, 1.35));
};

export const moderateScale = (size, factor = 0.5) => {
  if (typeof size !== 'number' || isNaN(size)) return 0;
  return size + (scale(size) - size) * factor;
};

export const isSmallDevice = d.w < 375;
export const isMediumDevice = d.w >= 375 && d.w < 414;
export const isLargeDevice = d.w >= 414;

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const isTablet = (Platform.OS === 'ios' && d.w >= 768) ||
  (Platform.OS === 'android' && d.w >= 600);
