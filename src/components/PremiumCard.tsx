import { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, fontSize, borderRadius, fonts, cardShadow } from '../theme';
import { formatPrice } from '../data';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = SCREEN_W - spacing.xxl * 2;

interface PremiumCardProps {
  selected: boolean;
  onPress: () => void;
  index?: number;
}

export default function PremiumCard({ selected, onPress, index = 0 }: PremiumCardProps) {
  const entrance = useRef(new Animated.Value(0)).current;
  const scaleSel = useRef(new Animated.Value(1)).current;
  const checkReveal = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = 60 + index * 100;
    Animated.spring(entrance, {
      toValue: 1, delay, friction: 7, tension: 50, useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleSel, { toValue: selected ? 1.02 : 1, friction: 6, tension: 120, useNativeDriver: true }),
      Animated.spring(checkReveal, { toValue: selected ? 1 : 0, friction: 5, tension: 100, useNativeDriver: true }),
    ]).start();
  }, [selected]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 2500, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 2500, useNativeDriver: true }),
      ]),
      { iterations: -1 }
    ).start();
  }, []);

  const entranceRotate = entrance.interpolate({ inputRange: [0, 1], outputRange: ['8deg', '0deg'] });
  const entranceY = entrance.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });
  const entranceScale = entrance.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={{ paddingBottom: spacing.md }}>
      <Animated.View style={{
        opacity: entrance,
        transform: [
          { rotate: entranceRotate },
          { translateY: entranceY },
          { scale: entranceScale },
          { scale: scaleSel },
        ],
      }}>
        <View style={[styles.card, selected && styles.cardSelected, cardShadow]}>
          <View style={styles.imageWrap}>
            <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={styles.imageBg} />
            <View style={styles.glow}>
              <LinearGradient colors={['rgba(212,175,55,0.3)', 'transparent']} style={{ flex: 1 }} />
            </View>
            <View style={styles.badge}>
              <Feather name="award" size={20} color="#D4AF37" />
            </View>
            <View style={styles.privIcon}>
              <Feather name="lock" size={14} color="rgba(255,255,255,0.5)" />
              <Text style={styles.privLabel}>PRIVATE ROOM</Text>
            </View>
          </View>

          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.overlay} pointerEvents="none" />

          <Animated.View style={[styles.shimmer, { opacity: shimmer.interpolate({ inputRange: [0, 1], outputRange: [0, 0.3] }) }]} pointerEvents="none">
            <LinearGradient colors={['transparent', 'rgba(212,175,55,0.15)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
          </Animated.View>

          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text style={styles.badgePremium}>PREMIUM</Text>
              <Text style={styles.price}>250 000 UZS</Text>
            </View>
            <Text style={styles.name}>Private Room Haircut</Text>
            <Text style={styles.desc}>Exclusive service in a private VIP room with premium care</Text>
            <View style={styles.perms}>
              <View style={styles.perk}>
                <Feather name="clock" size={10} color="#D4AF37" />
                <Text style={styles.perkText}>60 min</Text>
              </View>
              <View style={styles.perk}>
                <Feather name="star" size={10} color="#D4AF37" />
                <Text style={styles.perkText}>VIP treatment</Text>
              </View>
              <View style={styles.perk}>
                <Feather name="shield" size={10} color="#D4AF37" />
                <Text style={styles.perkText}>Private room</Text>
              </View>
            </View>
          </View>

          {selected && (
            <Animated.View style={[styles.checkBadge, { opacity: checkReveal, transform: [{ scale: checkReveal }] }]}>
              <Feather name="check" size={16} color="#000" />
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
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0d0d1a',
  },
  cardSelected: {
    borderWidth: 1.5,
    borderColor: '#D4AF37',
  },
  imageWrap: {
    height: 160,
    position: 'relative',
    overflow: 'hidden',
  },
  imageBg: {
    ...StyleSheet.absoluteFillObject,
  },
  glow: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 80,
  },
  badge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(212,175,55,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
  },
  privIcon: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  privLabel: {
    fontSize: fontSize.xs - 1,
    fontFamily: fonts.body,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  shimmer: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 160,
  },
  content: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: spacing.md,
    zIndex: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badgePremium: {
    fontSize: fontSize.xs - 1,
    fontFamily: fonts.body,
    fontWeight: '700',
    color: '#D4AF37',
    letterSpacing: 2,
  },
  price: {
    fontSize: fontSize.lg,
    fontFamily: fonts.display,
    color: '#fff',
  },
  name: {
    fontSize: fontSize.xl,
    fontFamily: fonts.display,
    color: colors.white,
    marginBottom: 2,
  },
  desc: {
    fontSize: fontSize.xs,
    fontFamily: fonts.bodyLight,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: spacing.sm,
  },
  perms: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  perk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  perkText: {
    fontSize: fontSize.xs - 1,
    fontFamily: fonts.body,
    color: 'rgba(212,175,55,0.8)',
  },
  checkBadge: {
    position: 'absolute', top: spacing.md, right: spacing.md,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#D4AF37',
    alignItems: 'center', justifyContent: 'center',
    zIndex: 10,
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