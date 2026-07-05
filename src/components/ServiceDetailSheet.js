import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Image, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { colors, typography } from '../theme/colors';
import { scale as s } from '../theme/responsive';
import { SERVICE_PHOTOS, getDurationColor, CATEGORIES } from '../data/serviceVisuals';

function DurationRing({ duration, size = s(80), strokeWidth = s(5) }) {
  const anim = useRef(new Animated.Value(0)).current;
  const pct = Math.min(duration / 90, 1);
  const color = getDurationColor(duration);
  const innerSize = size - strokeWidth * 2;

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, { toValue: pct, duration: 1200, useNativeDriver: false }).start();
  }, [duration]);

  const halfClipSize = size / 2;

  const leftRotation = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '180deg', '180deg'],
  });

  const rightRotation = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '0deg', '180deg'],
  });

  return (
    <View style={[dr.container, { width: size, height: size }]}>
      <View style={[dr.bgRing, {
        width: size, height: size, borderRadius: size / 2,
        borderWidth: strokeWidth, borderColor: colors.borderLight,
      }]} />
      <View style={[dr.halfClip, { width: halfClipSize, height: size, left: 0 }]}>
        <Animated.View style={[
          dr.halfRing,
          { width: size, height: size, borderRadius: size / 2, borderWidth: strokeWidth, borderColor: color, left: 0 },
          { transform: [{ rotate: leftRotation }] },
        ]} />
      </View>
      <View style={[dr.halfClip, { width: halfClipSize, height: size, right: 0 }]}>
        <Animated.View style={[
          dr.halfRing,
          { width: size, height: size, borderRadius: size / 2, borderWidth: strokeWidth, borderColor: color, right: 0 },
          { transform: [{ rotate: rightRotation }] },
        ]} />
      </View>
      <View style={[dr.center, { width: innerSize, height: innerSize, borderRadius: innerSize / 2 }]}>
        <Text style={dr.centerValue}>{duration}</Text>
        <Text style={dr.centerLabel}>мин</Text>
      </View>
    </View>
  );
}

const dr = StyleSheet.create({
  container: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  bgRing: { position: 'absolute', borderLeftColor: 'transparent', borderBottomColor: 'transparent' },
  halfClip: { position: 'absolute', overflow: 'hidden' },
  halfRing: { position: 'absolute', borderLeftColor: 'transparent', borderBottomColor: 'transparent' },
  center: { backgroundColor: colors.bgCard, alignItems: 'center', justifyContent: 'center' },
  centerValue: { fontSize: s(20), fontFamily: typography.fonts.heading, color: colors.text },
  centerLabel: { fontSize: s(8), fontFamily: typography.fonts.body, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: s(1) },
});

