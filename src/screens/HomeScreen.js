import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors, typography } from '../theme/colors';
import { scale as s } from '../theme/responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IridescentHero from '../components/IridescentHero';
import ReviewsCarousel from '../components/ReviewsCarousel';

const QUICK_ACTIONS = [
  { icon: 'scissors', label: 'Услуги', screen: 'Services', gradient: ['#102852','#1a3d7a'], color: '#FFF' },
  { icon: 'users', label: 'Мастера', screen: 'Barbers', gradient: ['#1a3d7a','#9333ea'], color: '#FFF' },
  { icon: 'image', label: 'Работы', screen: 'Gallery', gradient: ['#9333ea','#c471ed'], color: '#FFF' },
  { icon: 'user', label: 'Профиль', screen: 'Profile', gradient: ['#c471ed','#e879f9'], color: '#FFF' },
];

function Card({ icon, label, screen, onPress, gradient }) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.85}>
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.actionGrad}>
        <Feather name={icon} size={s(24)} color="#FFF" />
      </LinearGradient>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();
  const f = useRef(new Animated.Value(0)).current;
  const f2 = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(f, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    Animated.timing(f2, { toValue: 1, duration: 500, delay: 200, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: s(100) + insets.bottom }}>
        {/* IRIDESCENT HERO */}
        <IridescentHero
          uri="https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=800&q=80"
          height={s(310)}
          colors={['rgba(10,26,62,0.85)','rgba(26,61,122,0.5)','rgba(16,40,82,0.6)']}
        >
          <Animated.View style={{ opacity: f, alignItems: 'center' }}>
            <View style={styles.homeLogo}>
              <Feather name="scissors" size={s(18)} color="#FFF" />
            </View>
            <Text style={styles.homeTitle}>M19</Text>
            <Text style={styles.homeSub}>ПРЕМИУМ БАРБЕРШОП</Text>
            <View style={styles.homeStatus}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Работаем</Text>
            </View>
          </Animated.View>
        </IridescentHero>

        {/* 4 QUICK CARDS */}
        <View style={styles.cardSection}>
          <Animated.View style={{ opacity: f2, transform: [{ translateY: Animated.multiply(f2, new Animated.Value(0)).interpolate({ inputRange: [0,1], outputRange: [20,0] }) }] }}>
            <View style={styles.grid}>
              {QUICK_ACTIONS.map((a, i) => (
                <Card key={a.screen} {...a} onPress={() => nav.navigate(a.screen)} />
              ))}
            </View>
          </Animated.View>

          {/* BOOK CTA */}
          <Animated.View style={[styles.bookCta, { opacity: f2 }]}>
            <TouchableOpacity onPress={() => nav.navigate('Booking')} activeOpacity={0.85}>
              <LinearGradient colors={['#102852','#1a3d7a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.bookBtn}>
                <Feather name="calendar" size={s(16)} color="#FFF" />
                <Text style={styles.bookText}>ЗАПИСАТЬСЯ</Text>
                <Feather name="arrow-right" size={s(16)} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* REVIEWS */}
          <ReviewsCarousel />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  homeLogo: { width: s(44), height: s(44), borderRadius: s(22), backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: s(10), borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  homeTitle: { fontFamily: typography.fonts.heading, fontSize: s(34), color: '#FFF', letterSpacing: 4 },
  homeSub: { fontFamily: typography.fonts.body, fontSize: s(10), color: 'rgba(255,255,255,0.45)', letterSpacing: 3.5, marginTop: s(3) },
  homeStatus: { flexDirection: 'row', alignItems: 'center', marginTop: s(14), gap: s(6) },
  statusDot: { width: s(7), height: s(7), borderRadius: s(4), backgroundColor: '#4ade80' },
  statusText: { fontSize: s(11), fontFamily: typography.fonts.body, color: 'rgba(255,255,255,0.55)' },

  cardSection: { paddingHorizontal: s(16), paddingTop: s(16), paddingBottom: s(30) },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: s(12) },
  actionCard: { width: '47.5%', alignItems: 'center' },
  actionGrad: { width: '100%', aspectRatio: 1.4, borderRadius: s(20), alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontFamily: typography.fonts.heading, fontSize: s(12), color: colors.text, marginTop: s(8), letterSpacing: 0.5 },

  bookCta: { marginTop: s(28) },
  bookBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(10), borderRadius: 100, height: s(50) },
  bookText: { fontFamily: typography.fonts.heading, fontSize: s(12), color: '#FFF', letterSpacing: 2 },
});
