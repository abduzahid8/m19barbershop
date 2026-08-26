import { useRef } from 'react';
import {
  TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, Animated,
} from 'react-native';
import { colors, spacing, fontSize, borderRadius, fonts } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  size?: 'md' | 'lg';
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  loading = false,
  style,
  size = 'lg',
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';

  const textColor = isPrimary
    ? colors.onAccent
    : isOutline
    ? colors.accent
    : colors.accent;

  return (
    <Animated.View style={[{ transform: [{ scale }] }, fullWidth && { width: '100%' }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
        style={[
          styles.base,
          size === 'md' && styles.md,
          isPrimary && styles.primary,
          isOutline && styles.outline,
          variant === 'ghost' && styles.ghost,
          fullWidth && styles.fullWidth,
          (disabled || loading) && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <Text
            style={[
              styles.text,
              size === 'md' && styles.textMd,
              { color: textColor },
            ]}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.lg + 2,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  md: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
  },
  primary: {
    backgroundColor: colors.accent,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.35 },
  text: {
    fontSize: fontSize.lg,
    fontFamily: fonts.body,
    letterSpacing: 0.3,
  },
  textMd: {
    fontSize: fontSize.md,
  },
});
