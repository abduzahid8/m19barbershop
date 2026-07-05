import { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, TouchableOpacity, Dimensions, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { services, barbers, getTimeSlots, formatDate, formatPrice, getDayNames, Service } from '../data';
import { colors, spacing, fontSize, borderRadius, fonts, cardShadow } from '../theme';
import { useBooking } from '../state/BookingContext';
import { useApp } from '../state/AppContext';
import Button from '../components/Button';
import ServiceCard from '../components/ServiceCard';
import TimeSlot from '../components/TimeSlot';
import DayPicker from '../components/DayPicker';
import CategoryChip from '../components/CategoryChip';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Route = RouteProp<RootStackParamList, 'Booking'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_W } = Dimensions.get('window');
const CONTENT_PAD = spacing.xxl;
const CAROUSEL_W = SCREEN_W - CONTENT_PAD * 2;
const CAROUSEL_H = 280;
const PROGRESS_W = SCREEN_W - CONTENT_PAD * 2;
const SLOTS = getTimeSlots();
const CATEGORIES = ['All', 'Hair', 'Beard', 'Shave'];


function getServiceCategory(service: Service): string {
  const name = service.name.toLowerCase();
  if (name.includes('beard') || name.includes('trim')) return 'Beard';
  if (name.includes('shave') || name.includes('wash')) return 'Shave';
  if (name.includes('kids') || name.includes('haircut')) return 'Hair';
  return 'Hair';
}

function SparkleDust() {
  const sp = useRef<{ x: Animated.Value; y: Animated.Value; o: Animated.Value; s: Animated.Value }[]>([]).current;
  if (sp.length === 0) {
    for (let i = 0; i < 16; i++) {
      sp.push({
        x: new Animated.Value(0), y: new Animated.Value(0),
        o: new Animated.Value(0), s: new Animated.Value(0),
      });
    }
  }
  useEffect(() => {
    const anims = sp.map((p, i) => {
      const a = (i / sp.length) * 360 + Math.random() * 30;
      const d = 40 + Math.random() * 120;
      return Animated.parallel([
        Animated.spring(p.x, { toValue: Math.cos(a) * d, friction: 6, tension: 30, useNativeDriver: true }),
        Animated.timing(p.y, { toValue: -Math.sin(a) * d - 40, duration: 1800, useNativeDriver: true }),
        Animated.timing(p.o, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(p.o, { toValue: 0, duration: 1000, delay: 600, useNativeDriver: true }),
        Animated.spring(p.s, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
      ]);
    });
    Animated.stagger(30, anims).start();
  }, []);

  return (
    <View style={{ position: 'absolute', top: 80, left: SCREEN_W / 2, zIndex: 10 }} pointerEvents="none">
      {sp.map((p, i) => (
        <Animated.View key={i} style={{
          position: 'absolute', width: 3, height: 3, borderRadius: 1.5,
          backgroundColor: '#fff', opacity: p.o,
          transform: [{ translateX: p.x }, { translateY: p.y }, { scale: p.s }],
        }} />
      ))}
    </View>
  );
}

function ExpandingRings() {
  const rings = useRef(Array.from({ length: 3 }, () => ({
    scale: new Animated.Value(0), opacity: new Animated.Value(0),
  }))).current;

  useEffect(() => {
    rings.forEach((r, i) => {
      Animated.sequence([
        Animated.delay(i * 250),
        Animated.parallel([
          Animated.spring(r.scale, { toValue: 1, friction: 7, tension: 40, useNativeDriver: true }),
          Animated.timing(r.opacity, { toValue: 0.5, duration: 200, useNativeDriver: true }),
        ]),
        Animated.timing(r.opacity, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]).start();
    });
  }, []);

  return (
    <View style={{ position: 'absolute', top: 100, left: SCREEN_W / 2, zIndex: 5 }} pointerEvents="none">
      {rings.map((r, i) => (
        <Animated.View key={i} style={{
          position: 'absolute',
          width: 200, height: 200, marginLeft: -100, marginTop: -100,
          borderRadius: 100, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
          opacity: r.opacity,
          transform: [{ scale: r.scale }],
        }} />
      ))}
    </View>
  );
}

function WaxStamp({ scale }: { scale: Animated.Value }) {
  return (
    <Animated.View style={[styles.waxOuter, { transform: [{ scale }] }]}>
      <LinearGradient colors={['#E8A87C', '#D4A88B', '#C49070']} style={styles.waxBody}>
        <View style={styles.waxRing}>
          <Text style={styles.waxLetter}>M</Text>
        </View>
        <View style={styles.waxDrip} />
        <View style={[styles.waxDrip, styles.waxDrip2]} />
      </LinearGradient>
    </Animated.View>
  );
}

function SpotlightBeam({ active }: { active: boolean }) {
  const beamY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (active) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(beamY, { toValue: CAROUSEL_H + 50, duration: 2500, useNativeDriver: true }),
          Animated.timing(beamY, { toValue: -100, duration: 0, useNativeDriver: true }),
        ]),
        { iterations: -1 }
      ).start();
    } else {
      beamY.setValue(-100);
    }
  }, [active]);

  if (!active) return null;

  return (
    <Animated.View style={[styles.beam, { transform: [{ translateY: beamY }] }]} pointerEvents="none">
      <LinearGradient colors={['transparent', 'rgba(255,255,255,0.04)', 'transparent']} style={{ flex: 1 }} />
    </Animated.View>
  );
}

