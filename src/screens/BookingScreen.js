import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Image, StatusBar, Alert, ActivityIndicator, Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { scale as s, SCREEN_WIDTH } from '../theme/responsive';
import { colors, typography } from '../theme/colors';
import { services, barbers, timeSlots, bookedSlots } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const STEPS = [
  { icon: 'scissors', label: 'Услуга' },
  { icon: 'user', label: 'Мастер' },
  { icon: 'clock', label: 'Время' },
  { icon: 'check-circle', label: 'Итог' },
];

const SERVICE_IMAGES = {
  '1': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80',
  '2': 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80',
  '3': 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80',
  '4': 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80',
  '5': 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80',
  '6': 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80',
  '7': 'https://images.unsplash.com/photo-1582095133179-bfd08e2fb6b8?w=600&q=80',
  '8': 'https://images.unsplash.com/photo-1598524374912-bf880ee0c45d?w=600&q=80',
};

function getDates() {
  const dates = [];
  const days = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
  const months = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
  for (let i = 0; i < 14; i++) {
    const d = new Date(); d.setDate(d.getDate() + i);
    dates.push({ key: d.toISOString().split('T')[0], day: days[d.getDay()], date: d.getDate(), month: months[d.getMonth()] });
  }
  return dates;
}
const dates = getDates();
const TIME_GAP = s(8);
const timeSlotWidth = (SCREEN_WIDTH - s(20) * 2 - TIME_GAP * 3) / 4;

