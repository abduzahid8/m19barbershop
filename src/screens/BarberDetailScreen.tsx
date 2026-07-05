import { useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { barbers } from '../data';
import { colors, spacing, fontSize, borderRadius, fonts, cardShadow } from '../theme';
import Button from '../components/Button';
import Shimmer from '../components/Shimmer';
import type { RootStackParamList } from '../navigation/AppNavigator';

const { width: SCREEN_W } = Dimensions.get('window');

type Route = RouteProp<RootStackParamList, 'BarberDetail'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function BarberDetailScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const barber = barbers.find((b) => b.id === route.params.barberId);

  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  if (!barber) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Barber not found</Text>
      </SafeAreaView>
    );
  }

  const initials = barber.name.slice(0, 2).toUpperCase();
  const bgColor = colors.barberColors[barber.colorIndex % colors.barberColors.length];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View style={[styles.profileCard, cardShadow, { opacity: fadeIn }]}>
          <Shimmer width={SCREEN_W - spacing.xxl * 2} height={220} borderRadius={0}>
            {barber.imageUrl ? (
              <Image source={{ uri: barber.imageUrl }} style={styles.profileImg} />
            ) : (
              <View style={[styles.profileImg, { backgroundColor: bgColor, alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={styles.initials}>{initials}</Text>
              </View>
            )}
          </Shimmer>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{barber.name}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{barber.specialty}</Text>
            </View>
            <View style={styles.ratingRow}>
              <Text style={styles.star}>★</Text>
              <Text style={styles.rating}>{barber.rating}</Text>
              <Text style={styles.reviewCount}>{barber.reviewCount} reviews</Text>
            </View>
            <Text style={styles.bio}>{barber.bio}</Text>
          </View>
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portfolio</Text>
          <View style={styles.portfolioGrid}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={[styles.portfolioItem, cardShadow, { backgroundColor: colors.barberColors[(barber.colorIndex + i) % colors.barberColors.length] }]}>
                <Feather name="image" size={24} color="rgba(255,255,255,0.5)" />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <View style={styles.reviewsList}>
            {barber.reviews.map((r, i) => (
              <View key={i} style={[styles.reviewCard, cardShadow]}>
                <View style={styles.reviewStars}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Text key={s} style={styles.reviewStar}>★</Text>
                  ))}
                </View>
                <Text style={styles.reviewText}>"{r}"</Text>
              </View>
            ))}
          </View>
        </View>

        <Button
          title="Book with him"
          onPress={() =>
            navigation.navigate('Booking', { preselectedBarber: barber })
          }
          fullWidth
          style={styles.bookButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xxl, paddingBottom: spacing.huge },
  profileCard: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg,
    marginBottom: spacing.xxxl, overflow: 'hidden',
  },
  profileImg: {
    width: '100%', height: 220,
  },
  profileInfo: {
    padding: spacing.xl, alignItems: 'center',
  },
  initials: {
    fontSize: fontSize.huge, fontFamily: fonts.display, color: colors.white,
  },
  error: {
    fontSize: fontSize.lg, color: colors.error, textAlign: 'center',
    marginTop: spacing.huge, fontFamily: fonts.body,
  },
  name: {
    fontSize: fontSize.xxl, fontFamily: fonts.display,
    color: colors.text, marginBottom: spacing.sm,
  },
  badge: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: borderRadius.full, marginBottom: spacing.md,
  },
  badgeText: {
    fontSize: fontSize.sm, color: colors.cardTextSecondary, fontFamily: fonts.body,
  },
  ratingRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg,
  },
  star: {
    fontSize: fontSize.lg, color: colors.warning, marginRight: 4,
  },
  rating: {
    fontSize: fontSize.md, fontFamily: fonts.body, fontWeight: '600',
    color: colors.text, marginRight: 4,
  },
  reviewCount: {
    fontSize: fontSize.sm, color: colors.textTertiary, fontFamily: fonts.bodyLight,
  },
  bio: {
    fontSize: fontSize.md, color: colors.textSecondary,
    fontFamily: fonts.bodyLight, textAlign: 'center', lineHeight: 22,
  },
  section: { marginBottom: spacing.xxxl },
  sectionTitle: {
    fontSize: fontSize.xl, fontFamily: fonts.displayRegular,
    color: colors.text, marginBottom: spacing.lg,
  },
  portfolioGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm,
  },
  portfolioItem: {
    width: '47%', aspectRatio: 1, borderRadius: borderRadius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  reviewsList: { gap: spacing.sm },
  reviewCard: {
    backgroundColor: colors.card, borderRadius: borderRadius.md, padding: spacing.lg,
  },
  reviewStars: {
    flexDirection: 'row', marginBottom: spacing.sm,
  },
  reviewStar: {
    fontSize: fontSize.sm, color: colors.warning, marginRight: 2,
  },
  reviewText: {
    fontSize: fontSize.md, color: colors.cardTextSecondary,
    fontFamily: fonts.bodyLight, fontStyle: 'italic', lineHeight: 21,
  },
  bookButton: { marginTop: spacing.lg },
});