function AvatarConstellation({ barbers: bbs, selected, onSelect, onCarouselScroll }: {
  barbers: typeof barbers; selected: typeof barbers[0] | null;
  onSelect: (b: typeof barbers[0]) => void;
  onCarouselScroll: (idx: number) => void;
}) {
  const CONST_W = SCREEN_W - CONTENT_PAD * 2;
  const AVATAR_SIZE = 38;
  const total = bbs.length;
  const spacing_A = (CONST_W - AVATAR_SIZE) / (total - 1);

  return (
    <View style={styles.constellation}>
      {bbs.map((b, i) => {
        const isSel = selected?.id === b.id;
        const x = i * spacing_A;
        const yOff = i % 2 === 0 ? 0 : 8;
        return (
          <TouchableOpacity key={b.id} onPress={() => { onSelect(b); onCarouselScroll(i); }} activeOpacity={0.8}
            style={[styles.constDot, { left: x, top: yOff }]}>
            {i < total - 1 && (
              <View style={[styles.constLine, {
                width: spacing_A,
                top: AVATAR_SIZE / 2 - 0.5,
                backgroundColor: isSel ? colors.accent : colors.border,
              }]} />
            )}
            <View style={[styles.constAvatar, isSel && styles.constAvatarActive]}>
              {b.imageUrl ? (
                <Image source={{ uri: b.imageUrl }} style={styles.constImg} />
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
  barbers: typeof barbers; selected: typeof barbers[0] | null; onSelect: (b: typeof barbers[0]) => void;
}) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatRef = useRef<FlatList>(null);

  const renderItem = useCallback(({ item, index }: { item: typeof barbers[0]; index: number }) => {
    const input = [(index - 1) * CAROUSEL_W, index * CAROUSEL_W, (index + 1) * CAROUSEL_W];
    const scale = scrollX.interpolate({ inputRange: input, outputRange: [0.85, 1, 0.85], extrapolate: 'clamp' });
    const opacity = scrollX.interpolate({ inputRange: input, outputRange: [0.3, 1, 0.3], extrapolate: 'clamp' });
    const rotateY = scrollX.interpolate({ inputRange: input, outputRange: ['15deg', '0deg', '-15deg'], extrapolate: 'clamp' });
    const isSel = selected?.id === item.id;

    return (
      <TouchableOpacity onPress={() => { onSelect(item); flatRef.current?.scrollToIndex({ index, animated: true }); }} activeOpacity={1} style={{ width: CAROUSEL_W }}>
        <Animated.View style={[{ width: CAROUSEL_W, height: CAROUSEL_H, borderRadius: borderRadius.lg, overflow: 'hidden', opacity, transform: [{ scale }, { perspective: 800 }, { rotateY }] }, isSel && styles.stackSelected]}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={{ width: CAROUSEL_W, height: CAROUSEL_H }} resizeMode="cover" />
          ) : (
            <View style={{ width: CAROUSEL_W, height: CAROUSEL_H, backgroundColor: colors.barberColors[item.colorIndex % colors.barberColors.length] }} />
          )}
          <SpotlightBeam active={isSel} />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={StyleSheet.absoluteFill} pointerEvents="none" />
          <View style={styles.cardOverlay}>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardRole}>{item.specialty}</Text>
            <View style={styles.cardMeta}>
              <Text style={styles.cardStar}>★</Text>
              <Text style={styles.cardRating}>{item.rating}</Text>
              <Text style={styles.cardDot}>·</Text>
              <Text style={styles.cardReviews}>{item.reviewCount} reviews</Text>
            </View>
            <Text style={styles.cardBio} numberOfLines={1}>{item.bio}</Text>
          </View>
          {isSel && (
            <Animated.View style={styles.cardSelTag}>
              <Feather name="check" size={11} color={colors.onAccent} />
              <Text style={styles.cardSelText}>Selected</Text>
            </Animated.View>
          )}
          {isSel && (
            <Animated.View style={[styles.cardAura, { borderColor: colors.accent }]} />
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  }, [selected, onSelect, scrollX]);

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
      />
    </View>
  );
}

function MeterOrb({ count, total }: { count: number; total: number }) {
  const arc = useRef(new Animated.Value(0)).current;
  const pulsing = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(arc, { toValue: count > 0 ? 1 : 0, friction: 7, tension: 60, useNativeDriver: true }).start();
    if (count > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulsing, { toValue: 1.08, duration: 1800, useNativeDriver: true }),
          Animated.timing(pulsing, { toValue: 1, duration: 1800, useNativeDriver: true }),
        ]),
        { iterations: -1 }
      ).start();
    } else {
      pulsing.setValue(1);
    }
  }, [count]);

  return (
    <Animated.View style={[styles.orbBody, { transform: [{ scale: pulsing }] }]}>
      <View style={styles.orbRing}>
        <Animated.View style={[styles.orbFill, { opacity: arc }]} />
        <View style={styles.orbCenter}>
          <Text style={styles.orbCount}>{count}</Text>
          <Text style={styles.orbLabel}>selected</Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function BookingScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { state, selectService, selectBarber, selectDate, selectTime, nextStep, prevStep, reset } = useBooking();
  const { addAppointment } = useApp();
  const [activeCat, setActiveCat] = useState('All');
  const [showSparkle, setShowSparkle] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const sealScale = useRef(new Animated.Value(0)).current;
  const bgOpacity = useRef(new Animated.Value(0)).current;
  const stepBg = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (route.params?.preselectedBarber) selectBarber(route.params.preselectedBarber);
    return () => reset();
  }, []);

  useEffect(() => {
    slideAnim.setValue(0);
    Animated.spring(slideAnim, { toValue: 1, friction: 9, tension: 55, useNativeDriver: true }).start();
    Animated.timing(progressAnim, { toValue: (state.currentStep - 1) / 3, duration: 500, useNativeDriver: false }).start();
    Animated.timing(bgOpacity, { toValue: 1, duration: 400, useNativeDriver: false }).start();
    Animated.timing(stepBg, { toValue: state.currentStep, duration: 600, useNativeDriver: false }).start();

    if (state.currentStep === 4) {
      setShowSparkle(true);
      Animated.spring(sealScale, { toValue: 1, friction: 5, tension: 35, useNativeDriver: true }).start();
    }
    if (state.currentStep > 1) scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [state.currentStep]);

  const totalPrice = state.selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = state.selectedServices.reduce((sum, s) => sum + s.duration, 0);
  const today = getDayNames()[0]?.fullDate;
  const filtered = activeCat === 'All' ? services : services.filter((s) => getServiceCategory(s) === activeCat);

  const canProceed = () => {
    switch (state.currentStep) {
      case 1: return state.selectedServices.length > 0;
      case 2: return state.selectedBarber !== null;
      case 3: return state.selectedDate !== null && state.selectedTime !== null;
      default: return false;
    }
  };

  const handleDone = () => {
    if (!state.selectedBarber || !state.selectedDate || !state.selectedTime) return;
    addAppointment({
      barberId: state.selectedBarber.id, barberName: state.selectedBarber.name,
      serviceNames: state.selectedServices.map((s) => s.name),
      date: state.selectedDate, time: state.selectedTime, status: 'upcoming',
    });
    nextStep();
  };

  const handleClose = () => { reset(); navigation.goBack(); };
  const handleBackToHome = () => { reset(); navigation.popToTop(); };

  const bookingId = `M19-${String(Date.now()).slice(-6)}`;
  const slideStyle = { opacity: slideAnim, transform: [{ translateX: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View style={[styles.ambientBg, {
        opacity: stepBg.interpolate({ inputRange: [1, 2, 3, 4], outputRange: [0.04, 0.03, 0.02, 0.05] }),
      }]} />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {state.currentStep < 4 && (
            <TouchableOpacity onPress={state.currentStep > 1 ? prevStep : handleClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Feather name={state.currentStep > 1 ? 'arrow-left' : 'x'} size={20} color={colors.text} />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>
            {state.currentStep === 1 ? 'Menu' : state.currentStep === 2 ? 'Artist' : state.currentStep === 3 ? 'Time' : 'Seal'}
          </Text>
        </View>
        {state.currentStep < 4 && (
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>Step {state.currentStep}/3</Text>
          </View>
        )}
      </View>

      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: [0, PROGRESS_W] }) }]} />
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={styles.content} style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={slideStyle}>
          {state.currentStep === 1 && (
            <View>
              <Text style={styles.stepTitle}>What brings you in?</Text>
              <Text style={styles.stepSub}>Select one or more services to build your experience</Text>

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
                    <MeterOrb count={state.selectedServices.length} total={totalPrice} />
                    <View style={styles.tokenList}>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
                        {state.selectedServices.map((s) => (
                          <TouchableOpacity key={s.id} onPress={() => selectService(s)} style={styles.token} activeOpacity={0.8}>
                            <Feather name={s.icon as any} size={11} color={colors.cardText} />
                            <Text style={styles.tokenName}>{s.name}</Text>
                            <Feather name="x" size={11} color={colors.cardTextTertiary} />
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                  <View style={styles.tokenTotal}>
                    <Text style={styles.tokenPrice}>{formatPrice(totalPrice)}</Text>
                    <Text style={styles.tokenDur}>{totalDuration} min total</Text>
                  </View>
                </Animated.View>
              )}
            </View>
          )}

          {state.currentStep === 2 && (
            <View>
              <Text style={styles.stepTitle}>Choose your artist</Text>
              <Text style={styles.stepSub}>
                {route.params?.preselectedBarber ? `Pre-selected: ${route.params.preselectedBarber.name}` : 'Swipe through the deck, then tap to select'}
              </Text>

              <View style={{ marginHorizontal: -CONTENT_PAD, marginBottom: spacing.xl }}>
                <BarberCardStack barbers={barbers} selected={state.selectedBarber} onSelect={selectBarber} />
              </View>

              <AvatarConstellation
                barbers={barbers}
                selected={state.selectedBarber}
                onSelect={selectBarber}
                onCarouselScroll={(idx) => {}}
              />

              <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
                <TouchableOpacity onPress={() => selectBarber(null)} style={[styles.portalBtn, !state.selectedBarber && styles.portalBtnActive]} activeOpacity={0.7}>
                  {state.selectedBarber ? (
                    <Feather name="user-x" size={14} color={colors.textSecondary} />
                  ) : (
                    <View style={styles.portalRing}>
                      <View style={styles.portalDot} />
                    </View>
                  )}
                  <Text style={[styles.portalText, !state.selectedBarber && styles.portalTextActive]}>
                    {state.selectedBarber ? 'Deselect' : 'Any available artist'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {state.currentStep === 3 && (
            <View>
              <Text style={styles.stepTitle}>Pick your time</Text>
              <Text style={styles.stepSub}>Select a date and an available slot</Text>

              <DayPicker selected={state.selectedDate || today} onSelect={selectDate} />

              <View style={styles.slotList}>
                {SLOTS.map((slot) => (
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
              {showSparkle && <SparkleDust />}
              {showSparkle && <ExpandingRings />}

              <WaxStamp scale={sealScale} />

              <Animated.View style={{ opacity: sealScale, transform: [{ translateY: sealScale.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }], alignItems: 'center' }}>
                <Text style={styles.sealTitle}>Appointment sealed</Text>
                <Text style={styles.sealSub}>{state.selectedDate ? formatDate(state.selectedDate) : ''} at {state.selectedTime}</Text>
              </Animated.View>

              <Animated.View style={[styles.sealCard, cardShadow, { opacity: sealScale.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.3, 1] }) }]}>
                <View style={styles.sealCardGlow} />
                <View style={styles.sealCardEdge}>
                  <View style={styles.sealPerf} />
                  <View style={styles.sealPerf} />
                  <View style={styles.sealPerf} />
                  <View style={styles.sealPerf} />
                  <View style={styles.sealPerf} />
                </View>
                <Text style={styles.sealBookingId}>{bookingId}</Text>
                <Animated.View style={{ opacity: sealScale, transform: [{ translateY: sealScale.interpolate({ inputRange: [0, 0.5, 1], outputRange: [20, 10, 0] }) }] }}>
                  {state.selectedBarber && (
                    <View style={styles.sealRow}>
                      <Feather name="user" size={14} color={colors.cardTextSecondary} />
                      <Text style={styles.sealLabel}>Artist</Text>
                      <Text style={styles.sealValue}>{state.selectedBarber.name}</Text>
                    </View>
                  )}
                  <View style={styles.sealRow}>
                    <Feather name="scissors" size={14} color={colors.cardTextSecondary} />
                    <Text style={styles.sealLabel}>Service</Text>
                    <Text style={styles.sealValue}>{state.selectedServices.map((s) => s.name).join(', ')}</Text>
                  </View>
                  <View style={styles.sealRow}>
                    <Feather name="calendar" size={14} color={colors.cardTextSecondary} />
                    <Text style={styles.sealLabel}>Date</Text>
                    <Text style={styles.sealValue}>{state.selectedDate ? formatDate(state.selectedDate) : ''}</Text>
                  </View>
                  <View style={styles.sealRow}>
                    <Feather name="clock" size={14} color={colors.cardTextSecondary} />
                    <Text style={styles.sealLabel}>Time</Text>
                    <Text style={styles.sealValue}>{state.selectedTime}</Text>
                  </View>
                  <View style={[styles.sealRow, styles.sealRowTotal]}>
                    <Feather name="credit-card" size={14} color={colors.cardTextSecondary} />
                    <Text style={styles.sealLabel}>Total</Text>
                    <Text style={styles.sealValueTotal}>{formatPrice(totalPrice)}</Text>
                  </View>
                </Animated.View>
              </Animated.View>

              <Animated.View style={{ opacity: sealScale, width: '100%', gap: spacing.sm }}>
                <Button title="Add to calendar" variant="outline" fullWidth onPress={() => {}} />
                <Button title="Back to home" fullWidth onPress={handleBackToHome} />
              </Animated.View>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {state.currentStep < 4 && (
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            {state.selectedServices.length > 0 && (
              <View style={styles.footerSummary}>
                <Text style={styles.footerCount}>{state.selectedServices.length} service{state.selectedServices.length > 1 ? 's' : ''}</Text>
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
          <TouchableOpacity onPress={state.currentStep === 3 ? handleDone : nextStep} disabled={!canProceed()} activeOpacity={0.85} style={[styles.cta, !canProceed() && styles.ctaDisabled]}>
            <Text style={styles.ctaText}>{state.currentStep === 3 ? 'Seal booking' : 'Continue'}</Text>
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
    paddingHorizontal: CONTENT_PAD, paddingTop: spacing.lg, paddingBottom: spacing.sm,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  headerTitle: { fontSize: fontSize.xl, fontFamily: fonts.display, color: colors.text, letterSpacing: 0.5 },
  stepBadge: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: spacing.sm + 4, paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  stepBadgeText: { fontSize: fontSize.xs, fontFamily: fonts.body, fontWeight: '600', color: colors.textSecondary, letterSpacing: 0.5 },
  progressTrack: { height: 2, backgroundColor: colors.border, marginHorizontal: CONTENT_PAD, marginBottom: spacing.lg, borderRadius: 1, overflow: 'hidden' },
  progressFill: { height: 2, backgroundColor: colors.accent, borderRadius: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: CONTENT_PAD, paddingBottom: spacing.xxxl },
  stepTitle: { fontSize: fontSize.xxl, fontFamily: fonts.display, color: colors.text, marginBottom: spacing.xs },
  stepSub: { fontSize: fontSize.sm, fontFamily: fonts.bodyLight, color: colors.textSecondary, marginBottom: spacing.xl, lineHeight: 18 },
  categoryRail: { marginBottom: spacing.lg, marginLeft: -CONTENT_PAD, marginRight: -CONTENT_PAD, paddingHorizontal: CONTENT_PAD },
  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing.xs / 2 },

  tokenStrip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.card, borderRadius: borderRadius.lg,
    padding: spacing.md, marginTop: spacing.lg,
  },
  tokenLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  tokenList: { flex: 1, overflow: 'hidden' },
  token: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.surfaceAlt, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs + 1,
    borderRadius: borderRadius.full,
  },
  tokenName: { fontSize: fontSize.xs, fontFamily: fonts.body, color: colors.cardText, fontWeight: '500' },
  tokenTotal: { alignItems: 'flex-end' },
  tokenPrice: { fontSize: fontSize.lg, fontFamily: fonts.display, color: colors.cardText, lineHeight: 22 },
  tokenDur: { fontSize: fontSize.xs, fontFamily: fonts.bodyLight, color: colors.cardTextTertiary },

  orbBody: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  orbRing: { width: 46, height: 46, borderRadius: 23, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  orbFill: { position: 'absolute', top: -2, left: -2, right: -2, bottom: -2, borderRadius: 23, borderWidth: 2, borderColor: colors.cardText, borderTopColor: 'transparent', borderLeftColor: 'transparent' },
  orbCenter: { alignItems: 'center' },
  orbCount: { fontSize: fontSize.lg, fontFamily: fonts.body, fontWeight: '700', color: colors.cardText, lineHeight: 20 },
  orbLabel: { fontSize: fontSize.xs - 2, fontFamily: fonts.bodyLight, color: colors.cardTextTertiary, lineHeight: 10, marginTop: -1 },

  cardOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.lg },
  cardName: { fontSize: fontSize.xxl, fontFamily: fonts.display, color: colors.white, marginBottom: 1 },
  cardRole: { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.7)', fontFamily: fonts.bodyLight, marginBottom: spacing.xs },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  cardStar: { fontSize: fontSize.sm, color: colors.warning },
  cardRating: { fontSize: fontSize.sm, fontFamily: fonts.body, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
  cardDot: { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.4)' },
  cardReviews: { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.7)', fontFamily: fonts.bodyLight },
  cardBio: { fontSize: fontSize.xs, color: 'rgba(255,255,255,0.5)', fontFamily: fonts.bodyLight, marginTop: spacing.xs },
  cardSelTag: { position: 'absolute', top: spacing.md, right: spacing.md, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.accent, paddingHorizontal: spacing.sm + 2, paddingVertical: 3, borderRadius: borderRadius.full, zIndex: 5 },
  cardSelText: { fontSize: fontSize.xs, color: colors.onAccent, fontFamily: fonts.body, fontWeight: '600' },
  stackSelected: { borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)' },
  cardAura: { position: 'absolute', top: -3, left: -3, right: -3, bottom: -3, borderRadius: borderRadius.lg + 3, borderWidth: 1, opacity: 0.3 },

  beam: { position: 'absolute', top: 0, left: 0, right: 0, height: 40, zIndex: 2 },

  constellation: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.xl, position: 'relative', height: 80 },
  constDot: { alignItems: 'center', position: 'absolute' },
  constLine: { position: 'absolute', height: 1, left: 38 },
  constAvatar: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: 'transparent', overflow: 'hidden' },
  constAvatarActive: { borderColor: colors.accent },
  constImg: { width: 38, height: 38, borderRadius: 19 },
  constGlow: { position: 'absolute', top: -4, left: -4, right: -4, bottom: -4, borderRadius: 23, borderWidth: 2, borderColor: 'rgba(255,255,255,0.15)' },
  constName: { fontSize: fontSize.xs - 1, fontFamily: fonts.bodyLight, color: colors.textTertiary, marginTop: 2, textAlign: 'center' },

  portalBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    paddingVertical: spacing.md, borderRadius: borderRadius.full,
    borderWidth: 1, borderColor: colors.border, backgroundColor: 'transparent',
  },
  portalBtnActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  portalRing: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: colors.textSecondary, alignItems: 'center', justifyContent: 'center' },
  portalDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.textSecondary },
  portalText: { fontSize: fontSize.sm, fontFamily: fonts.bodyLight, color: colors.textSecondary },
  portalTextActive: { color: colors.onAccent, fontWeight: '600' },

  slotList: { marginTop: spacing.sm },

  sealWrap: { alignItems: 'center', paddingTop: spacing.xxl },
  waxOuter: { marginBottom: spacing.xl, zIndex: 5 },
  waxBody: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  waxRing: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  waxLetter: { fontSize: fontSize.xxl, fontFamily: fonts.display, color: colors.white, opacity: 0.9 },
  waxDrip: { position: 'absolute', bottom: -6, left: 20, width: 6, height: 10, backgroundColor: '#D4A88B', borderRadius: 3, transform: [{ rotate: '10deg' }] },
  waxDrip2: { left: 44, bottom: -4, width: 5, height: 8, transform: [{ rotate: '-8deg' }] },
  sealTitle: { fontSize: fontSize.xxl, fontFamily: fonts.display, color: colors.text, marginBottom: spacing.xs },
  sealSub: { fontSize: fontSize.md, fontFamily: fonts.bodyLight, color: colors.textSecondary, marginBottom: spacing.xxl },
  sealCard: {
    width: '100%', backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.xl,
    marginBottom: spacing.xxl, position: 'relative', overflow: 'hidden',
  },
  sealCardGlow: { position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.03)' },
  sealCardEdge: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: spacing.md },
  sealPerf: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.background, marginTop: -3 },
  sealBookingId: { fontSize: fontSize.xs, fontFamily: fonts.body, fontWeight: '600', color: colors.cardTextTertiary, marginBottom: spacing.md, letterSpacing: 2 },
  sealRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm + 2, gap: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  sealRowTotal: { borderBottomWidth: 0, paddingTop: spacing.md },
  sealLabel: { fontSize: fontSize.md, color: colors.cardTextSecondary, fontFamily: fonts.bodyLight, width: 64 },
  sealValue: { fontSize: fontSize.md, fontWeight: '600', fontFamily: fonts.body, color: colors.cardText, flex: 1, textAlign: 'right' },
  sealValueTotal: { fontSize: fontSize.lg, fontFamily: fonts.display, color: colors.cardText, flex: 1, textAlign: 'right' },
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
