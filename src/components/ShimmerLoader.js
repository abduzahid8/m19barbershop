import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { scale as s } from '../theme/responsive';

export default function ShimmerLoader({ width = '100%', height = 160, borderRadius = s(20), style }) {
  const shimmerTranslate = useSharedValue(-1);

  useEffect(() => {
    shimmerTranslate.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.ease }),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shimmerTranslate.value, [-1, 1], [-300, 300]);
    return { transform: [{ translateX }] };
  });

  return (
    <View style={[styles.container, { width, height, borderRadius }, style]}>
      <Animated.View style={[styles.shimmer, shimmerStyle]}>
        <LinearGradient
          colors={[
            'rgba(0,0,0,0)',
            'rgba(0,0,0,0.03)',
            'rgba(0,0,0,0.08)',
            'rgba(0,0,0,0.03)',
            'rgba(0,0,0,0)',
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.shimmerGradient}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceLight,
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: s(300),
  },
  shimmerGradient: {
    flex: 1,
  },
});
