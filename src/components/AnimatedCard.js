import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors, shadows } from '../theme/colors';
import { scale as s } from '../theme/responsive';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function AnimatedCard({
  children,
  onPress,
  style,
  selected = false,
  disabled = false,
  activeOpacity = 0.95,
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  };

  return (
    <View style={[
      styles.container,
      selected && styles.selected,
      disabled && styles.disabled,
      style,
    ]}>
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={activeOpacity}
        disabled={disabled}
        style={[animatedStyle, { flex: 1 }]}
      >
        {children}
      </AnimatedTouchable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: s(24),
    overflow: 'hidden',
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  selected: {
    borderColor: colors.border,
    ...shadows.elevated,
  },
  disabled: {
    opacity: 0.5,
  },
});
