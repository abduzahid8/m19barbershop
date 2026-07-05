import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { colors, typography } from '../theme/colors';
import { scale as s } from '../theme/responsive';
import { SERVICE_PHOTOS, CATEGORIES } from '../data/serviceVisuals';

function CheckBadge() {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.spring(a, { toValue: 1, damping: 10, stiffness: 300, useNativeDriver: true }).start(); }, []);
  return (
    <Animated.View style={[svc.chk, { transform: [{ scale: a }] }]}>
      <Feather name="check" size={s(11)} color="#FFF" />
    </Animated.View>
  );
}

export default function ServiceVisualCard({
  service, index = 0, selected = false, onSelect, onInfo,
}) {
  const a = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(a, { toValue: 1, duration: 450, delay: index * 80, useNativeDriver: true }).start();
  }, []);

  const photoUri = SERVICE_PHOTOS[service.id] || SERVICE_PHOTOS['1'];
  const catConfig = CATEGORIES.find(c => c.key === service.category);

  return (
    <Animated.View style={{ opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [35, 0] }) }] }}>
      <TouchableOpacity
        onPress={onSelect}
        onLongPress={onInfo}
        activeOpacity={0.92}
        style={[svc.outer, selected && svc.outerSel]}
      >
        <LinearGradient colors={['#0b1d3a', '#102852', '#1a3d7a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={svc.card}>
          <Image source={{ uri: photoUri }} style={svc.photo} resizeMode="cover" />
          <LinearGradient colors={['transparent', 'rgba(11,29,58,0.92)']} start={{ x: 0, y: 0.5 }} end={{ x: 0, y: 1 }} style={svc.photoFade} />

          <View style={svc.top}>
            <TouchableOpacity onPress={onInfo} hitSlop={8} activeOpacity={0.5}>
              <View style={svc.infoBtn}>
                <Feather name="info" size={s(13)} color="rgba(255,255,255,0.7)" />
              </View>
            </TouchableOpacity>
            {service.popular && (
              <View style={svc.hit}>
                <Feather name="star" size={s(9)} color="#FFF" />
              </View>
            )}
          </View>

          <View style={svc.bot}>
            <Text style={svc.name} numberOfLines={1}>{service.name}</Text>
            <Text style={svc.price}>{service.price.toLocaleString('ru-RU')}</Text>
          </View>

          {selected && <CheckBadge />}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const svc = StyleSheet.create({
  outer: {
    marginHorizontal: s(14),
    marginBottom: s(12),
    borderRadius: s(22),
    borderWidth: 2,
    borderColor: 'transparent',
  },
  outerSel: {
    borderColor: '#1AFFD5',
  },
  card: {
    borderRadius: s(20),
    height: s(200),
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'space-between',
  },
  photo: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    width: '100%',
    height: '100%',
  },
  photoFade: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '60%',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: s(14),
    zIndex: 2,
  },
  infoBtn: {
    width: s(28), height: s(28), borderRadius: s(14),
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  hit: {
    width: s(22), height: s(22), borderRadius: s(11),
    backgroundColor: '#f97316',
    alignItems: 'center', justifyContent: 'center',
  },
  bot: {
    padding: s(16),
    zIndex: 2,
  },
  name: {
    fontFamily: typography.fonts.heading,
    fontSize: s(17),
    color: '#FFF',
    marginBottom: s(3),
  },
  price: {
    fontFamily: typography.fonts.heading,
    fontSize: s(20),
    color: '#1AFFD5',
  },
  chk: {
    position: 'absolute',
    top: s(14),
    left: s(14),
    width: s(26), height: s(26), borderRadius: s(13),
    backgroundColor: '#1AFFD5',
    alignItems: 'center', justifyContent: 'center',
  },
});
