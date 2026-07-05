import { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Service } from '../data';
import { colors, spacing, fontSize, borderRadius, fonts } from '../theme';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = (SCREEN_W - spacing.xxl * 2 - spacing.sm) / 2;

const VINYL_GRADIENTS: [string, string][] = [
  ['#2C1810', '#4A2820'],
  ['#1A2E1A', '#2D4A2D'],
  ['#2E2E1A', '#4A4A2D'],
  ['#2E1A1A', '#4A2D2D'],
  ['#1A1A2E', '#2D2D4A'],
  ['#2E2E2E', '#4A4A4A'],
];

const VINYL_RING = ['#E8A87C', '#85A085', '#D4A88B', '#B5B59C', '#A8C5D6', '#C9A8D6'];

interface ServiceCardProps {
  service: Service;
  selected: boolean;
  onPress: () => void;
  index?: number;
}

export default function ServiceCard({ service, selected, onPress, index = 0 }: ServiceCardProps) {
  const entrance = useRef(new Animated.Value(0)).current;
  const rotateIcon = useRef(new Animated.Value(0)).current;
  const scaleSel = useRef(new Animated.Value(1)).current;
  const checkReveal = useRef(new Animated.Value(0)).current;
  const rippleRing = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = 60 + index * 100;
    Animated.spring(entrance, {
      toValue: 1, delay, friction: 7, tension: 50, useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleSel, { toValue: selected ? 1.03 : 1, friction: 6, tension: 120, useNativeDriver: true }),
      Animated.spring(checkReveal, { toValue: selected ? 1 : 0, friction: 5, tension: 100, useNativeDriver: true }),
    ]).start();
    if (selected) {
      rippleRing.setValue(0);
      Animated.spring(rippleRing, { toValue: 1, friction: 4, tension: 60, useNativeDriver: true }).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateIcon, { toValue: 1, duration: 3000, useNativeDriver: true }),
          Animated.timing(rotateIcon, { toValue: 0, duration: 3000, useNativeDriver: true }),
        ]),
        { iterations: -1 }
      ).start();
    } else {
      rotateIcon.setValue(0);
    }
  }, [selected]);

  const grad = VINYL_GRADIENTS[index % VINYL_GRADIENTS.length];
  const ringColor = VINYL_RING[index % VINYL_RING.length];
  const spin = rotateIcon.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const entranceRotate = entrance.interpolate({ inputRange: [0, 1], outputRange: ['15deg', '0deg'] });
  const entranceY = entrance.interpolate({ inputRange: [0, 1], outputRange: [40 * (index % 2 === 0 ? 1 : -1), 0] });
  const entranceScale = entrance.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={{ width: '50%', padding: spacing.xs / 2 }}>
      <Animated.View style={{
        opacity: entrance,
        transform: [
          { rotate: entranceRotate },
          { translateY: entranceY },
          { scale: entranceScale },
          { scale: scaleSel },
        ],
      }}>
        <LinearGradient colors={grad} style={styles.card}>
          <View style={[styles.vinylRing, { borderColor: ringColor }]}>
            <Animated.View style={[styles.vinylCenter, selected && { transform: [{ rotate: spin }] }]}>
              <Feather name={service.icon as any} size={24} color={selected ? colors.onAccent : ringColor} />
            </Animated.View>
          </View>
          <Text style={styles.name}>{service.name}</Text>
          <Text style={styles.desc} numberOfLines={2}>{service.description}</Text>
          <View style={styles.bottom}>
            <View>
              <Text style={styles.price}>{service.price.toLocaleString('uz-UZ')}</Text>
              <Text style={styles.currency}>UZS</Text>
            </View>
            <View style={[styles.durBadge, selected && styles.durBadgeSelected]}>
              <Feather name="clock" size={10} color={selected ? colors.onAccent : colors.textTertiary} />
              <Text style={[styles.durText, selected && styles.durTextSelected]}>{service.duration}m</Text>
            </View>
          </View>
          {selected && (
            <>
              <Animated.View style={[styles.ripple, { opacity: rippleRing.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] }), transform: [{ scale: rippleRing.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.8] }) }] }]} />
              <Animated.View style={[styles.checkBadge, { opacity: checkReveal, transform: [{ scale: checkReveal }] }]}>
                <Feather name="check" size={14} color={colors.onAccent} />
              </Animated.View>
            </>
          )}
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    minHeight: 180,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  vinylRing: {
    width: 48, height: 48, borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E8A87C',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  vinylCenter: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center', justifyContent: 'center',
  },
  name: {
    fontSize: fontSize.md, fontFamily: fonts.body, fontWeight: '600',
    color: colors.white, marginBottom: spacing.xs,
  },
  desc: {
    fontSize: fontSize.xs, color: 'rgba(255,255,255,0.6)',
    fontFamily: fonts.bodyLight, lineHeight: 16, marginBottom: spacing.md,
  },
  bottom: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
  },
  price: {
    fontSize: fontSize.lg, fontFamily: fonts.body, fontWeight: '700', color: colors.white,
    lineHeight: 22,
  },
  currency: {
    fontSize: fontSize.xs, color: 'rgba(255,255,255,0.4)', fontFamily: fonts.bodyLight, marginTop: -2,
  },
  durBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: borderRadius.full,
  },
  durBadgeSelected: { backgroundColor: colors.accent },
  durText: {
    fontSize: fontSize.xs, color: 'rgba(255,255,255,0.7)', fontFamily: fonts.body,
  },
  durTextSelected: { color: colors.onAccent },
  checkBadge: {
    position: 'absolute', top: spacing.md, right: spacing.md,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
    zIndex: 2,
  },
  ripple: {
    position: 'absolute',
    top: spacing.lg + 24, left: spacing.lg + 24 - 40,
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
});
