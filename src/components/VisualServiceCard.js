import React from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors, shadows, typography } from '../theme/colors';
import { SCREEN_WIDTH, scale as s } from '../theme/responsive';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function VisualServiceCard({
  service,
  onPress,
  compact = false,
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  };

  const serviceImages = {
    '1': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80',
    '2': 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80',
    '3': 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80',
    '4': 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80',
    '5': 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80',
    '6': 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80',
    '7': 'https://images.unsplash.com/photo-1582095133179-bfd08e2fb6b8?w=600&q=80',
    '8': 'https://images.unsplash.com/photo-1598524374912-bf880ee0c45d?w=600&q=80',
  };

  const imageUri = serviceImages[service.id] || serviceImages['1'];
  const cardWidth = compact ? (SCREEN_WIDTH - s(52)) / 2 : SCREEN_WIDTH - s(40);
  const cardHeight = compact ? s(190) : s(180);

  return (
    <View style={{ width: cardWidth }}>
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.95}
        style={[styles.card, animatedStyle, { height: cardHeight }]}
      >
        <Image source={{ uri: imageUri }} style={[styles.image, { height: cardHeight * 0.65 }]} />
        <View style={styles.infoArea}>
          <Text style={styles.serviceName} numberOfLines={1}>{service.name}</Text>
          <View style={styles.metaRow}>
            <View style={styles.pricePill}>
              <Text style={styles.priceText}>{service.price.toLocaleString('ru-RU')} сум</Text>
            </View>
          </View>
        </View>
      </AnimatedTouchable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: s(25),
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
    paddingHorizontal: s(8),
    paddingVertical: s(4),
    justifyContent: 'center',
    backgroundColor: colors.bgCard,
  },
  serviceName: {
    fontSize: s(15),
    fontFamily: typography.fonts.heading,
    color: colors.text,
    marginBottom: s(4),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  pricePill: {
    backgroundColor: colors.buttonPrimary,
    paddingHorizontal: s(10),
    paddingVertical: s(4),
    borderRadius: 100,
  },
  priceText: {
    fontSize: s(11),
    fontFamily: typography.fonts.bodyMedium,
    color: colors.buttonTextPrimary,
  },
});
