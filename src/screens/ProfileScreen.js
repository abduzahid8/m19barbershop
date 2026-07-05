import React, { useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  StatusBar, Alert, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale as s } from '../theme/responsive';
import { colors, typography } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import IridescentHero from '../components/IridescentHero';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const f = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(f, { toValue: 1, duration: 500, useNativeDriver: true }).start(); }, []);
  const handleSignOut = () => {
    Alert.alert('Выход', 'Вы уверены?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Выйти', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: s(100) + insets.bottom }}>
        <IridescentHero
          uri="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80"
          height={s(260) + insets.top}
          colors={['rgba(10,26,62,0.88)','rgba(26,61,122,0.5)','rgba(16,40,82,0.6)']}
        >
          <Animated.View style={{ opacity: f, alignItems: 'center', paddingTop: insets.top + s(10) }}>
            <View style={styles.avatar}>
              <View style={styles.avatarInner}>
                <Feather name="user" size={s(24)} color="#FFF" />
              </View>
              <View style={styles.onlineDot} />
            </View>
            <Text style={styles.userName}>{user?.name || 'Гость'}</Text>
            <Text style={styles.userPhone}>{user?.phone || '+998 __ ___ __ __'}</Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}><Text style={styles.statVal}>12</Text><Text style={styles.statLabel}>Визиты</Text></View>
              <View style={styles.statDev} />
              <View style={styles.stat}><Text style={styles.statVal}>4.9</Text><Text style={styles.statLabel}>Рейтинг</Text></View>
              <View style={styles.statDev} />
              <View style={styles.stat}><Text style={styles.statVal}>3</Text><Text style={styles.statLabel}>Бонусы</Text></View>
            </View>
          </Animated.View>
        </IridescentHero>

        <View style={styles.section}>
          {/* Loyalty */}
          <Animated.View style={{ opacity: f, transform: [{ translateY: Animated.multiply(f, new Animated.Value(0)).interpolate({ inputRange: [0,1], outputRange: [20,0] }) }] }}>
            <LinearGradient colors={['#C8933A','#E8C568','#C8933A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.loyalty}>
              <View style={styles.loyaltyTop}>
                <View>
                  <Text style={styles.loyaltyTitle}>M19 GOLD</Text>
                  <Text style={styles.loyaltySub}>ВИП-КЛИЕНТ</Text>
                </View>
                <Feather name="award" size={s(22)} color="rgba(0,0,0,0.15)" />
              </View>
              <View style={styles.progressRow}>
                <View style={styles.progressBg}><View style={styles.progressFill} /></View>
                <Text style={styles.progressText}>8/10</Text>
              </View>
              <View style={styles.loyaltyBadge}><Feather name="gift" size={s(10)} color="#C8933A" /><Text style={styles.loyaltyBadgeText}>1 стрижка бесплатно</Text></View>
              <Text style={styles.loyaltyNum}>**** **** **** 1919</Text>
            </LinearGradient>
          </Animated.View>

          {/* History empty */}
          <Animated.View style={[styles.historyCard, { opacity: f }]}>
            <View style={styles.historyIconRow}>
              <View style={styles.historyIcon}><Feather name="calendar" size={s(18)} color={colors.iconMuted} /></View>
            </View>
            <Text style={styles.historyText}>Нет записей</Text>
            <Text style={styles.historySub}>Нажмите «Записаться» на главной</Text>
          </Animated.View>

          {/* Settings */}
          <Animated.View style={{ gap: s(8), opacity: f }}>
            {[
              { icon: 'edit-2', label: 'Редактировать профиль', color: '#102852' },
              { icon: 'bell', label: 'Уведомления', color: '#FF9500' },
              { icon: 'help-circle', label: 'Помощь', color: '#34C759' },
            ].map((item, i) => (
              <TouchableOpacity key={i} style={styles.settingItem} activeOpacity={0.7}>
                <View style={[styles.settingIcon, { backgroundColor: item.color + '15' }]}><Feather name={item.icon} size={s(16)} color={item.color} /></View>
                <Text style={styles.settingLabel}>{item.label}</Text>
                <Feather name="chevron-right" size={s(14)} color={colors.iconMuted} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.signOutItem} onPress={handleSignOut} activeOpacity={0.7}>
              <View style={[styles.settingIcon, { backgroundColor: '#FF3B30' + '15' }]}><Feather name="log-out" size={s(16)} color="#FF3B30" /></View>
              <Text style={styles.signOutLabel}>Выйти</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  avatar: { position: 'relative', marginBottom: s(12) },
  avatarInner: { width: s(68), height: s(68), borderRadius: s(34), backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.15)' },
  onlineDot: { position: 'absolute', bottom: s(2), right: s(2), width: s(14), height: s(14), borderRadius: s(7), backgroundColor: '#4ade80', borderWidth: 2.5, borderColor: 'rgba(16,40,82,1)' },
  userName: { fontFamily: typography.fonts.heading, fontSize: s(20), color: '#FFF', marginBottom: s(4) },
  userPhone: { fontFamily: typography.fonts.body, fontSize: s(11), color: 'rgba(255,255,255,0.45)', marginBottom: s(16) },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: s(16),
    paddingVertical: s(12),
    paddingHorizontal: s(8),
    alignSelf: 'stretch',
    marginHorizontal: s(4),
  },
  stat: { flex: 1, alignItems: 'center', paddingHorizontal: s(8) },
  statVal: { fontFamily: typography.fonts.heading, fontSize: s(15), color: '#FFF' },
  statLabel: { fontFamily: typography.fonts.body, fontSize: s(9), color: 'rgba(255,255,255,0.45)', marginTop: s(2) },
  statDev: { width: 1, backgroundColor: 'rgba(255,255,255,0.08)', alignSelf: 'center', height: s(22) },

  section: { paddingHorizontal: s(16), paddingTop: s(16), gap: s(14) },
  loyalty: { borderRadius: s(22), padding: s(18), overflow: 'hidden' },
  loyaltyTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: s(14) },
  loyaltyTitle: { fontFamily: typography.fonts.heading, fontSize: s(18), color: '#1E1E2E', letterSpacing: 2 },
  loyaltySub: { fontFamily: typography.fonts.body, fontSize: s(9), color: 'rgba(30,30,46,0.5)', letterSpacing: 1.5, marginTop: s(2) },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: s(8) },
  progressBg: { flex: 1, height: s(6), borderRadius: s(3), backgroundColor: 'rgba(0,0,0,0.08)' },
  progressFill: { width: '80%', height: '100%', borderRadius: s(3), backgroundColor: '#1E1E2E' },
  progressText: { fontFamily: typography.fonts.body, fontSize: s(10), color: 'rgba(30,30,46,0.5)' },
  loyaltyBadge: { flexDirection: 'row', alignItems: 'center', gap: s(5), backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 100, paddingHorizontal: s(10), paddingVertical: s(4), alignSelf: 'flex-start', marginBottom: s(10) },
  loyaltyBadgeText: { fontFamily: typography.fonts.bodyMedium, fontSize: s(10), color: '#1E1E2E' },
  loyaltyNum: { fontFamily: typography.fonts.body, fontSize: s(11), color: 'rgba(30,30,46,0.3)', letterSpacing: 2 },

  historyCard: { backgroundColor: colors.bgCard, borderRadius: s(22), padding: s(24), alignItems: 'center' },
  historyIconRow: { width: s(50), height: s(50), borderRadius: s(25), backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', marginBottom: s(8) },
  historyIcon: { width: s(36), height: s(36), borderRadius: s(18), backgroundColor: 'rgba(0,0,0,0.03)', alignItems: 'center', justifyContent: 'center' },
  historyText: { fontFamily: typography.fonts.bodyMedium, fontSize: s(14), color: colors.text, marginBottom: s(3) },
  historySub: { fontFamily: typography.fonts.body, fontSize: s(11), color: colors.textMuted },

  settingItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgCard, borderRadius: s(18), padding: s(14) },
  settingIcon: { width: s(34), height: s(34), borderRadius: s(17), alignItems: 'center', justifyContent: 'center', marginRight: s(12) },
  settingLabel: { flex: 1, fontFamily: typography.fonts.body, fontSize: s(13), color: colors.text },
  signOutItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgCard, borderRadius: s(18), padding: s(14) },
  signOutLabel: { fontFamily: typography.fonts.body, fontSize: s(13), color: '#FF3B30' },
});
