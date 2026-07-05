import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { colors, typography } from '../theme/colors';
import { scale as s } from '../theme/responsive';

export default function AnimatedProgressRing({
  progress = 0.3,
  size = s(80),
  strokeWidth = s(6),
  label,
  sublabel,
  duration = 1200,
}) {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const innerSize = size - strokeWidth * 2;

  const leftStyle = useAnimatedStyle(() => {
    const angle = interpolate(animatedProgress.value, [0, 0.5, 1], [0, 180, 180]);
    return { transform: [{ rotate: `${angle}deg` }] };
  });

  const rightStyle = useAnimatedStyle(() => {
    const angle = interpolate(animatedProgress.value, [0, 0.5, 1], [0, 0, 180]);
    return { transform: [{ rotate: `${angle}deg` }] };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.ring, {
        width: size, height: size, borderRadius: size / 2,
        borderWidth: strokeWidth, borderColor: colors.borderLight,
      }]} />

      <View style={[styles.halfClip, { width: size / 2, height: size, left: 0 }]}>
        <Animated.View style={[
          styles.halfRing,
          { width: size, height: size, borderRadius: size / 2,
            borderWidth: strokeWidth, borderColor: colors.buttonPrimary, left: 0 },
          leftStyle,
        ]} />
      </View>

      <View style={[styles.halfClip, { width: size / 2, height: size, right: 0 }]}>
        <Animated.View style={[
          styles.halfRing,
          { width: size, height: size, borderRadius: size / 2,
            borderWidth: strokeWidth, borderColor: colors.buttonPrimary, right: 0 },
          rightStyle,
        ]} />
      </View>

      <View style={[styles.center, { width: innerSize, height: innerSize, borderRadius: innerSize / 2 }]}>
        {label && <Text style={styles.label}>{label}</Text>}
        {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute' },
  halfClip: { position: 'absolute', overflow: 'hidden' },
  halfRing: { position: 'absolute', borderLeftColor: 'transparent', borderBottomColor: 'transparent' },
  center: { backgroundColor: colors.bgCard, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: s(18), fontFamily: typography.fonts.heading, color: colors.text },
  sublabel: { fontSize: s(8), fontFamily: typography.fonts.body, color: colors.textMuted, letterSpacing: s(0.5), marginTop: s(2), textTransform: 'uppercase' },
});
