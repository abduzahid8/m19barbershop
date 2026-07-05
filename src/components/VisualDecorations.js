import React from 'react';
import { View, StyleSheet } from 'react-native';
import { scale as s } from '../theme/responsive';

function FloatingParticles({ count = 4, colors = ['rgba(255,255,255,0.04)'] }) {
  const positions = [
    { top: '15%', left: '8%' }, { top: '35%', left: '82%' }, { top: '65%', left: '12%' },
    { top: '80%', left: '72%' }, { top: '25%', left: '55%' }, { top: '70%', left: '35%' },
  ];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[styles.particle, {
            width: s(12 + i * 6), height: s(12 + i * 6), borderRadius: s(6 + i * 3),
            backgroundColor: colors[i % colors.length],
            top: positions[i % positions.length]?.top || '50%',
            left: positions[i % positions.length]?.left || '50%',
          }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: { position: 'absolute' },
});

export { FloatingParticles };
