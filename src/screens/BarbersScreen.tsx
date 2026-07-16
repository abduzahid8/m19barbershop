import { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, Image, Dimensions, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Barber } from '../data';
import { barberImageSrc } from '../data';
import { colors, spacing, fontSize, fonts, borderRadius, cardShadow } from '../theme';
import BarberCard from '../components/BarberCard';
import Shimmer from '../components/Shimmer';
import { useBarbers } from '../hooks/useData';
import type { RootStackParamList } from '../navigation/AppNavigator';

const { width: SCREEN_W } = Dimensions.get('window');
const CONTENT_PAD = spacing.xxl;
const HERO_W = SCREEN_W - CONTENT_PAD * 2;
const HERO_H = 420;
const DOT_SIZE = 6;

type Nav = NativeStackNavigationProp<RootStackParamList>;

function ShimmerState() {
  return (
    <View style={{ flex: 1, paddingHorizontal: CONTENT_PAD, paddingTop: spacing.xl }}>
      <Shimmer loading width={SCREEN_W * 0.9} height={28} borderRadius={4} />
      <View style={{ height: spacing.xxl }} />
      <Shimmer loading width={SCREEN_W - CONTENT_PAD * 2} height={HERO_H} borderRadius={borderRadius.xl} />
      <View style={{ height: spacing.xxl }} />
      <Shimmer loading width={120} height={18} borderRadius={4} />
      <View style={{ height: spacing.lg }} />
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {[0, 1].map((i) => (
          <Shimmer key={i} loading width={(SCREEN_W - CONTENT_PAD * 2 - spacing.sm) / 2} height={180} borderRadius={borderRadius.md} />
        ))}
      </View>
      <View style={{ height: spacing.sm }} />
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {[0, 1].map((i) => (
          <Shimmer key={i} loading width={(SCREEN_W - CONTENT_PAD * 2 - spacing.sm) / 2} height={180} borderRadius={borderRadius.md} />
        ))}
      </View>
    </View>
  );
}

function truncateText(text: string, maxWords: number) {
  const words = text.split(' ');
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
}

function HeroCard({ barber, index, scrollX }: { barber: Barber; index: number; scrollX: Animated.Value }) {
  const [heroFailed, setHeroFailed] = useState(false);
  const inputRange = [(index - 1) * HERO_W, index * HERO_W, (index + 1) * HERO_W];
  const scale = scrollX.interpolate({ inputRange, outputRange: [0.88, 1, 0.88], extrapolate: 'clamp' });
  const opacity = scrollX.interpolate({ inputRange, outputRange: [0.5, 1, 0.5], extrapolate: 'clamp' });
  const showHero = barber.imageUrl && !heroFailed;

  return (
    <Animated.View style={[{ width: HERO_W, height: HERO_H, borderRadius: borderRadius.xl, overflow: 'hidden' }, { transform: [{ scale }], opacity }]}>
      {showHero ? (
        <Image source={barberImageSrc(barber.imageUrl)!} style={{ width: HERO_W, height: HERO_H }} resizeMode="cover" onError={() => setHeroFailed(true)} />
      ) : (
        <View style={{ width: HERO_W, height: HERO_H, backgroundColor: colors.barberColors[barber.colorIndex % colors.barberColors.length] }} />
      )}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.heroContent}>
        <Text style={styles.heroName}>{barber.name}</Text>
        <Text style={styles.heroRole}>{barber.specialty}</Text>
        <View style={styles.heroMeta}>
          <Text style={styles.heroStar}>★</Text>
          <Text style={styles.heroRating}>{barber.rating}</Text>
          <Text style={styles.heroDot}>·</Text>
          <Text style={styles.heroReviews}>{barber.reviewCount} отзывов</Text>
        </View>
        <Text style={styles.heroBio} numberOfLines={2}>{truncateText(barber.bio, 8)}</Text>
      </View>
    </Animated.View>
  );
}

function Dots({ count, scrollX }: { count: number; scrollX: Animated.Value }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: count }).map((_, i) => {
        const w = scrollX.interpolate({
          inputRange: [(i - 1) * HERO_W, i * HERO_W, (i + 1) * HERO_W],
          outputRange: [DOT_SIZE, DOT_SIZE * 3, DOT_SIZE],
          extrapolate: 'clamp',
        });
        const op = scrollX.interpolate({
          inputRange: [(i - 1) * HERO_W, i * HERO_W, (i + 1) * HERO_W],
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            key={i}
            style={[styles.dot, { width: w, opacity: op, backgroundColor: op.interpolate({
              inputRange: [0.3, 1],
              outputRange: ['rgba(255,255,255,0.4)', 'rgba(255,255,255,1)'],
            }) }]}
          />
        );
      })}
    </View>
  );
}

