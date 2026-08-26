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

  useEffect(() => {
    Animated.spring(entrance, {
      toValue: 1, friction: 7, tension: 50, useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.spring(scaleSel, { toValue: selected ? 1.03 : 1, friction: 6, tension: 120, useNativeDriver: true }).start();
  }, [selected]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={{ paddingBottom: spacing.sm }}>
      <Animated.View style={{
        opacity: entrance,
        transform: [
          { translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
          { scale: entrance.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
          { scale: scaleSel },
        ],
      }}>
        <View style={[styles.card, selected && styles.cardSelected]}>
          {service.image ? (
            <Image source={service.image} style={styles.cardImage} resizeMode="cover" />
          ) : (
            <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={styles.imageBg} />
          )}
          <View style={styles.badge}>
            <Feather name="award" size={10} color="#D4AF37" />
            <Text style={styles.badgeText}>VIP</Text>
          </View>
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.75)']} style={styles.overlay} pointerEvents="none" />
          <Text style={styles.name}>{service.name}</Text>
          {selected && (
            <View style={styles.checkBadge}>
              <Feather name="check" size={12} color={colors.onAccent} />
            </View>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    borderRadius: borderRadius.md,
    minHeight: 150,
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
  badge: {
    position: 'absolute', top: spacing.sm, left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(212,175,55,0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
    zIndex: 3,
  },
  badgeText: {
    fontSize: fontSize.xs - 1,
    fontFamily: fonts.body,
    fontWeight: '700',
    color: '#D4AF37',
    letterSpacing: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  name: {
    fontSize: fontSize.md,
    fontFamily: fonts.body,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
    padding: spacing.sm + 2,
    zIndex: 2,
  },
  checkBadge: {
    position: 'absolute', top: spacing.sm, right: spacing.sm,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#D4AF37',
    alignItems: 'center', justifyContent: 'center',
    zIndex: 5,
  },
});