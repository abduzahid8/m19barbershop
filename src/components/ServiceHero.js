import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { scale as s, SCREEN_WIDTH } from '../theme/responsive';
import { getCategoryConfig, HERO_IMAGES } from '../data/serviceVisuals';

export default function ServiceHero({ activeCategory = 'all' }) {
  const entryAnim = useRef(new Animated.Value(0)).current;
  const categoryConfig = getCategoryConfig(activeCategory);

  useEffect(() => {
    entryAnim.setValue(0);
    Animated.timing(entryAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [activeCategory]);

  const heroUri = activeCategory !== 'all' && HERO_IMAGES.category[activeCategory]
    ? HERO_IMAGES.category[activeCategory]
    : HERO_IMAGES.default;

  return (
    <View style={sh.container}>
      <Image source={{ uri: heroUri }} style={sh.image} resizeMode="cover" />
      <LinearGradient
        colors={['rgba(10,26,62,0.85)', 'rgba(26,61,122,0.5)', 'rgba(16,40,82,0.6)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View
        style={[
          sh.content,
          {
            opacity: entryAnim,
            transform: [{
              scale: entryAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }),
            }],
          },
        ]}
      >
        <View style={sh.iconWrap}>
          <Feather name={categoryConfig.icon} size={s(22)} color="#FFF" />
        </View>
      </Animated.View>
    </View>
  );
}

const sh = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: s(200),
    position: 'relative',
    overflow: 'hidden',
  },
  image: { ...StyleSheet.absoluteFillObject, width: SCREEN_WIDTH },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(20),
  },
  iconWrap: {
    width: s(56), height: s(56), borderRadius: s(28),
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
});
