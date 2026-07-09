import { useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, Image, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import type { Barber } from '../data';
import { colors, spacing, fontSize, borderRadius, fonts } from '../theme';
import Button from '../components/Button';
import PortfolioGallery from '../components/PortfolioGallery';
import { useBarbers } from '../hooks/useData';
import type { RootStackParamList } from '../navigation/AppNavigator';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const HERO_H = SCREEN_H * 0.5;
const AVATAR_SIZE = 88;

type Route = RouteProp<RootStackParamList, 'BarberDetail'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

function StatBadge({ icon, value, label }: { icon: string; value: string | number; label: string }) {
  return (
    <View style={styles.statItem}>
      <Feather name={icon as any} size={15} color={colors.textSecondary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function BarberDetailScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { data: barbers } = useBarbers();
  const barber = barbers.find((b) => b.id === route.params.barberId) || null;

  const scrollY = useRef(new Animated.Value(0)).current;
  const pageFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(pageFade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  if (!barber) {
    return (
      <SafeAreaView style={styles.wrapper}>
        <Text style={styles.error}>Barber not found</Text>
      </SafeAreaView>
    );
  }

  const initials = barber.name.slice(0, 2).toUpperCase();
  const bgColor = colors.barberColors[barber.colorIndex % colors.barberColors.length];

  const headerOpacity = scrollY.interpolate({
    inputRange: [HERO_H * 0.3, HERO_H * 0.6],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const heroScale = scrollY.interpolate({
    inputRange: [-100, 0, HERO_H * 0.4],
    outputRange: [1.25, 1, 0.92],
    extrapolate: 'clamp',
  });
  const heroTranslate = scrollY.interpolate({
    inputRange: [-100, 0, HERO_H * 0.4],
    outputRange: [0, 0, -HERO_H * 0.12],
    extrapolate: 'clamp',
  });
  const heroFade = scrollY.interpolate({
    inputRange: [0, HERO_H * 0.35],
    outputRange: [1, 0.3],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.heroWrap, { transform: [{ scale: heroScale }, { translateY: heroTranslate }], opacity: heroFade }]}>
        {barber.imageUrl ? (
          <Image source={{ uri: barber.imageUrl }} style={styles.heroImg} resizeMode="cover" />
        ) : (
          <View style={[styles.heroImg, { backgroundColor: bgColor, alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={styles.heroInitials}>{initials}</Text>
          </View>
        )}
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.heroBotGrad} pointerEvents="none" />
        <LinearGradient colors={['rgba(0,0,0,0.3)', 'transparent']} style={styles.heroTopGrad} pointerEvents="none" />
      </Animated.View>

      <Animated.View style={[styles.compactHdr, { opacity: headerOpacity }]}>
        <BlurView intensity={85} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.compactHdrContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.compactBack}>
            <Feather name="chevron-left" size={20} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.compactName} numberOfLines={1}>{barber.name}</Text>
          <View style={{ width: 32 }} />
        </View>
      </Animated.View>

      <SafeAreaView edges={['bottom']} style={styles.safe}>
        <Animated.ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        >
          <View style={styles.backRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Feather name="arrow-left" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>

          <Animated.View style={[styles.profileSection, { opacity: pageFade }]}>
            <View style={styles.avatarWrap}>
              <View style={[styles.avatarRing, { borderColor: bgColor }]}>
                {barber.imageUrl ? (
                  <Image source={{ uri: barber.imageUrl }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, { backgroundColor: bgColor, alignItems: 'center', justifyContent: 'center' }]}>
                    <Text style={styles.avatarInitials}>{initials}</Text>
                  </View>
                )}
              </View>
              {barber.available && <View style={styles.availDot}><View style={styles.availDotInner} /></View>}
            </View>

            <Text style={styles.name}>{barber.name}</Text>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Feather name="star" size={11} color={colors.warning} />
                <Text style={styles.badgeText}>{barber.specialty}</Text>
              </View>
              {!barber.available && (
                <View style={[styles.badge, { backgroundColor: 'rgba(239,83,80,0.25)' }]}>
                  <Feather name="clock" size={11} color="#EF5350" />
                  <Text style={[styles.badgeText, { color: '#EF5350' }]}>Unavailable</Text>
                </View>
              )}
            </View>

            <View style={styles.statsRow}>
              <StatBadge icon="star" value={barber.rating} label="Rating" />
              <View style={styles.statDiv} />
              <StatBadge icon="message-square" value={barber.reviewCount} label="Reviews" />
              <View style={styles.statDiv} />
              <StatBadge icon="award" value="Pro" label="Level" />
            </View>

            <Text style={styles.bio}>{barber.bio}</Text>
          </Animated.View>

          <View style={styles.section}>
            <PortfolioGallery images={barber.portfolio} colorIndex={barber.colorIndex} />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHdr}>
              <Feather name="message-circle" size={17} color={colors.textSecondary} />
              <Text style={styles.sectionTitle}>Reviews</Text>
              <Text style={styles.sectionCount}>{barber.reviewCount}</Text>
            </View>
            <View style={styles.reviewsList}>
              {barber.reviews.map((r, i) => (
                <View key={i} style={styles.reviewCard}>
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

          <View style={{ height: 110 }} />
        </Animated.ScrollView>

        <View style={styles.bottomBar}>
          <Button
            title={barber.available ? 'Book with him' : 'Not available'}
            onPress={() => {
              if (barber.available) navigation.navigate('Booking', { preselectedBarber: barber });
            }}
            fullWidth
            disabled={!barber.available}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: colors.background },

  heroWrap: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: HERO_H, zIndex: 0,
  },
  heroImg: { width: SCREEN_W, height: HERO_H },
  heroBotGrad: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: HERO_H * 0.55,
  },
  heroTopGrad: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 100,
  },
  heroInitials: {
    fontSize: fontSize.massive, fontFamily: fonts.display, color: colors.white,
  },

  compactHdr: {
    position: 'absolute', top: 0, left: 0, right: 0,
    zIndex: 10, height: Platform.OS === 'ios' ? 88 : 64,
    overflow: 'hidden',
  },
  compactHdrContent: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 44 : spacing.xl,
    paddingHorizontal: spacing.md,
  },
  compactBack: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  compactName: {
    flex: 1, textAlign: 'center',
    fontSize: fontSize.md, fontFamily: fonts.body, fontWeight: '600',
    color: colors.white,
  },

  safe: { flex: 1, zIndex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: HERO_H - 50 },

  backRow: {
    paddingHorizontal: spacing.xl, paddingBottom: spacing.sm,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },

  profileSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  avatarWrap: {
    marginTop: -AVATAR_SIZE / 2 - 8,
    marginBottom: spacing.lg,
  },
  avatarRing: {
    width: AVATAR_SIZE + 4, height: AVATAR_SIZE + 4,
    borderRadius: (AVATAR_SIZE + 4) / 2,
    borderWidth: 3,
    alignItems: 'center', justifyContent: 'center',
  },
  avatar: {
    width: AVATAR_SIZE, height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarInitials: {
    fontSize: fontSize.xxl, fontFamily: fonts.display, color: colors.white,
  },
  availDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  availDotInner: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: '#4CAF50',
  },

  name: {
    fontSize: fontSize.xxxl, fontFamily: fonts.display,
    color: colors.text, marginBottom: spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl,
  },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: fonts.body, fontWeight: '500',
  },

  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg, paddingHorizontal: spacing.md,
    marginBottom: spacing.xl, width: '100%',
  },
  statItem: { flex: 1, alignItems: 'center', gap: 3 },
  statValue: {
    fontSize: fontSize.lg, fontFamily: fonts.display,
    color: colors.text, fontWeight: '600',
  },
  statLabel: {
    fontSize: fontSize.xs, color: colors.textTertiary, fontFamily: fonts.bodyLight,
  },
  statDiv: {
    width: 1, height: 30,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  bio: {
    fontSize: fontSize.md, color: colors.textSecondary,
    fontFamily: fonts.bodyLight, textAlign: 'center',
    lineHeight: 24, paddingHorizontal: spacing.sm,
  },

  section: { marginBottom: spacing.xxl },
  sectionHdr: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingHorizontal: spacing.xl, marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.xl, fontFamily: fonts.displayRegular,
    color: colors.text,
  },
  sectionCount: {
    fontSize: fontSize.sm, color: colors.textTertiary,
    fontFamily: fonts.bodyLight, marginLeft: 'auto',
  },

  reviewsList: { gap: spacing.sm, paddingHorizontal: spacing.xl },
  reviewCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
  },
  reviewStars: {
    flexDirection: 'row', marginBottom: spacing.sm,
  },
  reviewStar: {
    fontSize: fontSize.sm, color: colors.warning, marginRight: 2,
  },
  reviewText: {
    fontSize: fontSize.md, color: colors.textSecondary,
    fontFamily: fonts.bodyLight, fontStyle: 'italic',
    lineHeight: 22,
  },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? spacing.xxl + 10 : spacing.xxl,
    paddingTop: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)',
  },

  error: {
    fontSize: fontSize.lg, color: colors.error, textAlign: 'center',
    marginTop: spacing.huge, fontFamily: fonts.body,
  },
});
