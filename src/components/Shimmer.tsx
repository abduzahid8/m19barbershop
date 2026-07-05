import { useRef, useEffect, ReactNode } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { borderRadius as br } from '../theme';

const { width: SCREEN_W } = Dimensions.get('window');

interface ShimmerProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  children?: ReactNode;
  loading?: boolean;
}

const SHIMMER_W = 200;

export default function Shimmer({
  width = SCREEN_W,
  height = 200,
  borderRadius = br.md,
  children,
  loading,
}: ShimmerProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SHIMMER_W, width + SHIMMER_W],
  });

  const sweep = (
    <Animated.View style={{ position: 'absolute', top: 0, left: 0, width: SHIMMER_W, height, transform: [{ translateX }] }}>
      <LinearGradient
        colors={['transparent', 'rgba(255,255,255,0.35)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ width: SHIMMER_W, height }}
      />
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={{ width, height, borderRadius, backgroundColor: '#2A2A2A', overflow: 'hidden' }}>
        {sweep}
      </View>
    );
  }

  return (
    <View style={{ width, height, borderRadius, overflow: 'hidden' }}>
      {children}
      {sweep}
    </View>
  );
}
