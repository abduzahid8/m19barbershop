import { useRef, useEffect, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, Image,
  Dimensions, FlatList, Modal, StatusBar, Platform, PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, fonts } from '../theme';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80;
const STACK_SCALE = 0.93;
const STACK_OFFSET = 8;

type AssetId = string | number;

interface PortfolioGalleryProps {
  images: AssetId[];
  colorIndex: number;
}

function imgSrc(asset: AssetId) {
  return typeof asset === 'number' ? asset : { uri: asset };
}

function SwipeCard({ uri, onSwipe, index, total }: { uri: AssetId; onSwipe: () => void; index: number; total: number }) {
  const pan = useRef(new Animated.ValueXY()).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const enterAnim = useRef(new Animated.Value(0)).current;
  const locked = useRef(false);

  useEffect(() => {
    locked.current = false;
    Animated.timing(enterAnim, { toValue: 1, duration: 180, useNativeDriver: true }).start();
  }, [uri]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !locked.current,
      onMoveShouldSetPanResponder: (_, g) => !locked.current && (Math.abs(g.dx) > 5 || Math.abs(g.dy) > 5),
      onPanResponderMove: (_, g) => {
        if (locked.current) return;
        pan.setValue({ x: g.dx, y: g.dy * 0.4 });
        const dist = Math.abs(g.dx);
        cardScale.setValue(Math.max(0.85, 1 - dist / (SCREEN_W * 1.5)));
      },
      onPanResponderRelease: (_, g) => {
        if (locked.current) return;
        if (Math.abs(g.dx) > SWIPE_THRESHOLD) {
          locked.current = true;
          const dir = g.dx > 0 ? 1 : -1;
          Animated.timing(pan, {
            toValue: { x: dir * SCREEN_W * 1.5, y: g.dy * 0.4 },
            duration: 120, useNativeDriver: true,
          }).start();
          onSwipe();
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 6, tension: 100, useNativeDriver: true }).start();
          Animated.spring(cardScale, { toValue: 1, friction: 6, tension: 100, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const rotate = pan.x.interpolate({
    inputRange: [-SCREEN_W / 2, 0, SCREEN_W / 2],
    outputRange: ['-8deg', '0deg', '8deg'],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.swipeCard,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { rotate },
            { scale: Animated.multiply(enterAnim, cardScale) },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <Image source={imgSrc(uri)} style={styles.swipeCardImg} resizeMode="cover" />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.swipeCardGrad} pointerEvents="none" />
      <View style={styles.swipeCardBadge}>
        <Text style={styles.swipeCardBadgeText}>{index + 1} / {total}</Text>
      </View>
    </Animated.View>
  );
}

export default function PortfolioGallery({ images, colorIndex }: PortfolioGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [deck, setDeck] = useState<AssetId[]>([]);
  const bgColor = colors.barberColors[colorIndex % colors.barberColors.length];
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const openLightbox = useCallback((idx: number) => {
    const rotated = [...images.slice(idx), ...images.slice(0, idx)];
    setDeck(rotated);
    setStartIndex(idx);
    setLightboxOpen(true);
  }, [images]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setDeck([]);
  }, []);

  const handleSwipe = useCallback(() => {
    setDeck((prev) => {
      if (prev.length <= 1) return prev;
      return [...prev.slice(1), prev[0]];
    });
  }, []);

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.headerDot, { backgroundColor: bgColor }]} />
          <Text style={styles.title}>Portfolio</Text>
          <Text style={styles.count}>{images.length} works</Text>
        </View>
        <TouchableOpacity style={styles.viewAllBtn} onPress={() => openLightbox(0)} activeOpacity={0.7}>
          <Text style={styles.viewAllText}>View all</Text>
          <Feather name="arrow-right" size={14} color={colors.text} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => openLightbox(0)}
        onPressIn={() => Animated.spring(pressScale, { toValue: 0.96, friction: 8, tension: 120, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(pressScale, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }).start()}
        activeOpacity={1}
      >
        <Animated.View style={[styles.heroCard, { transform: [{ scale: Animated.multiply(pulseAnim, pressScale) }] }]}>
          <Image source={imgSrc(images[0])} style={styles.heroCardImg} resizeMode="cover" />
          <View style={styles.heroShadow} />
          <View style={styles.heroVignette} />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.heroCardGrad} pointerEvents="none" />
          <View style={styles.heroCardOverlay}>
            <View style={styles.heroCardBadge}>
              <Feather name="image" size={12} color={colors.white} />
              <Text style={styles.heroCardBadgeText}>{images.length} works</Text>
            </View>
            <Text style={styles.heroCardTitle}>Tap to explore</Text>
          </View>
          <Animated.View style={[styles.heroCardArrow, { transform: [{ scale: pulseAnim }] }]}>
            <Feather name="arrow-up-right" size={16} color={colors.white} />
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>

      <Modal visible={lightboxOpen} transparent animationType="none" statusBarTranslucent onRequestClose={closeLightbox}>
        <StatusBar barStyle="light-content" />
        <View style={styles.overlay} />

        <View style={styles.lightbox}>
          <TouchableOpacity style={styles.closeBtn} onPress={closeLightbox} activeOpacity={0.7}>
            <Feather name="x" size={18} color={colors.white} />
          </TouchableOpacity>

          <View style={styles.stackWrap}>
            {deck.length > 1 && (
              <View style={[styles.stackCard, { transform: [{ scale: STACK_SCALE }, { translateY: STACK_OFFSET }] }]}>
                <Image source={imgSrc(deck[1])} style={styles.stackCardImg} resizeMode="cover" />
              </View>
            )}
            {deck.length > 2 && (
              <View style={[styles.stackCard, { transform: [{ scale: STACK_SCALE * STACK_SCALE }, { translateY: STACK_OFFSET * 2 }] }]}>
                <Image source={imgSrc(deck[2])} style={styles.stackCardImg} resizeMode="cover" />
              </View>
            )}

            {deck.length > 0 && (
              <SwipeCard
                key={deck[0]}
                uri={deck[0]}
                index={startIndex}
                total={images.length}
                onSwipe={handleSwipe}
              />
            )}

            {deck.length === 0 && (
              <View style={styles.stackEmpty}>
                <Feather name="refresh-cw" size={28} color="rgba(255,255,255,0.2)" />
                <Text style={styles.stackEmptyText}>All viewed</Text>
              </View>
            )}
          </View>

          <View style={styles.hint}>
            <Feather name="arrow-left" size={12} color="rgba(255,255,255,0.2)" />
            <Text style={styles.hintText}>Swipe to browse</Text>
            <Feather name="arrow-right" size={12} color="rgba(255,255,255,0.2)" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, marginBottom: spacing.lg,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  headerDot: { width: 8, height: 8, borderRadius: 4 },
  title: { fontSize: fontSize.xl, fontFamily: fonts.displayRegular, color: colors.text },
  count: { fontSize: fontSize.sm, color: colors.textTertiary, fontFamily: fonts.bodyLight },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm },
  viewAllText: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: fonts.body, fontWeight: '500' },

  heroCard: {
    marginHorizontal: spacing.xl,
    height: SCREEN_H * 0.38,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 10,
  },
  heroCardImg: { width: '100%', height: '100%' },
  heroShadow: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  heroVignette: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  heroCardGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%' },
  heroCardOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: spacing.xl,
  },
  heroCardBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
  },
  heroCardBadgeText: {
    fontSize: fontSize.xs, color: colors.white,
    fontFamily: fonts.body, fontWeight: '500',
  },
  heroCardTitle: {
    fontSize: fontSize.xl, fontFamily: fonts.displayRegular,
    color: colors.white,
  },
  heroCardArrow: {
    position: 'absolute', top: spacing.lg, right: spacing.lg,
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },

  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.88)' },
  lightbox: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 },

  closeBtn: {
    position: 'absolute', top: Platform.OS === 'ios' ? 54 : spacing.xxl,
    left: spacing.xl, zIndex: 30,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },

  stackWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
  },
  stackCard: {
    position: 'absolute',
    width: SCREEN_W - spacing.xxl * 2,
    height: SCREEN_H * 0.6,
    borderRadius: borderRadius.lg, overflow: 'hidden',
    opacity: 0.3,
  },
  stackCardImg: { width: '100%', height: '100%' },
  stackEmpty: {
    alignItems: 'center', gap: spacing.md,
  },
  stackEmptyText: {
    fontSize: fontSize.md, color: 'rgba(255,255,255,0.2)',
    fontFamily: fonts.bodyLight,
  },

  swipeCard: {
    width: SCREEN_W - spacing.xxl * 2,
    height: SCREEN_H * 0.6,
    borderRadius: borderRadius.lg, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 16, elevation: 12,
  },
  swipeCardImg: { width: '100%', height: '100%' },
  swipeCardGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100 },
  swipeCardBadge: {
    position: 'absolute', top: spacing.md, left: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  swipeCardBadgeText: {
    fontSize: fontSize.sm, color: colors.white,
    fontFamily: fonts.body, fontWeight: '600',
  },

  hint: {
    position: 'absolute', bottom: Platform.OS === 'ios' ? 50 : spacing.xxl,
    left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm,
  },
  hintText: {
    fontSize: fontSize.xs, color: 'rgba(255,255,255,0.2)',
    fontFamily: fonts.bodyLight, letterSpacing: 1, textTransform: 'uppercase',
  },
});
