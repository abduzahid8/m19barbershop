import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  Dimensions, NativeSyntheticEvent, NativeScrollEvent, Linking, Modal, Pressable, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, fonts, rs } from '../theme';
import { shopInfo } from '../data';
import ContactCard from '../components/ContactCard';
import ReviewCard from '../components/ReviewCard';
import LocationCard from '../components/LocationCard';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useLanguage } from '../i18n/LanguageContext';
import type { Lang } from '../i18n/translations';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_W } = Dimensions.get('window');
const PAD = spacing.xl;
const REVIEW_W = SCREEN_W * 0.72;
const WM_SIZE = SCREEN_W * 1.527;
const REVIEW_GAP = rs(8);

const LANGS: Lang[] = ['RU', 'UZ', 'EN'];

interface RawReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  dateIso: string;
  avatarUrl?: string;
}

// Shown until the live Yandex reviews load (or if the fetch fails and
// nothing is cached yet from a previous successful load).
const FALLBACK_REVIEWS: RawReview[] = [
  { id: '1', author: 'Дмитрий Д.', dateIso: '2026-01-21', rating: 5, text: 'Отличная стрижка! Мастер ОТТО внимательно выслушал пожелания и сделал именно так, как я хотел. Всё аккуратно, стильно и с учётом формы лица.' },
  { id: '2', author: 'Валентин Столеру', dateIso: '2025-10-11', rating: 5, text: 'Ребята красавцы, работу свою знают и делают офигенно. Обрали карточку банковскую. Так ребята 3 дня мне звонили. Дозвониться не мог, перезвонил сам.' },
  { id: '3', author: 'Илья К.', dateIso: '2025-09-03', rating: 5, text: 'Доверяю только профессионалам M19. Каждый раз выхожу с отличным настроением!' },
  { id: '4', author: 'Андрей М.', dateIso: '2025-08-15', rating: 5, text: 'Лучший барбершоп в Ташкенте! Атмосфера на высшем уровне, мастера настоящие профессионалы.' },
  { id: '5', author: 'Руслан Т.', dateIso: '2025-07-20', rating: 5, text: 'Хожу уже второй год, всегда ухожу довольным. Рекомендую всем!' },
];

const REVIEW_COLORS = ['#5C6B5A', '#5A5F6B', '#6B5A62', '#5A6B66', '#655A6B'];
const REVIEWS_CACHE_KEY = 'm19:yandexReviews:v1';

const REVIEW_LOCALE: Record<Lang, string> = { RU: 'ru-RU', UZ: 'uz-Latn', EN: 'en-US' };

