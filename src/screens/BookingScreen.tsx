import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, TouchableOpacity, Dimensions, FlatList, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { formatDate, formatPrice, getDayNames, Service, Barber, barberImageSrc } from '../data';
import * as api from '../services/api';
import { colors, spacing, fontSize, borderRadius, fonts, cardShadow } from '../theme';
import { useBooking } from '../state/BookingContext';
import { useApp } from '../state/AppContext';
import { useBarbers, useServices } from '../hooks/useData';
import Button from '../components/Button';
import ServiceCard from '../components/ServiceCard';
import PremiumCard from '../components/PremiumCard';
import TimeSlot from '../components/TimeSlot';
import DayPicker from '../components/DayPicker';
import CategoryChip from '../components/CategoryChip';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Route = RouteProp<RootStackParamList, 'Booking'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_W } = Dimensions.get('window');
const CONTENT_PAD = spacing.xxl;
const CAROUSEL_W = SCREEN_W - CONTENT_PAD * 2;
const CAROUSEL_H = 220;
const PROGRESS_W = SCREEN_W - CONTENT_PAD * 2;
const CATEGORIES = ['Все', 'Стрижки', 'Борода', 'Бритьё'];


function getServiceCategory(service: Service): string {
  const name = service.name.toLowerCase();
  if (name.includes('premium') || name.includes('vip') || name.includes('private')) return 'Premium';
  if (name.includes('haircut') || name.includes('kids')) return 'Стрижки';
  if (name.includes('beard') || name.includes('trim')) return 'Борода';
  if (name.includes('shave') || name.includes('wash')) return 'Бритьё';
  return 'Стрижки';
}



