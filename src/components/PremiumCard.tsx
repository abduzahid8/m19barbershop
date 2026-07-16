import { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Service, formatPrice } from '../data';
import { colors, spacing, fontSize, borderRadius, fonts } from '../theme';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = SCREEN_W - spacing.xxl * 2;

interface PremiumCardProps {
  service: Service;
  selected: boolean;
  onPress: () => void;
}

export default function PremiumCard({ service, selected, onPress }: PremiumCardProps) {
  const entrance = useRef(new Animated.Value(0)).current;
  const scaleSel = useRef(new Animated.Value(1)).current;
  const checkReveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(entrance, {
      toValue: 1, friction: 7, tension: 50, useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleSel, { toValue: selected ? 1.03 : 1, friction: 6, tension: 120, useNativeDriver: true }),
      Animated.spring(checkReveal, { toValue: selected ? 1 : 0, friction: 5, tension: 100, useNativeDriver: true }),
    ]).start();
  }, [selected]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={{ paddingBottom: spacing.md }}>
      <Animated.View style={{
        opacity: entrance,
        transform: [
          { translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
          { scale: entrance.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) },
          { scale: scaleSel },
        ],
      }}>
        <View style={[styles.card, selected && styles.cardSelected]}>
          {service.image ? (
            <Image source={service.image} style={styles.cardImage} resizeMode="cover" />
          ) : (
            <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={styles.imageBg} />
          )}

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Feather name="award" size={12} color="#D4AF37" />
              <Text style={styles.badgeText}>ПРЕМИУМ</Text>
            </View>

          </View>

          {!selected && (
            <View style={styles.priceWrap}>
              <Text style={styles.price}>{formatPrice(service.price)}</Text>
            </View>
          )}

          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.overlay} pointerEvents="none" />

          <Text style={styles.name}>{service.name}</Text>

          {selected && (
            <Animated.View style={[styles.checkBadge, { opacity: checkReveal, transform: [{ scale: checkReveal }] }]}>
              <Feather name="check" size={14} color={colors.onAccent} />
            </Animated.View>
          )}

          {selected && (
            <View style={styles.selectedBorder} />
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    borderRadius: borderRadius.lg,
    minHeight: 200,
    justifyContent: 'flex-end',
    position: 'relative',
    overflow: 'hidden',
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  imageBg: {
    ...StyleSheet.absoluteFillObject,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  badgeRow: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 3,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212,175,55,0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
  },
  badgeText: {
    fontSize: fontSize.xs - 1,
    fontFamily: fonts.body,
    fontWeight: '700',
    color: '#D4AF37',
    letterSpacing: 1,
  },
  priceWrap: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 3,
  },
  price: {
    fontSize: fontSize.lg,
    fontFamily: fonts.display,
    color: '#D4AF37',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  name: {
    fontSize: fontSize.lg,
    fontFamily: fonts.body,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
    padding: spacing.md,
    zIndex: 2,
  },
  checkBadge: {
    position: 'absolute', top: spacing.md, right: spacing.md,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#D4AF37',
    alignItems: 'center', justifyContent: 'center',
    zIndex: 5,
  },
  selectedBorder: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: '#D4AF37',
    zIndex: 4,
  },
});