function formatReviewDate(iso: string, lang: Lang): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return new Intl.DateTimeFormat(REVIEW_LOCALE[lang], {
    day: 'numeric',
    month: 'long',
    year: sameYear ? undefined : 'numeric',
  }).format(date);
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '??';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function mapApiRows(rows: unknown): RawReview[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .filter((r): r is Record<string, unknown> => !!r && typeof r === 'object')
    .filter((r) => typeof r.yandex_id === 'string' && typeof r.author === 'string' && typeof r.text === 'string')
    .map((r) => ({
      id: r.yandex_id as string,
      author: r.author as string,
      rating: typeof r.rating === 'number' ? r.rating : 5,
      text: r.text as string,
      dateIso: typeof r.review_date === 'string' ? r.review_date : new Date().toISOString().slice(0, 10),
      avatarUrl: typeof r.author_avatar_url === 'string' ? r.author_avatar_url : undefined,
    }));
}

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { lang, setLang, t } = useLanguage();
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const [rawReviews, setRawReviews] = useState<RawReview[] | null>(null);
  const [overallRating, setOverallRating] = useState<number | null>(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const shouldShowFallbackCallModal = Platform.OS !== 'ios';

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const cached = await AsyncStorage.getItem(REVIEWS_CACHE_KEY);
        if (cached && !cancelled) {
          const parsed = JSON.parse(cached);
          if (parsed && Array.isArray(parsed.reviews) && parsed.reviews.length > 0) {
            setRawReviews(parsed.reviews);
          }
          if (parsed && typeof parsed.rating === 'number') setOverallRating(parsed.rating);
        }
      } catch {}

      try {
        const res = await fetch(shopInfo.yandexReviewsUrl);
        if (!res.ok) throw new Error(`status ${res.status}`);
        const json = await res.json();
        const mapped = mapApiRows(json?.reviews);
        const rating = typeof json?.rating?.value === 'number' ? json.rating.value : null;
        if (mapped.length > 0 || rating !== null) {
          if (!cancelled) {
            if (mapped.length > 0) setRawReviews(mapped);
            if (rating !== null) setOverallRating(rating);
          }
          AsyncStorage.setItem(
            REVIEWS_CACHE_KEY,
            JSON.stringify({ reviews: mapped, rating })
          ).catch(() => {});
        }
      } catch {
        // Keep showing cached/fallback reviews if the live fetch fails.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const reviews = useMemo(() => {
    const source = rawReviews && rawReviews.length > 0 ? rawReviews : FALLBACK_REVIEWS;
    return source.map((r) => ({
      id: r.id,
      author: r.author,
      date: formatReviewDate(r.dateIso, lang),
      rating: r.rating,
      text: r.text,
      initials: getInitials(r.author),
      avatarUrl: r.avatarUrl,
    }));
  }, [rawReviews, lang]);

  const handleWriteReview = useCallback(() => {
    Linking.openURL(`${shopInfo.yandexMapsUrl}reviews/`).catch(() => {});
  }, []);

  const handleOpenLocation = useCallback(() => {
    Linking.openURL(shopInfo.yandexMapsUrl).catch(() => {});
  }, []);

  const handleCall = useCallback(async () => {
    const phone = shopInfo.phone.replace(/[^+\d]/g, '');
    const telUrl = `tel:${phone}`;
    const telPromptUrl = `telprompt:${phone}`;

    try {
      if (Platform.OS === 'ios') {
        const canUsePrompt = await Linking.canOpenURL(telPromptUrl);
        if (canUsePrompt) {
          await Linking.openURL(telPromptUrl);
          return;
        }
      }

      const canUseTel = await Linking.canOpenURL(telUrl);
      if (canUseTel) {
        await Linking.openURL(telUrl);
        return;
      }
    } catch {
      // Fall back to the device-native behavior below if unsupported.
    }

    // iOS uses the native iPhone call sheet; only show the custom fallback on non-iOS devices.
    if (shouldShowFallbackCallModal) {
      setShowCallModal(true);
    }
  }, [shouldShowFallbackCallModal]);

  const handlePerformCall = useCallback(async () => {
    const phone = shopInfo.phone.replace(/[^+\d]/g, '');
    const telUrl = `tel:${phone}`;
    const telPromptUrl = `telprompt:${phone}`;

    setShowCallModal(false);

    try {
      if (Platform.OS === 'ios') {
        const canUsePrompt = await Linking.canOpenURL(telPromptUrl);
        if (canUsePrompt) {
          await Linking.openURL(telPromptUrl);
          return;
        }
      }

      const canUseTel = await Linking.canOpenURL(telUrl);
      if (canUseTel) {
        await Linking.openURL(telUrl);
        return;
      }
    } catch {
      // Keep the number visible only on non-iOS fallback environments.
    }

    if (shouldShowFallbackCallModal) {
      setShowCallModal(true);
    }
  }, [shouldShowFallbackCallModal]);

  const handleOpenTelegram = useCallback(() => {
    Linking.openURL(shopInfo.telegramUrl).catch(() => {});
  }, []);

  const handleOpenInstagram = useCallback(() => {
    Linking.openURL(shopInfo.instagramUrl).catch(() => {});
  }, []);

  const handleOpenWebsite = useCallback(() => {
    Linking.openURL(shopInfo.websiteUrl).catch(() => {});
  }, []);

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / (REVIEW_W + REVIEW_GAP));
    setActiveReviewIdx(idx);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Watermark />

      {/* Small call modal shown when dialer can't be opened directly (e.g. iOS Simulator).
          The number is tappable so users can click to attempt calling immediately. */}
      {shouldShowFallbackCallModal && (
        <Modal visible={showCallModal} transparent animationType="fade" onRequestClose={() => setShowCallModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>{t.home.phone}</Text>
              <Pressable onPress={handlePerformCall} style={({ pressed }) => [styles.modalPhoneWrap, pressed && { opacity: 0.7 }]}>
                <Text style={styles.modalPhone}>{shopInfo.phone}</Text>
              </Pressable>
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalCallBtn} activeOpacity={0.8} onPress={handlePerformCall} accessibilityRole="button">
                  <Text style={styles.modalCallText}>{t.home.call}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalCancelBtn} activeOpacity={0.8} onPress={() => setShowCallModal(false)} accessibilityRole="button">
                  <Text style={styles.modalCancelText}>{t.home.cancel}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <View style={[styles.header, { paddingTop: spacing.xs }]}>
        <View style={styles.langRow}>
          {LANGS.map((l) => (
            <TouchableOpacity key={l} onPress={() => setLang(l)} activeOpacity={0.7}>
              <Text style={[styles.lang, lang === l && styles.langActive]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity activeOpacity={0.7} style={styles.bellBtn}>
          <Feather name="bell" size={rs(16)} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.section, styles.firstSection]}>
          <Text style={styles.sectionTitle}>{t.home.location}</Text>
          <LocationCard address={t.home.locationAddress} ctaLabel={t.home.locationCta} onPress={handleOpenLocation} />
        </View>

        <View style={styles.contactGrid}>
          <View style={styles.contactRow}>
            <ContactCard icon="phone" label={t.home.phone} value={shopInfo.phone} onPress={handleCall} />
            <ContactCard icon="send" label={t.home.telegram} value={shopInfo.telegram} onPress={handleOpenTelegram} />
          </View>
          <View style={styles.contactRow}>
            <ContactCard icon="camera" label={t.home.instagram} value={shopInfo.instagram} onPress={handleOpenInstagram} />
            <ContactCard icon="globe" label={t.home.website} value="m19.uz" onPress={handleOpenWebsite} />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>{t.home.reviewsTitle}</Text>
            <View style={styles.ratingBadge}>
              <Feather name="star" size={rs(10)} color="#F5C451" />
              <Text style={styles.ratingText}>{(overallRating ?? 4.9).toFixed(1)}</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={REVIEW_W + REVIEW_GAP}
            decelerationRate="fast"
            contentContainerStyle={styles.reviewList}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {reviews.map((r, i) => (
              <ReviewCard
                key={r.id}
                name={r.author}
                date={r.date}
                rating={r.rating}
                text={r.text}
                initials={r.initials}
                color={REVIEW_COLORS[i % REVIEW_COLORS.length]}
                width={REVIEW_W}
                avatarUrl={r.avatarUrl}
              />
            ))}
          </ScrollView>

          <View style={styles.paginationRow}>
            <View style={styles.dots}>
              {reviews.map((_, i) => (
                <View key={i} style={[styles.dot, i === activeReviewIdx && styles.dotActive]} />
              ))}
            </View>
          </View>

          <View style={styles.reviewActions}>
            <TouchableOpacity style={styles.reviewActionBtn} activeOpacity={0.7}>
              <Text style={styles.reviewActionText}>{t.home.viewAllReviews}</Text>
              <Feather name="arrow-right" size={rs(11)} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.reviewActionBtn, styles.reviewActionBtnAlt]} activeOpacity={0.7} onPress={handleWriteReview}>
              <Feather name="edit-3" size={rs(11)} color="#9FE870" />
              <Text style={[styles.reviewActionText, styles.reviewActionTextAlt]}>{t.home.writeReview}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroLabel}>{t.home.heroLabel}</Text>
          <Text style={styles.heroTitle}>{t.home.heroTitle}</Text>
          <Text style={styles.heroSub}>{t.home.heroSub}</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Booking')}
            style={styles.ctaBtn}
          >
            <Feather name="calendar" size={rs(17)} color="#0F1410" />
            <Text style={styles.ctaBtnText}>{t.home.ctaBtn}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: rs(90) + insets.bottom }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const LOGO_WATERMARK = require('../../assets/IMG_6696.png');

