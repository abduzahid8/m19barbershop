import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { scale as s } from '../theme/responsive';
import { SCREEN_WIDTH } from '../theme/responsive';

const IRIDESCENT_COLORS = [
  ['rgba(16,40,82,0.85)', 'rgba(26,61,122,0.7)', 'rgba(147,51,234,0.3)'],
  ['rgba(16,40,82,0.8)', 'rgba(196,113,237,0.3)', 'rgba(16,40,82,0.6)'],
];

export default function IridescentHero({
  uri = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
  height = s(300),
  colors = IRIDESCENT_COLORS[0],
  children,
}) {
  return (
    <View style={[styles.container, { height }]}>
      <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: SCREEN_WIDTH, position: 'relative', overflow: 'hidden' },
  image: { ...StyleSheet.absoluteFillObject, width: SCREEN_WIDTH },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: s(20) },
});
