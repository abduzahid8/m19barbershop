import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, typography } from '../theme/colors';
import { scale } from '../theme/responsive';

const HEIGHTS = { small: scale(40), medium: scale(56), large: scale(64) };
const PADDINGS = { small: scale(20), medium: scale(32), large: scale(40) };

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  activeOpacity = 0.8,
}) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';
  const isGradient = variant === 'gradient';

  const bgColor = isPrimary
    ? colors.buttonPrimary
    : isSecondary
    ? colors.surface
    : isGradient
    ? '#6E5EFF'
    : 'transparent';

  const txtColor = isPrimary
    ? colors.buttonTextPrimary
    : isSecondary || isGradient
    ? colors.text
    : colors.text;

  const fontSize = size === 'small' ? scale(16) : scale(18);
  const fontFamily = isOutline ? typography.fonts.headingMedium : typography.fonts.heading;

  const borderStyle = isOutline
    ? { borderWidth: 1, borderColor: colors.text }
    : {};

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={activeOpacity}
      style={[
        styles.base,
        {
          height: HEIGHTS[size],
          paddingHorizontal: PADDINGS[size],
          backgroundColor: bgColor,
          opacity: disabled ? 0.5 : 1,
        },
        borderStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={txtColor} />
      ) : (
        <Text
          style={[
            styles.text,
            {
              fontFamily,
              fontSize,
              color: txtColor,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  text: {
    textAlign: 'center',
  },
});