function Watermark() {
  return (
    <View style={styles.wmWrap} pointerEvents="none">
      <Image source={LOGO_WATERMARK} style={styles.wmBig} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  scroll: { flex: 1 },
  scrollContent: {},

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: PAD, paddingBottom: spacing.xs,
  },
  langRow: { flexDirection: 'row', alignItems: 'center', gap: rs(4) },
  lang: {
    fontSize: rs(12), fontFamily: fonts.body, color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1, paddingVertical: rs(4), paddingHorizontal: rs(7),
  },
  langActive: { color: '#9FE870', borderBottomWidth: 2, borderBottomColor: '#9FE870' },
  bellBtn: { padding: spacing.xs },

  hero: {
    alignItems: 'center', paddingTop: 0, paddingBottom: 0,
    paddingHorizontal: PAD, position: 'relative', overflow: 'hidden', minHeight: rs(170), justifyContent: 'center',
    marginTop: rs(17),
    borderTopLeftRadius: rs(19), borderTopRightRadius: rs(19),
  },
  heroLabel: {
    fontSize: rs(13), fontFamily: fonts.bodyLight, color: '#9FE870',
    letterSpacing: 3, textTransform: 'uppercase', marginBottom: rs(5), zIndex: 1,
  },
  heroTitle: {
    fontSize: rs(30), fontFamily: fonts.display, color: colors.white,
    textAlign: 'center', lineHeight: rs(34), letterSpacing: 0.4, zIndex: 1,
  },
  heroSub: {
    fontSize: rs(15), fontFamily: fonts.bodyLight, color: 'rgba(255,255,255,0.5)',
    textAlign: 'center', marginTop: rs(5), zIndex: 1,
  },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', gap: rs(9), backgroundColor: '#9FE870',
    paddingHorizontal: rs(22), paddingVertical: rs(14), borderRadius: borderRadius.full,
    marginTop: rs(14), zIndex: 1, shadowColor: '#9FE870', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 8,
  },
  ctaBtnText: { fontSize: rs(16), fontFamily: fonts.body, fontWeight: '600', color: '#0F1410' },

  contactGrid: { marginTop: rs(14), paddingHorizontal: PAD, gap: rs(7) },
  contactRow: { flexDirection: 'row', gap: rs(7) },

  section: { marginTop: rs(14), paddingHorizontal: PAD },
  firstSection: { marginTop: rs(7) },
  sectionTitle: {
    fontSize: rs(15), fontFamily: fonts.display, color: colors.white,
    letterSpacing: 0.4, marginBottom: rs(7),
  },

  reviewsHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: rs(4),
    backgroundColor: 'rgba(245,196,81,0.1)', borderWidth: 1, borderColor: 'rgba(245,196,81,0.25)',
    borderRadius: borderRadius.full, paddingHorizontal: rs(7), paddingVertical: rs(3),
    marginBottom: rs(7),
  },
  ratingText: { fontSize: rs(10), fontFamily: fonts.body, fontWeight: '600', color: '#F5C451' },

  reviewList: { paddingRight: PAD, gap: REVIEW_GAP, marginBottom: rs(7) },
  paginationRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: rs(7),
  },
  dots: { flexDirection: 'row', gap: rs(5) },
  dot: { width: rs(5), height: rs(5), borderRadius: rs(2.5), backgroundColor: 'rgba(255,255,255,0.2)' },
  dotActive: { backgroundColor: '#9FE870' },

  reviewActions: { flexDirection: 'row', gap: rs(7) },
  reviewActionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: rs(5),
    paddingVertical: rs(9), borderRadius: rs(9), borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'transparent',
  },
  reviewActionBtnAlt: { borderColor: 'rgba(159,232,112,0.35)', backgroundColor: 'rgba(159,232,112,0.06)' },
  reviewActionText: { fontSize: rs(10), fontFamily: fonts.body, color: 'rgba(255,255,255,0.7)' },
  reviewActionTextAlt: { color: '#9FE870' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  modalCard: { width: 320, backgroundColor: '#121212', borderRadius: rs(12), padding: rs(16), alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  modalTitle: { fontSize: rs(12), color: 'rgba(255,255,255,0.6)', marginBottom: rs(8) },
  modalPhoneWrap: { paddingVertical: rs(10), paddingHorizontal: rs(12), borderRadius: rs(8), backgroundColor: '#1E1E1E', minWidth: 220, alignItems: 'center' },
  modalPhone: { fontSize: rs(16), color: '#9FE870', fontFamily: fonts.body, fontWeight: '600' },
  modalActions: { flexDirection: 'row', marginTop: rs(12) },
  modalCallBtn: { backgroundColor: '#9FE870', paddingHorizontal: rs(14), paddingVertical: rs(8), borderRadius: rs(8), marginRight: rs(8) },
  modalCallText: { color: '#0F1410', fontWeight: '600' },
  modalCancelBtn: { paddingHorizontal: rs(14), paddingVertical: rs(8) },
  modalCancelText: { color: 'rgba(255,255,255,0.6)' },

  wmWrap: { ...StyleSheet.absoluteFillObject, overflow: 'hidden', zIndex: 0 },
  wmBig: {
    position: 'absolute',
    top: rs(220),
    left: '-24%',
    width: WM_SIZE,
    height: WM_SIZE,
    opacity: 0.42,
  },
});
