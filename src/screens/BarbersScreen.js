import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Modal } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '../theme/colors';
import { scale as s } from '../theme/responsive';
import IridescentHero from '../components/IridescentHero';

function toDative(name) {
  if (!name) return '';
  const last = name[name.length - 1];
  if (last === 'й') return name.slice(0, -1) + 'ю';
  if (last === 'ь') return name.slice(0, -1) + 'ю';
  if (last === 'а') return name.slice(0, -1) + 'е';
  if (last === 'я') return name.slice(0, -1) + 'е';
  if (['a', 'e', 'i', 'o', 'u', 'y'].includes(last.toLowerCase())) return name;
  return name + 'у';
}

const BARBERS = [
  { name: 'Алексей', status: 'Свободен', rating: '4.9', exp: '8 лет', works: '3120', avatar: 'A' },
  { name: 'Дмитрий', status: 'Свободен', rating: '4.8', exp: '6 лет', works: '2540', avatar: 'D' },
  { name: 'Максим', status: 'Занят', rating: '4.9', exp: '7 лет', works: '2890', avatar: 'M' },
  { name: 'Артем', status: 'Свободен', rating: '4.7', exp: '4 года', works: '1830', avatar: 'A' },
  { name: 'Сергей', status: 'Свободен', rating: '4.8', exp: '5 лет', works: '2100', avatar: 'S' },
];