function AvatarConstellation({ barbers: bbs, selected, onSelect }: {
  barbers: Barber[]; selected: Barber | null;
  onSelect: (b: Barber) => void;
}) {
  const COL_WIDTH = (SCREEN_W - CONTENT_PAD * 2) / 3;
  const [failed, setFailed] = useState<Set<string>>(new Set());

  const markFailed = useCallback((id: string) => {
    setFailed((prev) => { const next = new Set(prev); next.add(id); return next; });
  }, []);

  return (
    <View style={styles.constellation}>
      {bbs.map((b, i) => {
        const isSel = selected?.id === b.id;
        const showImg = b.imageUrl && !failed.has(b.id);
        return (
          <TouchableOpacity key={b.id} onPress={() => onSelect(b)} activeOpacity={0.8}
            style={[styles.constDot, { width: COL_WIDTH }]}>
            <View style={[styles.constAvatar, isSel && styles.constAvatarActive]}>
              {showImg ? (
                <Image source={barberImageSrc(b.imageUrl)!} style={styles.constImg} onError={() => markFailed(b.id)} />
              ) : (
                <View style={[styles.constImg, { backgroundColor: colors.barberColors[b.colorIndex % colors.barberColors.length] }]} />
              )}
              {isSel && <View style={styles.constGlow} />}
            </View>
            <Text style={[styles.constName, isSel && { color: colors.accent, fontWeight: '600' }]}>{b.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function BarberCardStack({ barbers: bbs, selected, onSelect }: {
  barbers: Barber[]; selected: Barber | null; onSelect: (b: Barber) => void;
}) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatRef = useRef<FlatList>(null);
  const [failedCards, setFailedCards] = useState<Set<string>>(new Set());
  const prevSelectedId = useRef(selected?.id);

  useEffect(() => {
    if (selected && selected.id !== prevSelectedId.current) {
      const idx = bbs.findIndex((b) => b.id === selected.id);
      if (idx >= 0) {
        flatRef.current?.scrollToIndex({ index: idx, animated: true });
      }
    }
    prevSelectedId.current = selected?.id;
  }, [selected, bbs]);

  const markFailed = useCallback((id: string) => {
    setFailedCards((prev) => { const next = new Set(prev); next.add(id); return next; });
  }, []);

  const renderItem = useCallback(({ item, index }: { item: Barber; index: number }) => {
    const input = [(index - 1) * CAROUSEL_W, index * CAROUSEL_W, (index + 1) * CAROUSEL_W];
    const scale = scrollX.interpolate({ inputRange: input, outputRange: [0.85, 1, 0.85], extrapolate: 'clamp' });
    const opacity = scrollX.interpolate({ inputRange: input, outputRange: [0.3, 1, 0.3], extrapolate: 'clamp' });
    const rotateY = scrollX.interpolate({ inputRange: input, outputRange: ['15deg', '0deg', '-15deg'], extrapolate: 'clamp' });
    const isSel = selected?.id === item.id;
    const showImg = item.imageUrl && !failedCards.has(item.id);

    return (
      <TouchableOpacity onPress={() => { onSelect(item); flatRef.current?.scrollToIndex({ index, animated: true }); }} activeOpacity={1} style={{ width: CAROUSEL_W }}>
        <Animated.View style={[{ width: CAROUSEL_W, height: CAROUSEL_H, borderRadius: borderRadius.lg, overflow: 'hidden', opacity, transform: [{ scale }, { perspective: 800 }, { rotateY }] }, isSel && styles.stackSelected]}>
          {showImg ? (
            <Image source={barberImageSrc(item.imageUrl)!} style={{ width: CAROUSEL_W, height: CAROUSEL_H }} resizeMode="cover" onError={() => markFailed(item.id)} />
          ) : (
            <View style={{ width: CAROUSEL_W, height: CAROUSEL_H, backgroundColor: colors.barberColors[item.colorIndex % colors.barberColors.length] }} />
          )}
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.5)']} style={StyleSheet.absoluteFill} pointerEvents="none" />
          <View style={styles.cardOverlay}>
            <Text style={styles.cardName}>{item.name}</Text>
          </View>
          {isSel && (
            <Animated.View style={styles.cardSelTag}>
              <Feather name="check" size={11} color={colors.onAccent} />
                <Text style={styles.cardSelText}>Выбран</Text>
            </Animated.View>
          )}
          {isSel && (
            <Animated.View style={[styles.cardAura, { borderColor: colors.accent }]} />
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  }, [selected, onSelect, scrollX, failedCards, markFailed]);

  return (
    <View>
      <Animated.FlatList
        ref={flatRef}
        data={bbs}
        keyExtractor={(b) => b.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CAROUSEL_W}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: CONTENT_PAD }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        windowSize={3}
        maxToRenderPerBatch={5}
        initialNumToRender={3}
        getItemLayout={(_, index) => ({ length: CAROUSEL_W, offset: CAROUSEL_W * index, index })}
      />
    </View>
  );
}

export default function BookingScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { state, selectService, selectBarber, selectAnyBarber, selectDate, selectTime, nextStep, prevStep, reset, submitBooking } = useBooking();
  const { addAppointment } = useApp();
  const { data: services } = useServices();
  const { data: barbers } = useBarbers();
  const insets = useSafeAreaInsets();
  const [activeCat, setActiveCat] = useState('Все');
  const [summaryImgFailed, setSummaryImgFailed] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const sealScale = useRef(new Animated.Value(0)).current;
  const stepBg = useRef(new Animated.Value(0)).current;

  const today = useMemo(() => getDayNames()[0]?.fullDate, []);

  useEffect(() => {
    if (route.params?.preselectedBarber) selectBarber(route.params.preselectedBarber);
    selectDate(today);
    return () => reset();
  }, [route.params?.preselectedBarber, selectBarber, selectDate, today, reset]);

  useEffect(() => {
    slideAnim.setValue(0);
    Animated.spring(slideAnim, { toValue: 1, friction: 9, tension: 55, useNativeDriver: true }).start();
    Animated.timing(progressAnim, { toValue: (state.currentStep - 1) / 3, duration: 500, useNativeDriver: false }).start();
    Animated.timing(stepBg, { toValue: state.currentStep, duration: 600, useNativeDriver: true }).start();

    if (state.currentStep === 4) {
      Animated.spring(sealScale, { toValue: 1, friction: 5, tension: 35, useNativeDriver: true }).start();
    }
    if (state.currentStep > 1) scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [state.currentStep]);

  const totalPrice = useMemo(() => state.selectedServices.reduce((sum, s) => sum + s.price, 0), [state.selectedServices]);
  const totalDuration = useMemo(() => state.selectedServices.reduce((sum, s) => sum + s.duration, 0), [state.selectedServices]);

  const [displaySlots, setDisplaySlots] = useState<{ time: string; available: boolean }[]>([]);

  const barberForSlots = useMemo(() => {
    if (state.selectedBarber) return state.selectedBarber;
    if (state.anyBarber && barbers.length > 0) return barbers[0];
    return null;
  }, [state.selectedBarber, state.anyBarber, barbers]);

  useEffect(() => {
    if (!barberForSlots || !state.selectedDate) return;
    api.getTimeSlotsForBarber(barberForSlots.id, state.selectedDate).then((result) => {
      if (result.data) {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMin = now.getMinutes();
        const isToday = state.selectedDate === today;
        setDisplaySlots(
          result.data.filter((slot) => {
            if (!isToday) return true;
            const [h, m] = slot.time.split(':').map(Number);
            return h > currentHour || (h === currentHour && m >= currentMin);
          })
        );
      }
    });
  }, [barberForSlots?.id, state.selectedDate, today]);
  const filtered = useMemo(() =>
    activeCat === 'Все' ? services : services.filter((s) => getServiceCategory(s) === activeCat),
    [activeCat, services]
  );

  const premiumService: Service = useMemo(() => ({
    id: 'premium-private-room',
    name: 'Стрижка в VIP-комнате',
    price: 250000,
    duration: 60,
    icon: 'award',
    description: 'Эксклюзивная премиальная стрижка в отдельном VIP-кабинете',
    image: require('../../assets/services/premium.png'),
  }), []);

  const proceedDisabled = useMemo(() => {
    switch (state.currentStep) {
      case 1: return state.selectedServices.length === 0;
      case 2: return state.selectedBarber === null && !state.anyBarber;
      case 3: return state.selectedDate === null || state.selectedTime === null;
      default: return true;
    }
  }, [state.currentStep, state.selectedServices.length, state.selectedBarber, state.selectedDate, state.selectedTime, state.anyBarber]);

  const handleDone = async () => {
    if (!state.selectedDate || !state.selectedTime) return;
    const barberId = state.selectedBarber?.id || barbers[0]?.id;
    if (!barberId) return;
    const durationInSeconds = totalDuration * 60;
    const datetime = `${state.selectedDate}T${state.selectedTime}:00`;
    const submitError = await submitBooking({
      barberId,
      serviceIds: state.selectedServices.map((s) => s.id),
      datetime,
      duration: durationInSeconds || 3600,
    });
    if (submitError) return;
    const barberName = state.selectedBarber?.name || (state.anyBarber ? barbers[0]?.name : '');
    const serviceNames = state.selectedServices.map((s) => s.name);
    const err = await addAppointment({
      barberId,
      barberName,
      serviceIds: state.selectedServices.map((s) => s.id),
      serviceNames,
      datetime,
      duration: durationInSeconds || 3600,
    });
    if (err) return;
    nextStep();
  };

  const handleClose = () => { reset(); navigation.goBack(); };
  const handleBackToHome = () => { reset(); navigation.popToTop(); };

  const bookingId = `M19-${String(Date.now()).slice(-6)}`;
  const slideStyle = useMemo(() => ({
    opacity: slideAnim,
    transform: [{ translateX: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
  }), [slideAnim]);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <Animated.View style={[styles.ambientBg, {
        opacity: stepBg.interpolate({ inputRange: [1, 2, 3, 4], outputRange: [0.04, 0.03, 0.02, 0.05] }),
      }]} />

      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.headerLeft}>
          {state.currentStep < 4 && (
            <TouchableOpacity onPress={state.currentStep > 1 ? prevStep : handleClose} style={styles.closeBtn}>
              <Feather name={state.currentStep > 1 ? 'arrow-left' : 'x'} size={20} color={colors.text} />
            </TouchableOpacity>
          )}
            <Text style={styles.headerTitle}>
              {state.currentStep === 1 ? 'Услуги' : state.currentStep === 2 ? 'Мастер' : state.currentStep === 3 ? 'Время' : 'Готово'}
            </Text>
          </View>
      </View>

      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: [0, PROGRESS_W] }) }]} />
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={styles.content} style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={slideStyle}>
          {state.currentStep === 1 && (
            <View>
              <Text style={styles.stepTitle}>Услуги</Text>

              <PremiumCard
                service={premiumService}
                selected={state.selectedServices.some((x) => x.id === 'premium-private-room')}
                onPress={() => selectService(premiumService)}
              />

              <View style={styles.divider} />

              <View style={styles.categoryRail}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
                  {CATEGORIES.map((cat) => (
                    <CategoryChip key={cat} label={cat} icon="" active={activeCat === cat} onPress={() => setActiveCat(cat)} />
                  ))}
                </ScrollView>
              </View>

              <View style={styles.serviceGrid}>
                {filtered.map((s, i) => (
                  <ServiceCard key={s.id} service={s} index={i} selected={state.selectedServices.some((x) => x.id === s.id)} onPress={() => selectService(s)} />
                ))}
              </View>

              {state.selectedServices.length > 0 && (
                <Animated.View style={[styles.tokenStrip, cardShadow]}>
                  <View style={styles.tokenLeft}>
                    <View style={styles.tokenCount}>
                      <Text style={styles.tokenCountText}>{state.selectedServices.length}</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.xs }}>
                      {state.selectedServices.map((s) => (
                        <TouchableOpacity key={s.id} onPress={() => selectService(s)} style={styles.token} activeOpacity={0.8}>
                          <Text style={styles.tokenName}>{s.name}</Text>
                          <Feather name="x" size={10} color={colors.cardTextTertiary} />
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                  <Text style={styles.tokenPrice}>{formatPrice(totalPrice)}</Text>
                </Animated.View>
              )}
            </View>
          )}

          {state.currentStep === 2 && (
            <View>
              <Text style={styles.stepTitle}>Мастер</Text>

              <View style={{ marginHorizontal: -CONTENT_PAD, marginBottom: spacing.xl }}>
                <BarberCardStack barbers={barbers} selected={state.selectedBarber} onSelect={selectBarber} />
              </View>

              <AvatarConstellation
                barbers={barbers}
                selected={state.selectedBarber}
                onSelect={selectBarber}
              />

              <TouchableOpacity onPress={state.selectedBarber ? () => selectBarber(null) : selectAnyBarber} style={[styles.anyBtn, state.anyBarber && styles.anyBtnActive]} activeOpacity={0.7}>
                <Text style={[styles.anyBtnText, state.anyBarber && styles.anyBtnTextActive]}>
                  {state.selectedBarber ? 'Отменить выбор' : 'Любой мастер'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {state.currentStep === 3 && (
            <View>
              <Text style={styles.stepTitle}>Дата и время</Text>

              {state.selectedBarber && (
                <View style={styles.barberSummary}>
                  {state.selectedBarber.imageUrl && !summaryImgFailed ? (
                    <Image source={barberImageSrc(state.selectedBarber.imageUrl)!} style={styles.barberSummaryImg} onError={() => setSummaryImgFailed(true)} />
                  ) : (
                    <View style={[styles.barberSummaryImg, { backgroundColor: colors.barberColors[state.selectedBarber.colorIndex % colors.barberColors.length] }]} />
                  )}
                  <Text style={styles.barberSummaryName}>{state.selectedBarber.name}</Text>
                </View>
              )}

              <DayPicker selected={state.selectedDate || today} onSelect={selectDate} />

              <View style={styles.slotList}>
                {displaySlots.map((slot) => (
                  <TimeSlot
                    key={slot.time}
                    time={slot.time}
                    available={slot.available}
                    selected={state.selectedTime === slot.time}
                    onPress={() => selectTime(slot.time)}
                  />
                ))}
              </View>
            </View>
          )}

          {state.currentStep === 4 && (
            <View style={styles.sealWrap}>
              <Animated.View style={{ opacity: sealScale, alignItems: 'center', marginBottom: spacing.xxl }}>
                <View style={styles.sealIcon}>
                  <Feather name="check" size={28} color={colors.onAccent} />
                </View>
                <Text style={styles.sealTitle}>Запись подтверждена</Text>
                <Text style={styles.sealSub}>{state.selectedDate ? formatDate(state.selectedDate) : ''} в {state.selectedTime}</Text>
              </Animated.View>

              <Animated.View style={[styles.sealCard, cardShadow, { opacity: sealScale.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.3, 1] }) }]}>
                <Text style={styles.sealBookingId}>{bookingId}</Text>
                <View style={{ gap: spacing.sm }}>
                  {state.selectedBarber && (
                    <View style={styles.sealRow}>
                      <Text style={styles.sealLabel}>Мастер</Text>
                      <Text style={styles.sealValue}>{state.selectedBarber.name}</Text>
                    </View>
                  )}
                  <View style={styles.sealRow}>
                    <Text style={styles.sealLabel}>Услуги</Text>
                    <Text style={styles.sealValue}>{state.selectedServices.map((s) => s.name).join(', ')}</Text>
                  </View>
                  <View style={styles.sealRow}>
                    <Text style={styles.sealLabel}>Дата</Text>
                    <Text style={styles.sealValue}>{state.selectedDate ? formatDate(state.selectedDate) : ''}</Text>
                  </View>
                  <View style={[styles.sealRow, { borderBottomWidth: 0 }]}>
                    <Text style={styles.sealLabel}>Cумма</Text>
                    <Text style={styles.sealValueTotal}>{formatPrice(totalPrice)}</Text>
                  </View>
                </View>
              </Animated.View>

              <Button title="На главную" fullWidth onPress={handleBackToHome} />
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {state.currentStep < 4 && (
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            {state.selectedServices.length > 0 && (
              <View style={styles.footerSummary}>
                <Text style={styles.footerCount}>x{state.selectedServices.length}</Text>
                <Text style={styles.footerTotal}>{formatPrice(totalPrice)}</Text>
              </View>
            )}
            {state.selectedBarber && state.currentStep >= 2 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                <View style={styles.footerDot} />
                <Text style={styles.footerBarber}>{state.selectedBarber.name}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={state.currentStep === 3 ? handleDone : nextStep} disabled={proceedDisabled} activeOpacity={0.85} style={[styles.cta, proceedDisabled && styles.ctaDisabled]}>
            <Text style={styles.ctaText}>{state.currentStep === 3 ? 'Подтвердить' : 'Далее'}</Text>
            <Feather name={state.currentStep === 3 ? 'check' : 'arrow-right'} size={18} color={colors.onAccent} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  ambientBg: { position: 'absolute', top: -120, left: -60, right: -60, height: 250, backgroundColor: colors.accent, borderRadius: 250 / 2 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: CONTENT_PAD, paddingBottom: spacing.md,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  closeBtn: { padding: spacing.sm, marginLeft: -spacing.sm },
  headerTitle: { fontSize: fontSize.xl, fontFamily: fonts.display, color: colors.text, letterSpacing: 0.5 },

  progressTrack: { height: 2, backgroundColor: colors.border, marginHorizontal: CONTENT_PAD, marginBottom: spacing.lg, borderRadius: 1, overflow: 'hidden' },
  progressFill: { height: 2, backgroundColor: colors.accent, borderRadius: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: CONTENT_PAD, paddingBottom: spacing.xxxl },
  stepTitle: { fontSize: fontSize.xl, fontFamily: fonts.display, color: colors.text, marginBottom: spacing.xl },
  categoryRail: { marginBottom: spacing.md, marginLeft: -CONTENT_PAD, marginRight: -CONTENT_PAD, paddingHorizontal: CONTENT_PAD },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing.xs / 2 },

  tokenStrip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.card, borderRadius: borderRadius.md,
    padding: spacing.sm + 2, marginTop: spacing.lg,
  },
  tokenLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  tokenCount: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.cardText, alignItems: 'center', justifyContent: 'center',
  },
  tokenCountText: { fontSize: fontSize.xs, fontFamily: fonts.body, fontWeight: '700', color: colors.card },
  token: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: colors.surfaceAlt, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  tokenName: { fontSize: fontSize.xs, fontFamily: fonts.body, color: colors.cardText, fontWeight: '500' },
  tokenPrice: { fontSize: fontSize.md, fontFamily: fonts.display, color: colors.cardText },

  cardOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.md },
  cardName: { fontSize: fontSize.xl, fontFamily: fonts.display, color: colors.white },
  cardSelTag: { position: 'absolute', top: spacing.sm, right: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.accent, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full, zIndex: 5 },
  cardSelText: { fontSize: fontSize.xs, color: colors.onAccent, fontFamily: fonts.body, fontWeight: '600' },
  stackSelected: { borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)' },
  cardAura: { position: 'absolute', top: -3, left: -3, right: -3, bottom: -3, borderRadius: borderRadius.lg + 3, borderWidth: 1, opacity: 0.3 },

  constellation: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.lg },
  constDot: { alignItems: 'center', marginBottom: spacing.lg },
  constAvatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, borderColor: 'transparent', overflow: 'hidden' },
  constAvatarActive: { borderColor: colors.accent },
  constImg: { width: 72, height: 72, borderRadius: 36 },
  constGlow: { position: 'absolute', top: -4, left: -4, right: -4, bottom: -4, borderRadius: 40, borderWidth: 2, borderColor: 'rgba(255,255,255,0.15)' },
  constName: { fontSize: fontSize.xs - 2, fontFamily: fonts.bodyLight, color: colors.textTertiary, marginTop: 3, textAlign: 'center' },

  anyBtn: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: spacing.sm + 2, borderRadius: borderRadius.full,
    borderWidth: 1, borderColor: colors.border, backgroundColor: 'transparent',
  },
  anyBtnActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  anyBtnText: { fontSize: fontSize.sm, fontFamily: fonts.bodyLight, color: colors.textSecondary },
  anyBtnTextActive: { color: colors.onAccent, fontWeight: '600' },

  barberSummary: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.card, borderRadius: borderRadius.md,
    padding: spacing.sm + 2, marginBottom: spacing.lg,
  },
  barberSummaryImg: { width: 28, height: 28, borderRadius: 14 },
  barberSummaryName: { fontSize: fontSize.sm, fontFamily: fonts.body, fontWeight: '600', color: colors.text },
  slotList: { marginTop: spacing.sm },

  sealWrap: { alignItems: 'center', paddingTop: spacing.xxl },
  sealIcon: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  sealTitle: { fontSize: fontSize.xl, fontFamily: fonts.display, color: colors.text, marginBottom: spacing.xs },
  sealSub: { fontSize: fontSize.md, fontFamily: fonts.bodyLight, color: colors.textSecondary, marginBottom: spacing.xxl },
  sealCard: {
    width: '100%', backgroundColor: colors.card, borderRadius: borderRadius.md, padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  sealBookingId: { fontSize: fontSize.xs, fontFamily: fonts.body, fontWeight: '600', color: colors.cardTextTertiary, marginBottom: spacing.sm + 2, letterSpacing: 2 },
  sealRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  sealLabel: { fontSize: fontSize.sm, color: colors.cardTextSecondary, fontFamily: fonts.bodyLight },
  sealValue: { fontSize: fontSize.sm, fontWeight: '600', fontFamily: fonts.body, color: colors.cardText, flex: 1, textAlign: 'right' },
  sealValueTotal: { fontSize: fontSize.md, fontFamily: fonts.display, color: colors.cardText },
  footer: {
    paddingHorizontal: CONTENT_PAD, paddingVertical: spacing.md, paddingBottom: spacing.lg + 4,
    borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.background,
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
  },
  footerLeft: { flex: 1 },
  footerSummary: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  footerCount: { fontSize: fontSize.sm, fontFamily: fonts.body, fontWeight: '600', color: colors.text },
  footerTotal: { fontSize: fontSize.lg, fontFamily: fonts.display, color: colors.text },
  footerDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.accent },
  footerBarber: { fontSize: fontSize.xs, fontFamily: fonts.bodyLight, color: colors.textTertiary },
  cta: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.accent, paddingHorizontal: spacing.xxl, paddingVertical: spacing.md + 2,
    borderRadius: borderRadius.full,
    shadowColor: '#fff', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  ctaDisabled: { opacity: 0.3 },
  ctaText: { fontSize: fontSize.md, fontFamily: fonts.body, fontWeight: '600', color: colors.onAccent },
});
