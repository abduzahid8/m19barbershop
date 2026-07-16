import { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../state/AppContext';
import { formatDate, timeAgo, shopInfo, barberImageSrc } from '../data';
import { useBarbers } from '../hooks/useData';
import { colors, spacing, fontSize, borderRadius, fonts, cardShadow } from '../theme';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const { upcoming, history, shopReviews } = useApp();
  const { data: barbers } = useBarbers();
  const navigation = useNavigation<Nav>();
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [reviewsExpanded, setReviewsExpanded] = useState(false);
  const [barbersExpanded, setBarbersExpanded] = useState(false);
  const [failedAvatars, setFailedAvatars] = useState<Set<string>>(new Set());
  const [failedFavs, setFailedFavs] = useState<Set<string>>(new Set());
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const lastVisit = history.length > 0 ? history.reduce((latest, a) => a.date > latest.date ? a : latest) : null;
  const avgRating = shopReviews.length
    ? (shopReviews.reduce((s, r) => s + r.rating, 0) / shopReviews.length).toFixed(1)
    : '0.0';
  const reviewCount = shopReviews.length;
  const reviewLabel = reviewCount === 1 ? '1 отзыв' : reviewCount >= 2 && reviewCount <= 4 ? `${reviewCount} отзыва` : `${reviewCount} отзывов`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View style={{ opacity: fadeIn }}>
          <Text style={styles.title}>Профиль</Text>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>{shopInfo.name}</Text>
              <TouchableOpacity
                onPress={() => setReviewsExpanded(!reviewsExpanded)}
                activeOpacity={0.7}
                style={styles.reviewsToggle}
              >
                <Text style={styles.reviewsToggleText}>
                  {reviewLabel}
                </Text>
                <Feather
                  name={reviewsExpanded ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.reviewSummary, cardShadow]}>
              <View style={styles.reviewSummaryLeft}>
                <Text style={styles.reviewAvgRating}>{avgRating}</Text>
                <View style={styles.reviewAvgStars}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Text key={s} style={styles.reviewStarSmall}>
                      {s <= Math.round(+avgRating) ? '★' : '☆'}
                    </Text>
                  ))}
                </View>
              </View>
            </View>

            {reviewsExpanded && shopReviews.map((r) => (
              <View key={r.id} style={[styles.reviewCard, cardShadow]}>
                <View style={styles.reviewCardTop}>
                  <View style={styles.reviewAuthorRow}>
                    {r.authorAvatarUrl && !failedAvatars.has(r.id) ? (
                      <Image source={{ uri: r.authorAvatarUrl }} style={styles.reviewAvatar} onError={() => setFailedAvatars((prev) => { const n = new Set(prev); n.add(r.id); return n; })} />
                    ) : (
                      <View style={[styles.reviewAvatar, { backgroundColor: colors.barberColors[Number(r.id.slice(-1)) % 4] }]}>
                        <Text style={styles.reviewAvatarText}>{r.author[0].toUpperCase()}</Text>
                      </View>
                    )}
                    <View>
                      <Text style={styles.reviewAuthor}>{r.author}</Text>
                      <Text style={styles.reviewDate}>{formatDate(r.date)}</Text>
                    </View>
                  </View>
                  <View style={styles.reviewCardStars}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Text key={s} style={styles.reviewStarSmall}>{s <= r.rating ? '★' : '☆'}</Text>
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewCardText}>"{r.text}"</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Контакты</Text>
            <View style={[styles.contactCard, cardShadow]}>
              <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(`tel:${shopInfo.phone}`)} activeOpacity={0.7}>
                <Feather name="phone" size={16} color={colors.cardTextSecondary} />
                <Text style={styles.contactText}>{shopInfo.phone}</Text>
              </TouchableOpacity>
              <View style={styles.contactDivider} />
              <View style={styles.contactRow}>
                <Feather name="map-pin" size={16} color={colors.cardTextSecondary} />
                <Text style={styles.contactText}>{shopInfo.address}</Text>
              </View>
              <View style={styles.contactDivider} />
              <View style={styles.contactRow}>
                <Feather name="clock" size={16} color={colors.cardTextSecondary} />
                <Text style={styles.contactText}>{shopInfo.hours}</Text>
              </View>
            </View>
          </View>

          {upcoming ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Ближайшая запись</Text>
              <View style={[styles.appointmentCard, cardShadow]}>
                <View style={styles.appTop}>
                  <View style={styles.appIndicator} />
                  <Text style={styles.appStatus}>Подтверждено</Text>
                </View>
                <Text style={styles.appDate}>{formatDate(upcoming.date)}</Text>
                <Text style={styles.appDetail}>
                  {upcoming.time} · {upcoming.barberName}
                </Text>
                <Text style={styles.appServices}>{upcoming.serviceNames.join(', ')}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Ближайшая запись</Text>
              <TouchableOpacity
                style={styles.emptyAppointment}
                onPress={() => navigation.navigate('Booking', undefined)}
                activeOpacity={0.7}
              >
                <Feather name="plus-circle" size={24} color={colors.cardTextTertiary} />
                <Text style={styles.emptyAppointmentText}>Записаться впервые</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setHistoryExpanded(!historyExpanded)}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionLabel}>История посещений ({history.length})</Text>
              <Feather
                name={historyExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
            {historyExpanded && (
              <View>
                {history.length === 0 && (
                  <Text style={styles.emptyText}>Пока нет посещений</Text>
                )}
                {history.map((a) => (
                  <View key={a.id} style={styles.historyItem}>
                    <View style={styles.historyLeft}>
                      <View style={styles.historyDot} />
                      <View style={styles.historyInfo}>
                        <Text style={styles.historyDate}>{formatDate(a.date)}</Text>
                        <Text style={styles.historyDetail}>
                          {a.time} · {a.barberName}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.historyPrice}>{timeAgo(a.date)}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setBarbersExpanded(!barbersExpanded)}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionLabel}>Барберы ({barbers.length})</Text>
              <Feather
                name={barbersExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
            {barbersExpanded && barbers.map((b) => (
              <TouchableOpacity
                key={b.id}
                style={[styles.favCard, cardShadow, { marginBottom: spacing.sm }]}
                onPress={() => navigation.navigate('BarberDetail', { barberId: b.id })}
                activeOpacity={0.7}
              >
                {b.imageUrl && !failedFavs.has(b.id) ? (
                  <Image source={barberImageSrc(b.imageUrl)!} style={styles.favAvatar} onError={() => setFailedFavs((prev) => { const n = new Set(prev); n.add(b.id); return n; })} />
                ) : (
                  <View style={[styles.favAvatar, { backgroundColor: colors.barberColors[b.colorIndex], alignItems: 'center', justifyContent: 'center' }]}>
                    <Text style={styles.favInitials}>{b.name.slice(0, 2).toUpperCase()}</Text>
                  </View>
                )}
                <View style={styles.favInfo}>
                  <Text style={styles.favName}>{b.name}</Text>
                  <Text style={styles.favSpecialty}>{b.specialty}</Text>
                </View>
                <Feather name="chevron-right" size={20} color={colors.cardTextTertiary} />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
            testID="settingsBtn"
          >
            <Feather name="settings" size={18} color={colors.textSecondary} />
            <Text style={styles.settingsText}>Настройки</Text>
            <Feather name="chevron-right" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xxl, paddingBottom: spacing.huge + 80 },
  title: {
    fontSize: fontSize.xxxl, fontFamily: fonts.display, color: colors.text,
    marginBottom: spacing.xxxl, paddingTop: spacing.huge,
  },
  section: { marginBottom: spacing.xxxl },
  sectionLabel: {
    fontSize: fontSize.xs, fontFamily: fonts.body, fontWeight: '600',
    color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  appointmentCard: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.xl,
  },
  appTop: {
    flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm,
  },
  appIndicator: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success, marginRight: spacing.sm,
  },
  appStatus: {
    fontSize: fontSize.xs, color: colors.success, fontFamily: fonts.body, fontWeight: '600', letterSpacing: 1,
  },
  appDate: {
    fontSize: fontSize.xl, fontFamily: fonts.displayRegular, color: colors.cardText, marginBottom: spacing.xs,
  },
  appDetail: {
    fontSize: fontSize.md, color: colors.cardTextSecondary, fontFamily: fonts.bodyLight, marginBottom: spacing.xs,
  },
  appServices: {
    fontSize: fontSize.sm, color: colors.cardTextTertiary, fontFamily: fonts.bodyLight,
  },
  emptyAppointment: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'transparent', borderRadius: borderRadius.lg,
    borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed',
    padding: spacing.xl,
  },
  emptyAppointmentText: {
    fontSize: fontSize.md, color: colors.textTertiary, fontFamily: fonts.bodyLight, marginLeft: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.md, color: colors.cardTextTertiary, fontFamily: fonts.bodyLight, fontStyle: 'italic',
  },
  historyItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md,
  },
  historyLeft: {
    flexDirection: 'row', alignItems: 'center', flex: 1,
  },
  historyDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.surfaceAlt, marginRight: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  historyInfo: { flex: 1 },
  historyDate: {
    fontSize: fontSize.md, fontFamily: fonts.body, fontWeight: '500', color: colors.cardText, marginBottom: 2,
  },
  historyDetail: {
    fontSize: fontSize.sm, color: colors.cardTextSecondary, fontFamily: fonts.bodyLight,
  },
  historyPrice: {
    fontSize: fontSize.md, fontFamily: fonts.body, fontWeight: '600', color: colors.cardText,
  },

  favCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.lg,
  },
  favAvatar: {
    width: 48, height: 48, borderRadius: borderRadius.sm,
    marginRight: spacing.md,
  },
  favInitials: {
    fontSize: fontSize.lg, fontFamily: fonts.display, color: colors.white,
  },
  favInfo: { flex: 1 },
  favName: {
    fontSize: fontSize.md, fontFamily: fonts.body, fontWeight: '600', color: colors.cardText, marginBottom: 2,
  },
  favSpecialty: {
    fontSize: fontSize.sm, color: colors.cardTextSecondary, fontFamily: fonts.bodyLight,
  },
  reviewsToggle: {
    flexDirection: 'row', alignItems: 'center',
  },
  reviewsToggleText: {
    fontSize: fontSize.sm, fontFamily: fonts.body, color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  reviewSummary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.lg,
    marginBottom: spacing.md,
  },
  reviewSummaryLeft: { alignItems: 'flex-start' },
  reviewAvgRating: {
    fontSize: fontSize.xxl, fontFamily: fonts.display, color: colors.cardText,
  },
  reviewAvgStars: { flexDirection: 'row', marginVertical: spacing.xs },
  reviewCount: {
    fontSize: fontSize.sm, color: colors.cardTextSecondary, fontFamily: fonts.bodyLight,
  },
  reviewStarSmall: {
    fontSize: fontSize.sm, color: colors.cardText, marginRight: 2,
  },
  reviewCard: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  reviewCardTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  reviewAuthorRow: { flexDirection: 'row', alignItems: 'center' },
  reviewAvatar: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm,
  },
  reviewAvatarText: {
    fontSize: fontSize.sm, fontFamily: fonts.display, color: colors.white,
  },
  reviewAuthor: {
    fontSize: fontSize.md, fontFamily: fonts.body, fontWeight: '600', color: colors.cardText,
  },
  reviewDate: {
    fontSize: fontSize.xs, color: colors.cardTextTertiary, fontFamily: fonts.bodyLight,
  },
  reviewCardStars: { flexDirection: 'row' },
  reviewCardText: {
    fontSize: fontSize.md, fontFamily: fonts.bodyLight, color: colors.cardTextSecondary,
    lineHeight: 20,
  },
  contactCard: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.xl,
  },
  contactRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md,
  },
  contactText: {
    fontSize: fontSize.md, fontFamily: fonts.bodyLight, color: colors.cardText,
    marginLeft: spacing.md, flex: 1,
  },
  contactDivider: {
    height: 1, backgroundColor: colors.border,
  },
  settingsBtn: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.lg,
    marginTop: spacing.xxl,
  },
  settingsText: {
    flex: 1, fontSize: fontSize.md, fontFamily: fonts.body, color: colors.text, marginLeft: spacing.md,
  },
});