function FadeSlide({ children, delay = 0 }) {
  const o = useRef(new Animated.Value(0)).current;
  const y = useRef(new Animated.Value(15)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(o, { toValue: 1, duration: 350, delay, useNativeDriver: true }),
      Animated.timing(y, { toValue: 0, duration: 350, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return <Animated.View style={{ opacity: o, transform: [{ translateY: y }] }}>{children}</Animated.View>;
}

export default function BookingScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const params = route?.params || {};
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState(params.selectedService || null);
  const [selectedBarber, setSelectedBarber] = useState(params.selectedBarber || null);
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(progressAnim, { toValue: step / (STEPS.length - 1), damping: 18, stiffness: 200, useNativeDriver: false }).start();
  }, [step]);

  const triggerFade = () => { contentAnim.setValue(0); Animated.timing(contentAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start(); };
  const goNext = () => {
    if (step === 0 && !selectedService) return Alert.alert('Внимание','Выберите услугу');
    if (step === 1 && !selectedBarber) return Alert.alert('Внимание','Выберите мастера');
    if (step === 2 && !selectedTime) return Alert.alert('Внимание','Выберите время');
    if (step < 3) { setStep(s => s + 1); triggerFade(); }
  };
  const goBack = () => { if (step > 0) { setStep(s => s - 1); triggerFade(); } else navigation.goBack(); };
  const confirmBooking = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setConfirmed(true);
  };
  const getFilteredTimeSlots = () => timeSlots.filter(t => {
    const hour = parseInt(t.split(':')[0]);
    if (timeOfDay === 'morning') return hour < 12;
    if (timeOfDay === 'afternoon') return hour >= 12 && hour < 16;
    return hour >= 16;
  });

  const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%','100%'] });

  if (confirmed) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.successWrap}>
          <FadeSlide delay={100}>
            <View style={styles.successCircle}>
              <Feather name="check" size={s(40)} color="#FFFFFF" />
            </View>
          </FadeSlide>
          <FadeSlide delay={250}>
            <Text style={styles.successTitle}>Запись подтверждена!</Text>
            <Text style={styles.successSub}>Ждём вас в назначенное время</Text>
          </FadeSlide>
          <FadeSlide delay={400} style={styles.ticketContainer}>
            <View style={styles.ticketCurve}>
              <View style={[styles.ticketCurveCircle, styles.ticketCurveL]} />
              <View style={styles.ticketDash} />
              <View style={[styles.ticketCurveCircle, styles.ticketCurveR]} />
            </View>
            <View style={styles.ticketBody}>
              {[
                { label: 'УСЛУГА', val: selectedService?.name },
                { label: 'МАСТЕР', val: selectedBarber?.name },
                { label: 'ДАТА', val: `${selectedDate?.date} ${selectedDate?.month}` },
                { label: 'ВРЕМЯ', val: selectedTime },
              ].map((r, i) => (
                <View key={i} style={styles.ticketRow}>
                  <Text style={styles.ticketLabel}>{r.label}</Text>
                  <Text style={styles.ticketVal}>{r.val}</Text>
                </View>
              ))}
              <View style={[styles.ticketRow, { borderBottomWidth: 0, paddingTop: s(12) }]}>
                <Text style={styles.ticketTotalLabel}>ИТОГО</Text>
                <Text style={styles.ticketTotalVal}>{selectedService?.price.toLocaleString('ru-RU')} сум</Text>
              </View>
            </View>
            <View style={styles.ticketCurve}>
              <View style={[styles.ticketCurveCircle, styles.ticketCurveL]} />
              <View style={styles.ticketDash} />
              <View style={[styles.ticketCurveCircle, styles.ticketCurveR]} />
            </View>
          </FadeSlide>
          <TouchableOpacity style={styles.doneBtn} onPress={() => { setConfirmed(false); setStep(0); setSelectedService(null); setSelectedBarber(null); setSelectedTime(null); navigation.navigate('Home'); }} activeOpacity={0.88}>
            <LinearGradient colors={['#102852','#1a3d7a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.doneGrad}>
              <Text style={styles.doneText}>На главную</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn} activeOpacity={0.7}>
          <Feather name="chevron-left" size={s(18)} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerIcon}><Feather name="calendar" size={s(14)} color="#FFFFFF" /></View>
          <Text style={styles.headerTitle}>Запись</Text>
        </View>
        <View style={{ width: s(38) }} />
      </View>

      {/* STEP BAR */}
      <View style={styles.stepBarContainer}>
        <View style={styles.stepTrackBg}><Animated.View style={[styles.stepTrackFill, { width: progressWidth }]} /></View>
        <View style={styles.stepBar}>
          {STEPS.map((sItem, i) => (
            <View key={i} style={styles.stepItem}>
              <View style={[styles.stepDot, i <= step && styles.stepDotActive, i === step && styles.stepDotCurrent]}>
                {i < step ? <Feather name="check" size={s(10)} color="#FFFFFF" /> : <Feather name={sItem.icon} size={s(10)} color={i === step ? '#FFFFFF' : colors.textMuted} />}
              </View>
              <Text style={[styles.stepLabel, i === step && styles.stepLabelActive]}>{sItem.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <Animated.View style={[styles.contentWrapper, { opacity: contentAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {step === 0 && (
            <View style={styles.contentPad}>
              <Text style={styles.stepInstruction}>Выберите услугу</Text>
              {services.map((svc, i) => {
                const isSel = selectedService?.id === svc.id;
                return (
                  <FadeSlide key={svc.id} delay={i * 40}>
                    <TouchableOpacity style={[styles.selectCard, isSel && styles.selectCardActive]} onPress={() => setSelectedService(svc)} activeOpacity={0.92}>
                      <Image source={{ uri: SERVICE_IMAGES[svc.id] || SERVICE_IMAGES['1'] }} style={styles.selectImg} />
                      <View style={styles.selectInfo}>
                        <Text style={styles.selectName}>{svc.name}</Text>
                        <View style={styles.selectMeta}><Feather name="clock" size={s(8)} color={colors.textMuted} /><Text style={styles.selectMetaText}>{svc.duration} мин</Text></View>
                      </View>
                      <View style={styles.selectRight}>
                        <Text style={styles.selectPrice}>{svc.price.toLocaleString('ru-RU')}</Text>
                        <Text style={styles.selectPriceSub}>сум</Text>
                        <View style={[styles.radioOuter, isSel && styles.radioOuterActive]}>{isSel && <View style={styles.radioInner} />}</View>
                      </View>
                    </TouchableOpacity>
                  </FadeSlide>
                );
              })}
            </View>
          )}
          {step === 1 && (
            <View style={styles.contentPad}>
              <Text style={styles.stepInstruction}>Выберите мастера</Text>
              {barbers.map((b, i) => {
                const isSel = selectedBarber?.id === b.id;
                return (
                  <FadeSlide key={b.id} delay={i * 50}>
                    <TouchableOpacity style={[styles.selectCard, isSel && styles.selectCardActive, !b.available && styles.disabled]} onPress={() => b.available && setSelectedBarber(b)} activeOpacity={0.92} disabled={!b.available}>
                      <Image source={{ uri: b.avatar }} style={styles.selectImg} />
                      <View style={styles.selectInfo}>
                        <Text style={styles.selectName}>{b.name}</Text>
                        <Text style={styles.selectMetaText}>{b.experience} лет опыта</Text>
                        <View style={styles.selectMeta}><Feather name="star" size={s(8)} color="#08132A" /><Text style={styles.selectMetaText}>{b.rating}</Text></View>
                      </View>
                      <View style={styles.selectRight}>
                        <View style={[styles.statusDot, { backgroundColor: b.available ? '#34C759' : colors.textMuted }]} />
                        <View style={[styles.radioOuter, isSel && styles.radioOuterActive]}>{isSel && <View style={styles.radioInner} />}</View>
                      </View>
                    </TouchableOpacity>
                  </FadeSlide>
                );
              })}
            </View>
          )}
          {step === 2 && (
            <View style={styles.contentPad}>
              <Text style={styles.stepInstruction}>Дата и время</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll} contentContainerStyle={styles.dateContent}>
                {dates.map((d, i) => {
                  const isSel = selectedDate?.key === d.key;
                  return (
                    <TouchableOpacity key={d.key} style={[styles.dateCard, isSel && styles.dateCardActive]} onPress={() => { setSelectedDate(d); setSelectedTime(null); }} activeOpacity={0.8}>
                      <Text style={[styles.dateDay, isSel && styles.dateDayActive]}>{d.day}</Text>
                      <Text style={[styles.dateNum, isSel && styles.dateNumActive]}>{d.date}</Text>
                      <Text style={[styles.dateMon, isSel && styles.dateMonActive]}>{d.month}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <View style={styles.timeTabs}>
                {[{ id:'morning', label:'Утро' },{ id:'afternoon', label:'День' },{ id:'evening', label:'Вечер' }].map(tTab => {
                  const isActive = timeOfDay === tTab.id;
                  return (
                    <TouchableOpacity key={tTab.id} style={[styles.timeTab, isActive && styles.timeTabActive]} onPress={() => setTimeOfDay(tTab.id)} activeOpacity={0.8}>
                      <Text style={[styles.timeTabLabel, isActive && styles.timeTabLabelActive]}>{tTab.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={styles.timeGrid}>
                {getFilteredTimeSlots().map((t, i) => {
                  const booked = (bookedSlots[selectedBarber?.id] || []).includes(t);
                  const isSel = selectedTime === t;
                  return (
                    <TouchableOpacity key={t} style={[styles.timeSlot, { width: timeSlotWidth }, isSel && styles.timeSlotActive, booked && styles.timeSlotBooked]} onPress={() => !booked && setSelectedTime(t)} disabled={booked} activeOpacity={0.8}>
                      <Text style={[styles.timeText, isSel && styles.timeTextActive, booked && styles.timeTextBooked]}>{t}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
          {step === 3 && (
            <View style={styles.contentPad}>
              <Text style={styles.stepInstruction}>Подтверждение</Text>
              <FadeSlide delay={100} style={styles.voucherCard}>
                <View style={styles.voucherHeader}>
                  <View style={styles.voucherBadge}><Text style={styles.voucherBadgeText}>M19</Text></View>
                  <View><Text style={styles.voucherShop}>M19 BARBER CLUB</Text><Text style={styles.voucherSub}>VOUCHER</Text></View>
                </View>
                <View style={styles.voucherDivider}>
                  <View style={styles.divCircle} />
                  <View style={styles.divDash} />
                  <View style={styles.divCircle} />
                </View>
                <View style={styles.voucherBody}>
                  {[
                    { label: 'УСЛУГА', val: selectedService?.name, extra: `${selectedService?.duration} мин` },
                    { label: 'МАСТЕР', val: selectedBarber?.name },
                    { label: 'ДАТА', val: `${selectedDate?.date} ${selectedDate?.month}` },
                    { label: 'ВРЕМЯ', val: selectedTime },
                    { label: 'ГОСТЬ', val: user?.name || 'Гость' },
                  ].map((r, i) => (
                    <View key={i} style={styles.confirmRow}>
                      <Text style={styles.confirmLabel}>{r.label}</Text>
                      <View style={{ alignItems:'flex-end' }}><Text style={styles.confirmVal}>{r.val}</Text>{r.extra && <Text style={styles.confirmExtra}>{r.extra}</Text>}</View>
                    </View>
                  ))}
                  <View style={[styles.confirmRow, { paddingTop: s(16), borderBottomWidth: 0 }]}>
                    <Text style={styles.confirmTotalLabel}>ИТОГО</Text>
                    <Text style={styles.confirmTotal}>{selectedService?.price.toLocaleString('ru-RU')} сум</Text>
                  </View>
                </View>
              </FadeSlide>
              <TouchableOpacity style={styles.confirmBtn} onPress={confirmBooking} disabled={loading} activeOpacity={0.88}>
                <LinearGradient colors={['#102852','#1a3d7a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.confirmGrad}>
                  {loading ? <ActivityIndicator color="#FFFFFF" /> : <><Feather name="check-circle" size={s(14)} color="#FFFFFF" style={{ marginRight: s(6) }} /><Text style={styles.confirmBtnText}>Подтвердить запись</Text></>}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
          <View style={{ height: s(200) }} />
        </ScrollView>
      </Animated.View>

      {step < 3 && (
        <View style={[styles.nextWrap, { bottom: s(110) + insets.bottom }]}>
          <TouchableOpacity style={styles.nextBtn} onPress={goNext} activeOpacity={0.88}>
            <LinearGradient colors={['#102852','#1a3d7a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.nextGrad}>
              <Text style={styles.nextText}>{step === 2 ? 'Перейти к подтверждению' : 'Далее'}</Text>
              <Feather name="arrow-right" size={s(14)} color="#FFFFFF" style={{ marginLeft: s(4) }} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal: s(20), paddingVertical: s(12) },
  backBtn: { width: s(36), height: s(36), borderRadius: s(10), backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.borderLight, alignItems:'center', justifyContent:'center' },
  headerCenter: { flexDirection:'row', alignItems:'center', gap: s(6) },
  headerIcon: { width: s(28), height: s(28), borderRadius: s(14), backgroundColor: '#102852', alignItems:'center', justifyContent:'center' },
  headerTitle: { fontSize: s(15), fontFamily: typography.fonts.heading, color: colors.text },
  stepBarContainer: { paddingHorizontal: s(20), marginTop: s(6), marginBottom: s(20), height: s(50), justifyContent:'center' },
  stepTrackBg: { position:'absolute', left: s(46), right: s(46), height: s(3), backgroundColor: colors.borderLight, top: s(18), borderRadius: s(2), overflow:'hidden' },
  stepTrackFill: { height:'100%', backgroundColor:'#102852' },
  stepBar: { flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  stepItem: { alignItems:'center', zIndex: 1, width: s(60) },
  stepDot: { width: s(26), height: s(26), borderRadius: s(13), backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.borderLight, alignItems:'center', justifyContent:'center', marginBottom: s(3) },
  stepDotActive: { borderColor:'#102852', backgroundColor:'#102852' },
  stepDotCurrent: { backgroundColor:'#102852' },
  stepLabel: { fontSize: s(9), color: colors.textMuted, textTransform:'uppercase', letterSpacing: 0.3, textAlign: 'center' },
  stepLabelActive: { color: colors.text },
  contentWrapper: { flex: 1 },
  contentPad: { paddingHorizontal: s(20), paddingTop: s(4) },
  stepInstruction: { fontSize: s(15), fontFamily: typography.fonts.heading, color: colors.text, marginBottom: s(14), letterSpacing: 0.5, textTransform:'uppercase' },
  selectCard: { flexDirection:'row', alignItems:'center', backgroundColor: colors.bgCard, borderRadius: s(22), marginBottom: s(8), borderWidth: 1, borderColor: colors.borderLight, overflow:'hidden' },
  selectCardActive: { borderColor:'#102852' },
  selectImg: { width: s(64), height: s(64) },
  selectInfo: { flex: 1, paddingHorizontal: s(10), paddingVertical: s(8) },
  selectName: { fontSize: s(13), fontFamily: typography.fonts.bodyMedium, color: colors.text, marginBottom: s(3) },
  selectMeta: { flexDirection:'row', alignItems:'center', gap: s(3) },
  selectMetaText: { fontSize: s(9), color: colors.textMuted },
  selectRight: { alignItems:'center', paddingRight: s(12), gap: s(4) },
  selectPrice: { fontSize: s(13), fontFamily: typography.fonts.body, color: colors.text },
  selectPriceSub: { fontSize: s(10), color: colors.textMuted },
  radioOuter: { width: s(18), height: s(18), borderRadius: s(9), borderWidth: 1.5, borderColor: colors.border, alignItems:'center', justifyContent:'center' },
  radioOuterActive: { borderColor:'#102852' },
  radioInner: { width: s(9), height: s(9), borderRadius: s(4.5), backgroundColor:'#102852' },
  disabled: { opacity: 0.4 },
  statusDot: { width: s(8), height: s(8), borderRadius: s(4) },
  dateScroll: { marginBottom: s(16) },
  dateContent: { gap: s(6), paddingVertical: s(4) },
  dateCard: { width: s(58), alignItems:'center', borderRadius: s(14), borderWidth: 1, borderColor: colors.borderLight, backgroundColor: colors.bgCard, overflow:'hidden', paddingVertical: s(10) },
  dateCardActive: { borderColor:'#102852', backgroundColor:'#102852' },
  dateDay: { fontSize: s(9), color: colors.textMuted, marginBottom: s(3) },
  dateDayActive: { color:'#FFFFFF' },
  dateNum: { fontSize: s(18), fontFamily: typography.fonts.heading, color: colors.text },
  dateNumActive: { color:'#FFFFFF' },
  dateMon: { fontSize: s(9), color: colors.textMuted, marginTop: s(2) },
  dateMonActive: { color:'#FFFFFF' },
  timeTabs: { flexDirection:'row', backgroundColor: colors.bgCard, borderRadius: s(12), padding: s(3), marginBottom: s(16), borderWidth: 0.5, borderColor: colors.borderLight },
  timeTab: { flex: 1, paddingVertical: s(8), alignItems:'center', borderRadius: s(8) },
  timeTabActive: { backgroundColor:'#102852' },
  timeTabLabel: { fontSize: s(11), color: colors.textMuted },
  timeTabLabelActive: { color:'#FFFFFF' },
  timeGrid: { flexDirection:'row', flexWrap:'wrap', gap: s(8) },
  timeSlot: { borderRadius: 100, overflow:'hidden', backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.borderLight, alignItems:'center' },
  timeSlotActive: { borderColor:'#102852', backgroundColor:'#102852' },
  timeSlotBooked: { opacity: 0.2 },
  timeText: { paddingVertical: s(10), fontSize: s(12), color: colors.text },
  timeTextActive: { color:'#FFFFFF' },
  timeTextBooked: { color: colors.textMuted },
  voucherCard: { backgroundColor: colors.bgCard, borderRadius: s(22), borderWidth: 1, borderColor: colors.borderLight, marginBottom: s(18), overflow:'hidden' },
  voucherHeader: { flexDirection:'row', alignItems:'center', gap: s(10), padding: s(16) },
  voucherBadge: { width: s(32), height: s(32), borderRadius: s(8), backgroundColor: colors.background, alignItems:'center', justifyContent:'center' },
  voucherBadgeText: { fontFamily: typography.fonts.heading, color: colors.text, fontSize: s(12) },
  voucherShop: { fontSize: s(14), fontFamily: typography.fonts.heading, color: colors.text, letterSpacing: 0.5 },
  voucherSub: { fontSize: s(9), color: colors.textMuted, letterSpacing: 1 },
  voucherDivider: { flexDirection:'row', alignItems:'center', height: s(18), justifyContent:'center' },
  divCircle: { width: s(18), height: s(18), borderRadius: s(9), backgroundColor: colors.background },
  divDash: { flex: 1, borderStyle:'dashed', borderWidth: 0.5, borderColor: colors.border, marginHorizontal: s(-9) },
  voucherBody: { padding: s(16), paddingTop: s(8) },
  confirmRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', paddingVertical: s(8), borderBottomWidth: 1, borderColor: colors.borderLight },
  confirmLabel: { fontSize: s(9), color: colors.textMuted, letterSpacing: 0.5 },
  confirmVal: { fontSize: s(12), color: colors.text, textAlign:'right' },
  confirmExtra: { fontSize: s(10), color: colors.textMuted, marginTop: s(2) },
  confirmTotalLabel: { fontSize: s(12), color: colors.text },
  confirmTotal: { fontSize: s(16), fontFamily: typography.fonts.body, color:'#102852' },
  confirmBtn: { borderRadius: 100, overflow:'hidden' },
  confirmGrad: { paddingVertical: s(14), alignItems:'center', flexDirection:'row', justifyContent:'center' },
  confirmBtnText: { fontSize: s(13), fontFamily: typography.fonts.heading, color:'#FFFFFF', textTransform:'uppercase', letterSpacing: 0.8 },
  nextWrap: { position:'absolute', left: 0, right: 0, paddingHorizontal: s(20), paddingVertical: s(10) },
  nextBtn: { borderRadius: 100, overflow:'hidden' },
  nextGrad: { paddingVertical: s(14), alignItems:'center', flexDirection:'row', justifyContent:'center' },
  nextText: { fontSize: s(14), fontFamily: typography.fonts.heading, color:'#FFFFFF', textTransform:'uppercase', letterSpacing: 0.8 },
  successWrap: { flex: 1, alignItems:'center', justifyContent:'center', paddingHorizontal: s(24) },
  successCircle: { width: s(82), height: s(82), borderRadius: s(41), backgroundColor:'#102852', alignItems:'center', justifyContent:'center', marginBottom: s(20), alignSelf:'center' },
  successTitle: { fontSize: s(22), fontFamily: typography.fonts.heading, color: colors.text, marginBottom: s(6), textAlign:'center' },
  successSub: { fontSize: s(13), color: colors.textSecondary, marginBottom: s(24), textAlign:'center' },
  ticketContainer: { width:'100%', backgroundColor: colors.bgCard, borderRadius: s(22), borderWidth: 1, borderColor: colors.borderLight, marginBottom: s(26), overflow:'hidden' },
  ticketCurve: { flexDirection:'row', alignItems:'center', height: s(18), justifyContent:'center', paddingHorizontal: s(16) },
  ticketCurveCircle: { width: s(18), height: s(18), borderRadius: s(9), backgroundColor: colors.background },
  ticketCurveL: { alignSelf:'flex-start' },
  ticketCurveR: { alignSelf:'flex-end' },
  ticketDash: { flex: 1, borderStyle:'dashed', borderWidth: 0.5, borderColor: colors.border, marginHorizontal: s(-9) },
  ticketBody: { padding: s(16) },
  ticketRow: { flexDirection:'row', justifyContent:'space-between', paddingVertical: s(8), borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  ticketLabel: { fontSize: s(9), color: colors.textMuted, letterSpacing: 0.5 },
  ticketVal: { fontSize: s(12), color: colors.text },
  ticketTotalLabel: { fontSize: s(12), color: colors.text },
  ticketTotalVal: { fontSize: s(15), color:'#102852', fontFamily: typography.fonts.body },
  doneBtn: { width:'100%', borderRadius: 100, overflow:'hidden' },
  doneGrad: { paddingVertical: s(14), alignItems:'center' },
  doneText: { fontSize: s(14), fontFamily: typography.fonts.heading, color:'#FFFFFF', textTransform:'uppercase', letterSpacing: 0.8 },
});