export default function BarbersScreen() {
  const nav = useNavigation();
  const [selected, setSelected] = useState(null);
  const insets = useSafeAreaInsets();
  const f = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(f, { toValue: 1, duration: 500, useNativeDriver: true }).start(); }, []);

  return (
    <View style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: s(100) + insets.bottom }}>
        <IridescentHero
          uri="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80"
          height={s(200)}
          colors={['rgba(10,26,62,0.85)','rgba(26,61,122,0.5)','rgba(16,40,82,0.6)']}
        >
          <Animated.View style={{ opacity: f, alignItems: 'center' }}>
            <View style={styles.heroIcon}><Feather name="users" size={s(18)} color="#FFF" /></View>
            <Text style={styles.heroTitle}>Мастера</Text>
            <Text style={styles.heroSub}>Профессионалы M19</Text>
          </Animated.View>
        </IridescentHero>

        <View style={styles.section}>
          {BARBERS.map((b, i) => (
            <Animated.View key={b.name} style={[styles.barberCard, { opacity: f, transform: [{ translateY: f.interpolate({ inputRange: [0,1], outputRange: [15,0] }) }] }]}>
              <TouchableOpacity onPress={() => setSelected(b)} activeOpacity={0.85}>
                <View style={styles.barberRow}>
                  <View style={styles.avatarWrap}>
                    <View style={[styles.avatar, { backgroundColor: b.status === 'Свободен' ? '#1a3d7a' : '#6b21a8' }]}>
                      <Text style={styles.avatarText}>{b.avatar}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: b.status === 'Свободен' ? '#4ade80' : '#facc15' }]} />
                  </View>
                  <View style={styles.barberInfo}>
                    <Text style={styles.barberName}>{b.name}</Text>
                    <Text style={styles.barberMeta}>Рейтинг {b.rating} · {b.exp} · {b.works} работ</Text>
                  </View>
                  <View style={[styles.statusTag, { backgroundColor: b.status === 'Свободен' ? 'rgba(74,222,128,0.12)' : 'rgba(250,204,21,0.12)' }]}>
                    <View style={[styles.dot, { backgroundColor: b.status === 'Свободен' ? '#4ade80' : '#facc15' }]} />
                    <Text style={[styles.statusLabel, { color: b.status === 'Свободен' ? '#4ade80' : '#facc15' }]}>{b.status}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* Barber Detail Modal */}
      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setSelected(null)}>
          <Animated.View style={styles.sheet}>
            {selected && (
              <>
                <View style={styles.sheetHandle} />
                <View style={styles.sheetAvatar}>
                  <View style={[styles.sheetAvatarInner, { backgroundColor: '#1a3d7a' }]}>
                    <Text style={styles.sheetAvatarText}>{selected.avatar}</Text>
                  </View>
                  <Text style={styles.sheetName}>{selected.name}</Text>
                  <View style={styles.sheetStatusRow}>
                    <View style={[styles.sheetDot, { backgroundColor: selected.status === 'Свободен' ? '#4ade80' : '#facc15' }]} />
                    <Text style={styles.sheetStatusText}>{selected.status}</Text>
                  </View>
                </View>
                <View style={styles.statsRow}>
                  <View style={styles.stat}><Text style={styles.statValue}>{selected.rating}</Text><Text style={styles.statLabel}>Рейтинг</Text></View>
                  <View style={styles.stat}><Text style={styles.statValue}>{selected.exp}</Text><Text style={styles.statLabel}>Стаж</Text></View>
                  <View style={styles.stat}><Text style={styles.statValue}>{selected.works}</Text><Text style={styles.statLabel}>Работ</Text></View>
                </View>
                <TouchableOpacity style={styles.bookBtn} onPress={() => { setSelected(null); nav.navigate('Booking'); }} activeOpacity={0.88}>
                  <Feather name="calendar" size={s(16)} color="#FFF" />
                  <Text style={styles.bookBtnText}>Записаться к {toDative(selected.name)}</Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  heroIcon: { width: s(40), height: s(40), borderRadius: s(20), backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: s(8) },
  heroTitle: { fontFamily: typography.fonts.heading, fontSize: s(24), color: '#FFF', letterSpacing: 2 },
  heroSub: { fontFamily: typography.fonts.body, fontSize: s(11), color: 'rgba(255,255,255,0.45)', marginTop: s(2) },

  section: { paddingHorizontal: s(16), paddingTop: s(16), paddingBottom: s(30), gap: s(10) },
  barberCard: { borderRadius: s(18), backgroundColor: colors.bgCard, padding: s(14) },
  barberRow: { flexDirection: 'row', alignItems: 'center' },
  avatarWrap: { position: 'relative', marginRight: s(14) },
  avatar: { width: s(50), height: s(50), borderRadius: s(25), alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: s(18), fontFamily: typography.fonts.heading, color: '#FFF' },
  statusBadge: { position: 'absolute', bottom: 0, right: 0, width: s(12), height: s(12), borderRadius: s(6), borderWidth: 2, borderColor: colors.bgCard },
  barberInfo: { flex: 1 },
  barberName: { fontSize: s(14), fontFamily: typography.fonts.heading, color: colors.text },
  barberMeta: { fontSize: s(11), fontFamily: typography.fonts.body, color: colors.textMuted, marginTop: s(2) },
  statusTag: { flexDirection: 'row', alignItems: 'center', gap: s(4), paddingHorizontal: s(10), paddingVertical: s(5), borderRadius: 100 },
  dot: { width: s(6), height: s(6), borderRadius: s(3) },
  statusLabel: { fontSize: s(10), fontFamily: typography.fonts.bodyMedium },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.background, borderTopLeftRadius: s(28), borderTopRightRadius: s(28), padding: s(20), paddingBottom: s(40) },
  sheetHandle: { width: s(36), height: s(4), borderRadius: s(2), backgroundColor: colors.borderLight, alignSelf: 'center', marginBottom: s(16) },
  sheetAvatar: { alignItems: 'center', marginBottom: s(16) },
  sheetAvatarInner: { width: s(64), height: s(64), borderRadius: s(32), alignItems: 'center', justifyContent: 'center', marginBottom: s(10) },
  sheetAvatarText: { fontSize: s(22), fontFamily: typography.fonts.heading, color: '#FFF' },
  sheetName: { fontSize: s(18), fontFamily: typography.fonts.heading, color: colors.text },
  sheetStatusRow: { flexDirection: 'row', alignItems: 'center', gap: s(5), marginTop: s(4) },
  sheetDot: { width: s(6), height: s(6), borderRadius: s(3) },
  sheetStatusText: { fontSize: s(12), fontFamily: typography.fonts.body, color: colors.textMuted },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: s(18) },
  stat: { alignItems: 'center' },
  statValue: { fontSize: s(18), fontFamily: typography.fonts.heading, color: colors.text },
  statLabel: { fontSize: s(11), fontFamily: typography.fonts.body, color: colors.textMuted, marginTop: s(2) },
  bookBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(8), backgroundColor: '#102852', borderRadius: 100, height: s(48) },
  bookBtnText: { fontSize: s(12), fontFamily: typography.fonts.heading, color: '#FFF', letterSpacing: 0.5 },
});
