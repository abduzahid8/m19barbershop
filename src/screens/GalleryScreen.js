import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Image, TouchableOpacity,
  StatusBar, Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale as s, SCREEN_WIDTH } from '../theme/responsive';
import { colors, typography } from '../theme/colors';
import IridescentHero from '../components/IridescentHero';
import BarberDetailedCard from '../components/BarberDetailedCard';
import { detailedBarbers } from '../data/mockData';

const W = SCREEN_WIDTH;
const GAP = s(6);
const COL_W = (W - s(16) * 2 - GAP) / 2;

const TABS = [
  { key: 'masters', label: 'Мастера', icon: 'users' },
  { key: 'works', label: 'Работы', icon: 'image' },
];

const gallery = [
  { id: '1', uri: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=500&fit=crop', h: 500, tag: 'Стрижка', likes: 24 },
  { id: '2', uri: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=350&fit=crop', h: 350, tag: 'Борода', likes: 18 },
  { id: '3', uri: 'https://images.unsplash.com/photo-1598524374912-bf880ee0c45d?w=400&h=480&fit=crop', h: 480, tag: 'Стрижка', likes: 31 },
  { id: '4', uri: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=400&fit=crop', h: 400, tag: 'Укладка', likes: 12 },
  { id: '5', uri: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=360&fit=crop', h: 360, tag: 'Бритьё', likes: 8 },
  { id: '6', uri: 'https://images.unsplash.com/photo-1593702288056-99f5a24ac1f7?w=400&h=520&fit=crop', h: 520, tag: 'Комбо', likes: 45 },
  { id: '7', uri: 'https://images.unsplash.com/photo-1585747861115-5fbb78f1d3c7?w=400&h=380&fit=crop', h: 380, tag: 'Стрижка', likes: 22 },
  { id: '8', uri: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=440&fit=crop', h: 440, tag: 'Борода', likes: 16 },
  { id: '9', uri: 'https://images.unsplash.com/photo-1492446845049-9c50cc313f00?w=400&h=370&fit=crop', h: 370, tag: 'Укладка', likes: 9 },
  { id: '10', uri: 'https://images.unsplash.com/photo-1635273051914-31ccd40c5b1c?w=400&h=490&fit=crop', h: 490, tag: 'Стрижка', likes: 28 },
  { id: '11', uri: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&h=330&fit=crop', h: 330, tag: 'Бритьё', likes: 14 },
  { id: '12', uri: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fb6b8?w=400&h=420&fit=crop', h: 420, tag: 'Комбо', likes: 37 },
  { id: '13', uri: 'https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=400&h=390&fit=crop', h: 390, tag: 'Стрижка', likes: 20 },
  { id: '14', uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=430&fit=crop', h: 430, tag: 'Комбо', likes: 33 },
  { id: '15', uri: 'https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=400&h=350&fit=crop', h: 350, tag: 'Укладка', likes: 11 },
  { id: '16', uri: 'https://images.unsplash.com/photo-1507000911162-12221717e411?w=400&h=470&fit=crop', h: 470, tag: 'Стрижка', likes: 26 },
];

const FILTERS = [
  { key: 'all', label: 'Все' },
  { key: 'Стрижка', label: 'Стрижки' },
  { key: 'Борода', label: 'Борода' },
  { key: 'Комбо', label: 'Комбо' },
  { key: 'Бритьё', label: 'Бритьё' },
  { key: 'Укладка', label: 'Укладка' },
];

const leftCol = (items) => items.filter((_, i) => i % 2 === 0);
const rightCol = (items) => items.filter((_, i) => i % 2 === 1);

export default function GalleryScreen() {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('masters');
  const [filterKey, setFilterKey] = useState('all');
  const [fullImg, setFullImg] = useState(null);
  const tabSlide = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(1)).current;
  const entryFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entryFade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    const idx = TABS.findIndex(t => t.key === activeTab);
    Animated.spring(tabSlide, { toValue: idx, damping: 18, stiffness: 220, useNativeDriver: true }).start();
    contentAnim.setValue(0);
    Animated.timing(contentAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [activeTab]);

  const thumbTranslate = tabSlide.interpolate({
    inputRange: [0, 1],
    outputRange: [s(2), (SCREEN_WIDTH - s(16) * 2) / 2 + s(2)],
  });
  const thumbWidth = (SCREEN_WIDTH - s(16) * 2 - s(4)) / 2;

  const filteredGallery = filterKey === 'all' ? gallery : gallery.filter(g => g.tag === filterKey);
  const leftItems = leftCol(filteredGallery);
  const rightItems = rightCol(filteredGallery);

  const handleBook = (barber) => {
    nav.navigate('Booking', { selectedBarber: barber });
  };

  const renderWorkItem = (item, i) => {
    const imgH = (COL_W / 400) * item.h;
    return (
      <TouchableOpacity key={item.id} onPress={() => setFullImg(item.uri)} activeOpacity={0.9} style={[styles.imgWrap, { marginBottom: GAP }]}>
        <Image source={{ uri: item.uri }} style={[styles.img, { height: imgH }]} />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.55)']} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.imgOverlay} />
        <View style={styles.imgBottom}>
          <View style={styles.imgTagBadge}><Text style={styles.imgTagText}>{item.tag}</Text></View>
          <View style={styles.imgLikeRow}><Feather name="heart" size={s(10)} color="#FFF" /><Text style={styles.imgLikeText}>{item.likes}</Text></View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <IridescentHero
          uri="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80"
          height={s(200)}
          colors={['rgba(10,26,62,0.85)','rgba(26,61,122,0.5)','rgba(16,40,82,0.6)']}
        >
          <Animated.View style={{ opacity: entryFade, alignItems: 'center' }}>
            <View style={styles.heroIcon}><Feather name="users" size={s(18)} color="#FFF" /></View>
            <Text style={styles.heroTitle}>Мастера</Text>
            <Text style={styles.heroSub}>6 профессионалов в M19</Text>
          </Animated.View>
        </IridescentHero>

        <View style={styles.tabBarOuter}>
          <View style={styles.tabTrack}>
            <Animated.View style={[styles.tabThumb, { width: thumbWidth, transform: [{ translateX: thumbTranslate }] }]} />
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={styles.tabPill}
                  onPress={() => setActiveTab(tab.key)}
                  activeOpacity={0.7}
                >
                  <Feather name={tab.icon} size={s(14)} color={isActive ? '#FFF' : colors.textMuted} />
                  <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Animated.View
          style={{
            opacity: contentAnim,
            transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
          }}
        >
          {activeTab === 'masters' ? (
            <View style={styles.mastersSection}>
              {detailedBarbers.map((b) => (
                <BarberDetailedCard key={b.id} barber={b} onBook={handleBook} />
              ))}
              <Text style={styles.countLabel}>{detailedBarbers.length} мастеров</Text>
            </View>
          ) : (
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}
              >
                {FILTERS.map((f) => {
                  const isActive = filterKey === f.key;
                  return (
                    <TouchableOpacity
                      key={f.key}
                      style={[styles.filterPill, isActive && styles.filterPillActive]}
                      onPress={() => setFilterKey(f.key)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{f.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.grid}>
                <View style={styles.col}>{leftItems.map((item, i) => renderWorkItem(item, i))}</View>
                <View style={styles.col}>{rightItems.map((item, i) => renderWorkItem(item, i))}</View>
              </View>

              <Text style={styles.countLabel}>{filteredGallery.length} работ</Text>
            </View>
          )}
        </Animated.View>

        <View style={{ height: s(100) + insets.bottom }} />
      </ScrollView>

      {fullImg && (
        <TouchableOpacity style={styles.fullOverlay} activeOpacity={1} onPress={() => setFullImg(null)}>
          <TouchableOpacity style={styles.fullClose} onPress={() => setFullImg(null)} activeOpacity={0.8}>
            <Feather name="x" size={s(18)} color="#FFF" />
          </TouchableOpacity>
          <Image source={{ uri: fullImg }} style={styles.fullImg} resizeMode="contain" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  heroIcon: { width: s(40), height: s(40), borderRadius: s(20), backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: s(8) },
  heroTitle: { fontFamily: typography.fonts.heading, fontSize: s(24), color: '#FFF', letterSpacing: 2 },
  heroSub: { fontFamily: typography.fonts.body, fontSize: s(11), color: 'rgba(255,255,255,0.45)', marginTop: s(2) },

  tabBarOuter: { paddingHorizontal: s(16), paddingTop: s(14), paddingBottom: s(6), backgroundColor: colors.background },
  tabTrack: {
    flexDirection: 'row',
    backgroundColor: colors.bgCard,
    borderRadius: s(12),
    padding: s(2),
    borderWidth: 1,
    borderColor: colors.borderLight,
    position: 'relative',
  },
  tabThumb: {
    position: 'absolute',
    top: s(2),
    left: 0,
    height: s(36),
    borderRadius: s(10),
    backgroundColor: '#102852',
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    paddingVertical: s(8),
    paddingHorizontal: s(12),
    borderRadius: s(10),
    zIndex: 1,
    flex: 1,
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: s(12),
    fontFamily: typography.fonts.bodyMedium,
    color: colors.textMuted,
  },
  tabLabelActive: { color: '#FFF' },

  mastersSection: { paddingHorizontal: s(16), paddingTop: s(16) },

  filterRow: { gap: s(8), paddingHorizontal: s(16), paddingVertical: s(10) },
  filterPill: {
    paddingHorizontal: s(16), paddingVertical: s(8),
    borderRadius: 100,
    backgroundColor: colors.bgCard,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  filterPillActive: { backgroundColor: '#102852', borderColor: '#102852' },
  filterText: { fontSize: s(11), fontFamily: typography.fonts.bodyMedium, color: colors.textMuted },
  filterTextActive: { color: '#FFF' },

  grid: { flexDirection: 'row', gap: GAP, paddingHorizontal: s(16), paddingTop: s(6), paddingBottom: s(8) },
  col: { flex: 1, gap: GAP },
  imgWrap: { borderRadius: s(18), overflow: 'hidden' },
  img: { width: '100%' },
  imgOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%' },
  imgBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: s(10), paddingVertical: s(8) },
  imgTagBadge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 100, paddingHorizontal: s(8), paddingVertical: s(3) },
  imgTagText: { fontFamily: typography.fonts.bodyMedium, fontSize: s(9), color: '#FFF' },
  imgLikeRow: { flexDirection: 'row', alignItems: 'center', gap: s(3) },
  imgLikeText: { fontFamily: typography.fonts.body, fontSize: s(9), color: '#FFF' },

  countLabel: {
    textAlign: 'center',
    fontSize: s(10),
    fontFamily: typography.fonts.body,
    color: colors.textMuted,
    paddingTop: s(4),
    paddingBottom: s(20),
  },

  fullOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  fullClose: { position: 'absolute', top: s(60), right: s(20), zIndex: 101, width: s(36), height: s(36), borderRadius: s(18), backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  fullImg: { width: W, height: '80%' },
});
