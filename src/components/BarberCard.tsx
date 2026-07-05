import { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Animated, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Barber } from '../data';
import { colors, spacing, fontSize, borderRadius, fonts, cardShadow } from '../theme';
import Shimmer from './Shimmer';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_IMG_HEIGHT = 180;
const COMPACT_IMG_H = 170;
const CARD_W = (SCREEN_W - spacing.xxl * 2 - spacing.sm) / 2;

interface BarberCardProps {
  barber: Barber;
  onPress: () => void;
  compact?: boolean;
  selected?: boolean;
  index?: number;
}

export default function BarberCard({ barber, onPress, compact = false, selected, index = 0 }: BarberCardProps) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(20)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const imgLoaded = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = 100 + index * 80;
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 450, delay, useNativeDriver: true }),
      Animated.spring(slideUp, { toValue: 0, delay, friction: 8, tension: 50, useNativeDriver: true }),
    ]).start();
  }, []);

  const onPressIn = () => {
    Animated.spring(pressScale, { toValue: 0.95, friction: 8, tension: 150, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.spring(pressScale, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }).start();
  };
  const onImageLoad = () => {
    Animated.timing(imgLoaded, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  };

  const initials = barber.name.slice(0, 2).toUpperCase();
  const bgColor = colors.barberColors[barber.colorIndex % colors.barberColors.length];
  const imgH = compact ? COMPACT_IMG_H : CARD_IMG_HEIGHT;
  const shimmerW = compact ? CARD_W : cardDefaultWidth();

  const imageContent = barber.imageUrl ? (
    <Animated.View style={{ opacity: imgLoaded }}>
      <Image
        source={{ uri: barber.imageUrl }}
        onLoad={onImageLoad}
        style={{ width: '100%', height: imgH }}
        resizeMode="cover"
      />
    </Animated.View>
  ) : (
    <View style={[{ width: '100%', height: imgH, backgroundColor: bgColor, alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={styles.initials}>{initials}</Text>
    </View>
  );

  return (
    <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: slideUp }], flex: 1, maxWidth: compact ? CARD_W : undefined }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        style={{ flex: compact ? undefined : 1 }}
      >
        <Animated.View style={[
          styles.base,
          compact ? styles.compactCard : styles.fullCard,
          selected && styles.selected,
          compact && cardShadow,
          { transform: [{ scale: pressScale }] },
        ]}>
          <Shimmer width={shimmerW} height={imgH} borderRadius={compact ? borderRadius.md : borderRadius.lg}>
            <View style={{ width: '100%', height: imgH, overflow: 'hidden' }}>
              {imageContent}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.75)']}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              <View style={compact ? styles.overlayCompact : styles.overlayFull}>
                <Text style={compact ? styles.nameCompact : styles.nameFull} numberOfLines={1}>
                  {barber.name}
                </Text>
                <View style={styles.metaRow}>
                  <Text style={styles.star}>★</Text>
                  <Text style={styles.ratingText}>{barber.rating}</Text>
                  {!compact && (
                    <Text style={styles.specialtyText}> · {barber.specialty}</Text>
                  )}
                </View>
              </View>
              {!barber.available && (
                <View style={styles.unavailableBadge}>
                  <Text style={styles.unavailableBadgeText}>Unavailable</Text>
                </View>
              )}
            </View>
          </Shimmer>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function cardDefaultWidth() {
  return SCREEN_W - spacing.xxl * 2;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  fullCard: {
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  compactCard: {
    borderRadius: borderRadius.md,
    margin: spacing.xs / 2,
  },
  selected: {
    borderWidth: 2,
    borderColor: colors.accent,
  },
  initials: {
    fontSize: fontSize.xxxl, fontFamily: fonts.display, color: colors.white,
  },
  overlayCompact: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: spacing.sm + 2,
  },
  overlayFull: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: spacing.lg,
  },
  nameCompact: {
    fontSize: fontSize.sm, fontFamily: fonts.body, fontWeight: '600',
    color: colors.white, marginBottom: 1,
  },
  nameFull: {
    fontSize: fontSize.lg, fontFamily: fonts.display,
    color: colors.white, marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row', alignItems: 'center',
  },
  star: {
    fontSize: fontSize.sm, color: colors.warning, marginRight: 3,
  },
  ratingText: {
    fontSize: fontSize.sm, fontWeight: '600', color: 'rgba(255,255,255,0.9)', fontFamily: fonts.body,
  },
  specialtyText: {
    fontSize: fontSize.sm, color: 'rgba(255,255,255,0.7)', fontFamily: fonts.bodyLight,
  },
  unavailableBadge: {
    position: 'absolute', top: spacing.sm, right: spacing.sm,
    backgroundColor: 'rgba(239,83,80,0.85)',
    paddingHorizontal: spacing.sm, paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  unavailableBadgeText: {
    fontSize: fontSize.xs, color: colors.white, fontFamily: fonts.body, fontWeight: '500',
  },
});