export default function ServiceDetailSheet({
  visible, service, onClose, onBook,
  services = [], serviceIndex = 0, onSwipe,
}) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const swipeX = useRef(new Animated.Value(0)).current;

  const dismissPan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 8 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          Animated.timing(translateY, { toValue: 800, duration: 200, useNativeDriver: true }).start(onClose);
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const swipePan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderMove: (_, g) => {
        swipeX.setValue(g.dx);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx > 80 && serviceIndex > 0 && onSwipe) {
          Animated.timing(swipeX, { toValue: 300, duration: 200, useNativeDriver: true })
            .start(() => { swipeX.setValue(0); onSwipe(serviceIndex - 1); });
        } else if (g.dx < -80 && serviceIndex < services.length - 1 && onSwipe) {
          Animated.timing(swipeX, { toValue: -300, duration: 200, useNativeDriver: true })
            .start(() => { swipeX.setValue(0); onSwipe(serviceIndex + 1); });
        } else {
          Animated.spring(swipeX, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(0);
      Animated.spring(slideAnim, { toValue: 1, damping: 20, stiffness: 200, useNativeDriver: true }).start();
    } else {
      slideAnim.setValue(0);
      translateY.setValue(0);
      swipeX.setValue(0);
    }
  }, [visible, service?.id]);

  if (!service) return null;

  const photoUri = SERVICE_PHOTOS[service.id] || SERVICE_PHOTOS['1'];
  const catConfig = CATEGORIES.find(c => c.key === service.category);

  const sheetTranslate = slideAnim.interpolate({ inputRange: [0, 1], outputRange: [400, 0] });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={sds.overlay}>
        <TouchableOpacity style={sds.backdrop} activeOpacity={1} onPress={onClose} />
        <Animated.View
          style={[
            sds.sheet,
            { transform: [{ translateY: Animated.add(sheetTranslate, translateY) }] },
          ]}
        >
          <View style={sds.handle} {...dismissPan.panHandlers} />

          <Animated.View
            style={{ transform: [{ translateX: swipeX }] }}
            {...swipePan.panHandlers}
          >
            <View style={sds.heroWrap}>
              <Image source={{ uri: photoUri }} style={sds.heroImage} resizeMode="cover" />
              <LinearGradient colors={['transparent', colors.background]} style={sds.heroGrad} />
              <TouchableOpacity style={sds.closeBtn} onPress={onClose} activeOpacity={0.7}>
                <Feather name="x" size={s(16)} color="#FFF" />
              </TouchableOpacity>
              {service.popular && (
                <View style={sds.heroBadge}>
                  <Feather name="star" size={s(10)} color="#FFF" />
                  <Text style={sds.heroBadgeText}>Хит продаж</Text>
                </View>
              )}
            </View>

            <View style={sds.contentWrap}>
              <Text style={sds.name}>{service.name}</Text>

              {services.length > 1 && (
                <Text style={sds.swipeHint}>
                  {serviceIndex + 1} из {services.length} · проведите влево/вправо
                </Text>
              )}

              <View style={sds.tagRow}>
                {catConfig && (
                  <View style={sds.catTag}>
                    <Feather name={catConfig.icon} size={s(9)} color={colors.textMuted} />
                    <Text style={sds.catLabel}>{catConfig.label}</Text>
                  </View>
                )}
                <View style={sds.catTag}>
                  <Feather name="clock" size={s(9)} color={getDurationColor(service.duration)} />
                  <Text style={[sds.catLabel, { color: getDurationColor(service.duration) }]}>
                    {service.duration} мин
                  </Text>
                </View>
              </View>

              <Text style={sds.description}>{service.description}</Text>

              <View style={sds.statsRow}>
                <DurationRing duration={service.duration} />
                <View style={sds.priceBlock}>
                  <Text style={sds.priceLabel}>Стоимость</Text>
                  <Text style={sds.priceValue}>{service.price.toLocaleString('ru-RU')}</Text>
                  <Text style={sds.priceCur}>сум</Text>
                </View>
              </View>

              <View style={sds.ctaRow}>
                <TouchableOpacity
                  style={sds.ctaPrimary}
                  onPress={() => onBook(service)}
                  activeOpacity={0.88}
                >
                  <LinearGradient
                    colors={['#102852', '#1a3d7a']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={sds.ctaGrad}
                  >
                    <Feather name="calendar" size={s(14)} color="#FFF" />
                    <Text style={sds.ctaText}>Записаться</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={sds.ctaSecondary} onPress={onClose} activeOpacity={0.7}>
                  <Text style={sds.ctaSecText}>Закрыть</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const sds = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: s(28),
    borderTopRightRadius: s(28),
    maxHeight: '90%',
  },
  handle: {
    width: s(36), height: s(4), borderRadius: s(2),
    backgroundColor: colors.borderLight,
    alignSelf: 'center', marginTop: s(10), marginBottom: s(6),
    zIndex: 10,
  },
  heroWrap: { height: s(200), position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%' },
  closeBtn: {
    position: 'absolute', top: s(12), right: s(12),
    width: s(32), height: s(32), borderRadius: s(16),
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroBadge: {
    position: 'absolute', top: s(12), left: s(12),
    flexDirection: 'row', alignItems: 'center', gap: s(4),
    backgroundColor: '#f97316', paddingHorizontal: s(10), paddingVertical: s(4),
    borderRadius: 100,
  },
  heroBadgeText: { fontSize: s(9), fontFamily: typography.fonts.bodyMedium, color: '#FFF' },
  contentWrap: { padding: s(20), paddingTop: s(14) },
  name: { fontSize: s(20), fontFamily: typography.fonts.heading, color: colors.text, marginBottom: s(2) },
  swipeHint: {
    fontSize: s(8), fontFamily: typography.fonts.body, color: colors.textMuted,
    marginBottom: s(6), fontStyle: 'italic',
  },
  tagRow: { flexDirection: 'row', gap: s(8), marginBottom: s(14) },
  catTag: {
    flexDirection: 'row', alignItems: 'center', gap: s(4),
    paddingHorizontal: s(8), paddingVertical: s(4),
    borderRadius: 100, backgroundColor: colors.bgInput,
  },
  catLabel: { fontSize: s(9), fontFamily: typography.fonts.body, color: colors.textMuted },
  description: {
    fontSize: s(12), fontFamily: typography.fonts.body, color: colors.textSecondary,
    lineHeight: s(18), marginBottom: s(20),
  },
  statsRow: {
    flexDirection: 'row', alignItems: 'center', gap: s(24),
    justifyContent: 'center', marginBottom: s(24),
  },
  priceBlock: { alignItems: 'center' },
  priceLabel: {
    fontSize: s(9), fontFamily: typography.fonts.body, color: colors.textMuted,
    marginBottom: s(4), textTransform: 'uppercase', letterSpacing: 0.5,
  },
  priceValue: { fontSize: s(26), fontFamily: typography.fonts.heading, color: colors.text },
  priceCur: { fontSize: s(11), fontFamily: typography.fonts.body, color: colors.textMuted, marginTop: s(2) },
  ctaRow: { gap: s(10) },
  ctaPrimary: { borderRadius: 100, overflow: 'hidden' },
  ctaGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: s(8), paddingVertical: s(14),
  },
  ctaText: {
    fontSize: s(13), fontFamily: typography.fonts.heading,
    color: '#FFF', textTransform: 'uppercase', letterSpacing: 0.8,
  },
  ctaSecondary: { alignItems: 'center', paddingVertical: s(10) },
  ctaSecText: { fontSize: s(12), fontFamily: typography.fonts.body, color: colors.textMuted },
});
