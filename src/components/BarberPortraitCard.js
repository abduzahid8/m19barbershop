import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, shadows, typography } from '../theme/colors';
import { SCREEN_WIDTH, scale as s } from '../theme/responsive';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function BarberPortraitCard({
  barber,
  onPress,
  onBook,
  fullWidth = false,
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  };

  const cardWidth = fullWidth ? SCREEN_WIDTH - s(40) : s(260);
  const cardHeight = fullWidth ? s(340) : s(320);

  return (
    <View>
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.95}
        style={[styles.card, animatedStyle, { width: cardWidth, height: cardHeight }]}
      >
        <Image source={{ uri: barber.avatar }} style={[styles.image, { height: cardHeight * 0.65 }]} />
        <View style={styles.infoArea}>
          <Text style={styles.name} numberOfLines={1}>{barber.name}</Text>
          <Text style={styles.nickname}>"{barber.nickname}"</Text>
          <View style={styles.statsRow}>
            <Ionicons name="star" size={s(11)} color={colors.textSecondary} />
            <Text style={styles.statText}>{barber.rating}</Text>
            <Text style={styles.statMuted}>· {barber.experience} лет</Text>
          </View>
          {onBook && barber.available && (
            <TouchableOpacity
              style={styles.bookBtn}
              onPress={() => onBook(barber)}
              activeOpacity={0.88}
            >
              <Text style={styles.bookText}>ЗАПИСЬ</Text>
            </TouchableOpacity>
          )}
        </View>
      </AnimatedTouchable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: s(26),
    overflow: 'hidden',
    backgroundColor: colors.bgCard,
    ...shadows.card,
  },
  image: {
    width: '100%',
    resizeMode: 'cover',
  },
  infoArea: {
    flex: 1,
    paddingHorizontal: s(16),
    paddingVertical: s(8),
    backgroundColor: colors.bgCard,
  },
  name: {
    fontSize: s(22),
    fontFamily: typography.fonts.heading,
    color: colors.text,
    marginBottom: s(2),
  },
  nickname: {
    fontSize: s(12),
    fontFamily: typography.fonts.body,
    color: colors.textMuted,
    marginBottom: s(6),
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    marginBottom: s(10),
  },
  statText: {
    fontSize: s(12),
    fontFamily: typography.fonts.bodyMedium,
    color: colors.textSecondary,
  },
  statMuted: {
    fontSize: s(10),
    fontFamily: typography.fonts.body,
    color: colors.textMuted,
  },
  bookBtn: {
    backgroundColor: colors.buttonPrimary,
    borderRadius: 100,
    paddingVertical: s(10),
    alignItems: 'center',
  },
  bookText: {
    fontSize: s(12),
    fontFamily: typography.fonts.bodyMedium,
    color: colors.buttonTextPrimary,
    letterSpacing: s(1),
  },
});
