import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, shadows, typography } from '../theme/colors';
import { SCREEN_WIDTH, scale as s } from '../theme/responsive';

function toDative(name) {
  if (!name) return '';
  const last = name[name.length - 1];
  if (last === 'й') return name.slice(0, -1) + 'ю';
  if (last === 'ь') return name.slice(0, -1) + 'ю';
  if (last === 'а') return name.slice(0, -1) + 'е';
  if (last === 'я') return name.slice(0, -1) + 'е';
  if (['a', 'e', 'i', 'o', 'u', 'y'].includes(last.toLowerCase())) return name;
  return name + 'у';
}

const CARD_W = SCREEN_WIDTH - s(32);

export default function BarberDetailedCard({ barber, onBook }) {
  const [expanded, setExpanded] = useState(false);
  const expandAnim = useRef(new Animated.Value(0)).current;
  const entryAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.timing(entryAnim, { toValue: 1, duration: 400, delay: 50, useNativeDriver: true }).start();
  }, []);

  const toggleExpand = () => {
    const toVal = expanded ? 0 : 1;
    setExpanded(!expanded);
    Animated.spring(expandAnim, { toValue: toVal, damping: 18, stiffness: 200, useNativeDriver: false }).start();
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, damping: 15, stiffness: 300, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, damping: 12, stiffness: 200, useNativeDriver: true }).start();
  };

  const bioMaxLines = expanded ? 100 : 3;
  const chevronDeg = expandAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const bioHeight = expandAnim.interpolate({ inputRange: [0, 1], outputRange: [s(52), s(140)] });

  return (
    <Animated.View style={{ opacity: entryAnim, transform: [{ translateY: entryAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }, { scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={toggleExpand}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.95}
      >
        <View style={styles.card}>
          <Image source={{ uri: barber.avatar }} style={styles.image} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)']}
            locations={[0, 0.35, 0.8]}
            style={StyleSheet.absoluteFill}
          />

          <View style={[styles.availDot, { backgroundColor: barber.available ? '#4ade80' : '#facc15' }]} />

          {barber.specialties?.length > 0 && (
            <View style={styles.tagRow}>
              {barber.specialties.slice(0, 3).map((tag, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.content}>
            <View style={styles.nameRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{barber.name}</Text>
                <Text style={styles.role}>{barber.role}</Text>
              </View>
              <Animated.View style={{ transform: [{ rotate: chevronDeg }] }}>
                <Feather name="chevron-down" size={s(18)} color="rgba(255,255,255,0.6)" />
              </Animated.View>
            </View>

            <View style={styles.ratingRow}>
              <Ionicons name="star" size={s(12)} color="#fbbf24" />
              <Text style={styles.ratingText}>{barber.rating}</Text>
              <Text style={styles.ratingMuted}>· {barber.reviews.toLocaleString('ru-RU')} отзывов</Text>
              <Text style={styles.ratingMuted}>· {barber.experience}</Text>
            </View>

            <Animated.View style={[styles.bioWrap, { height: bioHeight }]}>
              <Text style={styles.bio} numberOfLines={bioMaxLines}>
                {barber.bio}
              </Text>
            </Animated.View>
            <Text style={styles.expandLabel}>
              {expanded ? 'Свернуть' : 'Читать полностью'}
            </Text>

            <TouchableOpacity
              style={styles.bookBtn}
              onPress={() => onBook?.(barber)}
              activeOpacity={0.88}
            >
              <LinearGradient colors={['#1a3d7a', '#102852']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.bookGrad}>
                <Feather name="calendar" size={s(13)} color="#FFF" />
                <Text style={styles.bookText}>Записаться к {toDative(barber.name)}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    height: s(480),
    borderRadius: s(22),
    overflow: 'hidden',
    marginBottom: s(14),
    ...shadows.card,
  },
  image: {
    ...StyleSheet.absoluteFill,
  },
  availDot: {
    position: 'absolute',
    top: s(14), right: s(14),
    width: s(14), height: s(14),
    borderRadius: s(7),
    borderWidth: 2,
    borderColor: '#FFF',
    zIndex: 2,
  },
  tagRow: {
    position: 'absolute',
    top: s(14), left: s(14),
    flexDirection: 'row',
    gap: s(6),
    zIndex: 2,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: s(10),
    paddingVertical: s(4),
    borderRadius: 100,
  },
  tagText: {
    fontSize: s(9),
    fontFamily: typography.fonts.bodyMedium,
    color: '#FFF',
    letterSpacing: 1,
  },
  content: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: s(18),
    paddingBottom: s(22),
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: s(4),
  },
  name: {
    fontSize: s(22),
    fontFamily: typography.fonts.heading,
    color: '#FFFFFF',
  },
  role: {
    fontSize: s(11),
    fontFamily: typography.fonts.body,
    color: 'rgba(255,255,255,0.55)',
    marginTop: s(2),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    marginBottom: s(8),
  },
  ratingText: {
    fontSize: s(12),
    fontFamily: typography.fonts.bodyMedium,
    color: '#FFFFFF',
  },
  ratingMuted: {
    fontSize: s(10),
    fontFamily: typography.fonts.body,
    color: 'rgba(255,255,255,0.5)',
  },
  bioWrap: {
    overflow: 'hidden',
  },
  bio: {
    fontSize: s(12),
    fontFamily: typography.fonts.body,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: s(18),
  },
  expandLabel: {
    fontSize: s(10),
    fontFamily: typography.fonts.bodyMedium,
    color: 'rgba(255,255,255,0.6)',
    marginTop: s(4),
    marginBottom: s(8),
  },
  bookBtn: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  bookGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(8),
    paddingVertical: s(12),
  },
  bookText: {
    fontSize: s(11),
    fontFamily: typography.fonts.heading,
    color: '#FFF',
    letterSpacing: 0.5,
  },
});
