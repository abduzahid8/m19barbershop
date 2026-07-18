import { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, fonts } from '../theme';
import { shopInfo } from '../data';
import ContactCard from '../components/ContactCard';
import ReviewCard from '../components/ReviewCard';
import LocationCard from '../components/LocationCard';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_W } = Dimensions.get('window');
const PAD = spacing.xl;
const REVIEW_W = SCREEN_W * 0.4;
const REVIEW_GAP = 8;

const LANGS = ['RU', 'UZ', 'EN'];

const FALLBACK_REVIEWS = [
  { id: '1', author: 'Дмитрий Д.', date: '21 января', rating: 5, text: 'Отличная стрижка! Мастер ОТТО внимательно выслушал пожелания и сделал именно так, как я хотел. Всё аккуратно, стильно и с учётом формы лица.', initials: 'ДД', color: '#7B8A6E' },
  { id: '2', author: 'Валентин Столеру', date: '11 октября 2025', rating: 5, text: 'Ребята красавцы, работу свою знают и делают офигенно. Обрали карточку банковскую. Так ребята 3 дня мне звонили. Дозвониться не мог, перезвонил сам.', initials: 'ВС', color: '#6E7B8A' },
  { id: '3', author: 'Илья К.', date: '3 сентября', rating: 5, text: 'Доверяю только профессионалам M19. Каждый раз выхожу с отличным настроением!', initials: 'ИК', color: '#8A6E7B' },
  { id: '4', author: 'Андрей М.', date: '15 августа', rating: 5, text: 'Лучший барбершоп в Ташкенте! Атмосфера на высшем уровне, мастера настоящие профессионалы.', initials: 'АМ', color: '#6E8A7B' },
  { id: '5', author: 'Руслан Т.', date: '20 июля', rating: 5, text: 'Хожу уже второй год, всегда ухожу довольным. Рекомендую всем!', initials: 'РТ', color: '#7B6E8A' },
];

