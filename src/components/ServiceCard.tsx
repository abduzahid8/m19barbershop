import { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Service } from '../data';
import { colors, spacing, fontSize, borderRadius, fonts } from '../theme';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = (SCREEN_W - spacing.xxl * 2 - spacing.sm) / 2;

const TYPE_COLORS = ['#E8A87C', '#85A085', '#D4A88B', '#B5B59C', '#A8C5D6', '#C9A8D6'];

interface ServiceCardProps {
  service: Service;
  selected: boolean;
  onPress: () => void;
  index?: number;
}

export default function ServiceCard({ service, selected, onPress, index = 0 }: ServiceCardProps) {
  const entrance = useRef(new Animated.Value(0)).current;
  const scaleSel = useRef(new Animated.Value(1)).current;
  const checkReveal = useRef(new Animated.Value(0)).current;

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
  }, [selected]);

  const ringColor = TYPE_COLORS[index % TYPE_COLORS.length];

  const entranceRotate = entrance.interpolate({ inputRange: [0, 1], outputRange: ['15deg', '0deg'] });
  const entranceY = entrance.interpolate({ inputRange: [0, 1], outputRange: [40 * (index % 2 === 0 ? 1 : -1), 0] });
  const entranceScale = entrance.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={{ width: '50%', padding: 5 }}>
      <Animated.View style={{
        opacity: entrance,
        transform: [
          { rotate: entranceRotate },
          { translateY: entranceY },
          { scale: entranceScale },
          { scale: scaleSel },
        ],
      }}>
        <View style={styles.card}>
          {service.image ? (
            <Image source={service.image} style={styles.cardImage} resizeMode="cover" />
          ) : (
            <View style={[styles.cardImage, { backgroundColor: ringColor + '44' }]} />
          )}
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.cardOverlay} pointerEvents="none" />

          <Text style={styles.name}>{service.name}</Text>

          {selected && (
            <Animated.View style={[styles.checkBadge, { opacity: checkReveal, transform: [{ scale: checkReveal }] }]}>
              <Feather name="check" size={14} color={colors.onAccent} />
            </Animated.View>
          )}

          {selected && (
            <View style={[styles.selectedBorder, { borderColor: ringColor }]} />
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    minHeight: 180,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  name: {
    fontSize: fontSize.md,
    fontFamily: fonts.body,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
    padding: spacing.sm,
    zIndex: 2,
  },
  checkBadge: {
    position: 'absolute', top: spacing.md, right: spacing.md,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
    zIndex: 5,
  },
  selectedBorder: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    zIndex: 4,
  },
});
