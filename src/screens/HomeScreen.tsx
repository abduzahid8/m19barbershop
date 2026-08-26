import { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  Dimensions, NativeSyntheticEvent, NativeScrollEvent, Linking,
} from 'react-native';
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

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_W } = Dimensions.get('window');
const PAD = spacing.xl;
const REVIEW_W = SCREEN_W * 0.72;
const WM_SIZE = SCREEN_W * 1.527;
const REVIEW_GAP = rs(8);

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

  const handleWriteReview = useCallback(() => {
    Linking.openURL(`${shopInfo.yandexMapsUrl}reviews/`).catch(() => {});
  }, []);

  const handleOpenLocation = useCallback(() => {
    Linking.openURL(shopInfo.yandexMapsUrl).catch(() => {});
  }, []);

  const handleCall = useCallback(() => {
    Linking.openURL(`tel:${shopInfo.phone.replace(/[^+\d]/g, '')}`).catch(() => {});
  }, []);

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
          <Text style={styles.sectionTitle}>ЛОКАЦИЯ</Text>
          <LocationCard address="Ташкент, Мирабадский район, ул. Авлиё-Ота, 36, метро «Айбек»" onPress={handleOpenLocation} />
        </View>

        <View style={styles.contactGrid}>
          <View style={styles.contactRow}>
            <ContactCard icon="phone" label="Телефон" value={shopInfo.phone} onPress={handleCall} />
            <ContactCard icon="send" label="Telegram" value="@M19barbershop" onPress={handleOpenTelegram} />
          </View>
          <View style={styles.contactRow}>
            <ContactCard icon="camera" label="Instagram" value="@m19_barbershop" onPress={handleOpenInstagram} />
            <ContactCard icon="globe" label="Сайт" value="m19.uz" onPress={handleOpenWebsite} />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>ОТЗЫВЫ КЛИЕНТОВ</Text>
            <View style={styles.ratingBadge}>
              <Feather name="star" size={rs(10)} color="#F5C451" />
              <Text style={styles.ratingText}>4.9</Text>
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
              <Feather name="arrow-right" size={rs(11)} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.reviewActionBtn, styles.reviewActionBtnAlt]} activeOpacity={0.7} onPress={handleWriteReview}>
              <Feather name="edit-3" size={rs(11)} color="#9FE870" />
              <Text style={[styles.reviewActionText, styles.reviewActionTextAlt]}>Написать отзыв</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroLabel}>M19  BARBERSHOP</Text>
          <Text style={styles.heroTitle}>ЗАПИСАТЬСЯ ОНЛАЙН</Text>
          <Text style={styles.heroSub}>Премиальный барбершоп в центре Ташкента</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Booking', { preselectedBarber: undefined })}
            style={styles.ctaBtn}
          >
            <Feather name="calendar" size={rs(17)} color="#0F1410" />
            <Text style={styles.ctaBtnText}>Онлайн-запись</Text>
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