const REVIEW_COLORS = ['#5C6B5A', '#5A5F6B', '#6B5A62', '#5A6B66', '#655A6B'];

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [lang, setLang] = useState('RU');
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  const reviews = FALLBACK_REVIEWS;

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / (REVIEW_W + REVIEW_GAP));
    setActiveReviewIdx(idx);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, { paddingTop: spacing.xs }]}>
        <View style={styles.langRow}>
          {LANGS.map((l) => (
            <TouchableOpacity key={l} onPress={() => setLang(l)} activeOpacity={0.7}>
              <Text style={[styles.lang, lang === l && styles.langActive]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity activeOpacity={0.7} style={styles.bellBtn}>
          <Feather name="bell" size={18} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Watermark />
          <Text style={styles.heroLabel}>M19  BARBERSHOP</Text>
          <Text style={styles.heroTitle}>ЗАПИСАТЬСЯ ОНЛАЙН</Text>
          <Text style={styles.heroSub}>Премиальный барбершоп в центре Ташкента</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Booking', { preselectedBarber: undefined })}
            style={styles.ctaBtn}
          >
            <Feather name="calendar" size={16} color="#0F1410" />
            <Text style={styles.ctaBtnText}>Онлайн-запись</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contactGrid}>
          <View style={styles.contactRow}>
            <ContactCard icon="phone" label="Телефон" value={shopInfo.phone} onPress={() => { }} />
            <ContactCard icon="send" label="Telegram" value="@m19_barbershop" onPress={() => { }} />
          </View>
          <View style={styles.contactRow}>
            <ContactCard icon="camera" label="Instagram" value="@m19.barbershop" onPress={() => { }} />
            <ContactCard icon="globe" label="Сайт" value="m19.uz" onPress={() => { }} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ОТЗЫВЫ КЛИЕНТОВ</Text>
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
              <Text style={styles.reviewActionText}>Смотреть все отзывы</Text>
              <Feather name="arrow-right" size={12} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.reviewActionBtn, styles.reviewActionBtnAlt]} activeOpacity={0.7}>
              <Feather name="edit-3" size={12} color="#9FE870" />
              <Text style={[styles.reviewActionText, styles.reviewActionTextAlt]}>Написать отзыв</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ЛОКАЦИЯ</Text>
          <LocationCard address="Ташкент, Мирабадский район, ул. Авлиё-Ота, 36, метро «Айбек»" onPress={() => { }} />
        </View>

        <View style={{ height: 90 + insets.bottom }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Watermark() {
  return (
    <View style={styles.wmWrap}>
      <View style={styles.wmCircle}>
        <Text style={styles.wmText}>BARBERSHOP</Text>
      </View>
      <View style={styles.wmInner}>
        <Text style={styles.wmM19}>M19</Text>
      </View>
      <View style={styles.wmCircleBottom}>
        <Text style={styles.wmText}>BARBERSHOP</Text>
      </View>
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
  langRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  lang: {
    fontSize: fontSize.sm, fontFamily: fonts.body, color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1, paddingVertical: 4, paddingHorizontal: 8,
  },
  langActive: { color: '#9FE870', borderBottomWidth: 2, borderBottomColor: '#9FE870' },
  bellBtn: { padding: spacing.xs },

  hero: {
    alignItems: 'center', paddingTop: spacing.xs, paddingBottom: spacing.sm,
    paddingHorizontal: PAD, position: 'relative', overflow: 'hidden', minHeight: 150, justifyContent: 'center',
  },
  heroLabel: {
    fontSize: 11, fontFamily: fonts.bodyLight, color: '#9FE870',
    letterSpacing: 3, textTransform: 'uppercase', marginBottom: spacing.xs, zIndex: 1,
  },
  heroTitle: {
    fontSize: 26, fontFamily: fonts.display, color: colors.white,
    textAlign: 'center', lineHeight: 30, letterSpacing: 0.5, zIndex: 1,
  },
  heroSub: {
    fontSize: fontSize.sm, fontFamily: fonts.bodyLight, color: 'rgba(255,255,255,0.5)',
    textAlign: 'center', marginTop: spacing.xs, zIndex: 1,
  },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: '#9FE870',
    paddingHorizontal: spacing.xl, paddingVertical: spacing.sm + 4, borderRadius: borderRadius.full,
    marginTop: spacing.md, zIndex: 1, shadowColor: '#9FE870', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 8,
  },
  ctaBtnText: { fontSize: fontSize.md, fontFamily: fonts.body, fontWeight: '600', color: '#0F1410' },

  contactGrid: { paddingHorizontal: PAD, gap: 8 },
  contactRow: { flexDirection: 'row', gap: 8 },

  section: { marginTop: spacing.lg, paddingHorizontal: PAD },
  sectionTitle: {
    fontSize: fontSize.lg, fontFamily: fonts.display, color: colors.white,
    letterSpacing: 0.5, marginBottom: spacing.sm,
  },

  reviewList: { paddingRight: PAD, gap: REVIEW_GAP, marginBottom: spacing.sm },
  paginationRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)' },
  dotActive: { backgroundColor: '#9FE870' },

  reviewActions: { flexDirection: 'row', gap: 8 },
  reviewActionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: spacing.sm + 2, borderRadius: borderRadius.md, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'transparent',
  },
  reviewActionBtnAlt: { borderColor: 'rgba(159,232,112,0.35)', backgroundColor: 'rgba(159,232,112,0.06)' },
  reviewActionText: { fontSize: fontSize.xs, fontFamily: fonts.body, color: 'rgba(255,255,255,0.7)' },
  reviewActionTextAlt: { color: '#9FE870' },

  wmWrap: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', zIndex: 0 },
  wmCircle: {
    width: 200, height: 200, borderRadius: 100, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)', position: 'absolute', top: -30,
    alignItems: 'center', overflow: 'hidden',
  },
  wmCircleBottom: {
    width: 200, height: 200, borderRadius: 100, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)', position: 'absolute', bottom: -30,
    alignItems: 'center', overflow: 'hidden', transform: [{ rotate: '180deg' }],
  },
  wmText: {
    fontSize: 12, fontFamily: fonts.display, color: 'rgba(255,255,255,0.04)',
    letterSpacing: 6, position: 'absolute', top: 16,
  },
  wmInner: { position: 'absolute' },
  wmM19: { fontSize: 64, fontFamily: fonts.display, color: 'rgba(255,255,255,0.03)', letterSpacing: -2 },
});