export default function BarbersScreen() {
  const navigation = useNavigation<Nav>();
  const { data: barbers, loading: dataLoading } = useBarbers();
  const [loading, setLoading] = useState(true);
  const loadingFade = useRef(new Animated.Value(1)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (dataLoading) return;
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(loadingFade, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(contentFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]).start(() => setLoading(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [dataLoading]);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const renderHero = useCallback(({ item, index }: { item: Barber; index: number }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('BarberDetail', { barberId: item.id })}
      activeOpacity={1}
    >
      <HeroCard barber={item} index={index} scrollX={scrollX} />
    </TouchableOpacity>
  ), [navigation, scrollX]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View style={[styles.header, { opacity: loadingFade.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]}>
        <Text style={styles.title}>Наши барберы</Text>
      </Animated.View>

      <View style={{ flex: 1 }}>
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: loadingFade, pointerEvents: loading ? 'auto' : 'none' }]}>
          <ShimmerState />
        </Animated.View>

        <Animated.View style={[StyleSheet.absoluteFill, { opacity: contentFade, pointerEvents: loading ? 'none' : 'auto' }]}>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.heroSection}>
              <FlatList
                ref={flatListRef}
                data={barbers}
                keyExtractor={(b) => b.id}
                renderItem={renderHero}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={HERO_W}
                decelerationRate="fast"
                contentContainerStyle={{ paddingHorizontal: CONTENT_PAD }}
                onScroll={onScroll}
                scrollEventThrottle={16}
                windowSize={3}
                maxToRenderPerBatch={5}
                initialNumToRender={3}
              />
              <Dots count={barbers.length} scrollX={scrollX} />
            </View>

            <TouchableOpacity
              style={styles.inlineBook}
              onPress={() => navigation.navigate('Booking', undefined)}
              activeOpacity={0.85}
            >
              <Text style={styles.inlineBookText}>Записаться</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Команда</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.grid}>
              {barbers.map((barber, i) => (
                <View key={barber.id} style={styles.gridItem}>
                  <BarberCard
                    barber={barber}
                    index={i}
                    compact
                    onPress={() => navigation.navigate('BarberDetail', { barberId: barber.id })}
                  />
                </View>
              ))}
            </View>

            <View style={{ height: spacing.xxl }} />
          </ScrollView>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: CONTENT_PAD, paddingTop: spacing.huge, paddingBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxxl, fontFamily: fonts.display, color: colors.text,
  },
  scroll: {
    paddingBottom: spacing.xxxl,
  },
  heroSection: {
    marginBottom: spacing.xxl,
  },
  heroContent: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: spacing.xl + 2,
  },
  heroName: {
    fontSize: fontSize.xxxl, fontFamily: fonts.display, color: colors.white, marginBottom: 2,
  },
  heroRole: {
    fontSize: fontSize.md, color: 'rgba(255,255,255,0.9)', fontFamily: fonts.bodyLight, marginBottom: spacing.sm,
  },
  heroMeta: {
    flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm,
  },
  heroStar: {
    fontSize: fontSize.md, color: colors.warning, marginRight: 3,
  },
  heroRating: {
    fontSize: fontSize.sm, fontFamily: fonts.body, fontWeight: '600', color: colors.white, marginRight: spacing.xs,
  },
  heroDot: {
    fontSize: fontSize.sm, color: 'rgba(255,255,255,0.5)', marginRight: spacing.xs,
  },
  heroReviews: {
    fontSize: fontSize.sm, color: 'rgba(255,255,255,0.9)', fontFamily: fonts.bodyLight,
  },
  heroBio: {
    fontSize: fontSize.sm, color: 'rgba(255,255,255,0.9)', fontFamily: fonts.bodyLight, lineHeight: 18,
  },
  dotsRow: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    marginTop: spacing.lg, gap: spacing.xs,
  },
  dot: {
    height: DOT_SIZE, borderRadius: DOT_SIZE / 2,
  },
  divider: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: CONTENT_PAD, marginBottom: spacing.lg,
    gap: spacing.md,
  },
  dividerLine: {
    flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.15)',
  },
  dividerText: {
    fontSize: fontSize.sm, fontFamily: fonts.body, fontWeight: '600',
    color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1.5,
  },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: CONTENT_PAD - spacing.xs / 2,
  },
  gridItem: { width: '50%' },
  inlineBook: {
    alignItems: 'center',
    paddingHorizontal: CONTENT_PAD,
    marginBottom: spacing.xxl,
  },
  inlineBookText: {
    fontSize: fontSize.md, fontFamily: fonts.body, fontWeight: '600',
    color: colors.onAccent,
    backgroundColor: colors.accent, paddingHorizontal: spacing.xxxl + 4,
    paddingVertical: spacing.md + 2,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    shadowColor: '#fff', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
});
