import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { colors, typography } from '../theme/colors';
import { scale as s } from '../theme/responsive';

function StatItem({ icon, label, value, target, formatter, tint }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const listener = anim.addListener(({ value: v }) => {
      setDisplay(formatter ? formatter(Math.round(v * target)) : String(Math.round(v * target)));
    });
    anim.setValue(0);
    Animated.timing(anim, { toValue: 1, duration: 1000, delay: 200, useNativeDriver: false }).start();
    return () => anim.removeListener(listener);
  }, [target]);

  return (
    <View style={sb.stat}>
      <View style={[sb.statIcon, tint && { backgroundColor: tint + '20' }]}>
        <Feather name={icon} size={s(10)} color={tint || colors.buttonPrimary} />
      </View>
      <Text style={[sb.statValue, tint && { color: tint }]}>{display}</Text>
      <Text style={sb.statLabel}>{label}</Text>
    </View>
  );
}

export default function ServicesStatsBar({ services = [], selectedCount = 0 }) {
  const total = services.length;
  const popular = services.filter(s => s.popular).length;
  const avgPrice = total > 0 ? Math.round(services.reduce((a, s) => a + s.price, 0) / total) : 0;
  const avgDuration = total > 0 ? Math.round(services.reduce((a, s) => a + s.duration, 0) / total) : 0;

  const items = [
    { icon: 'dollar-sign', label: 'Средняя цена', target: avgPrice, formatter: v => v.toLocaleString('ru-RU'), tint: null },
    { icon: 'clock', label: 'Среднее время', target: avgDuration, formatter: v => `${v} мин`, tint: '#f97316' },
    { icon: 'scissors', label: 'Услуг', target: total, formatter: null, tint: null },
  ];
  if (popular > 0) {
    items.push({ icon: 'star', label: 'Хиты', target: popular, formatter: null, tint: '#f97316' });
  }
  if (selectedCount > 0) {
    items.push({
      icon: 'check-circle',
      label: 'Выбрано',
      target: selectedCount,
      formatter: v => `${v} из ${total}`,
      tint: '#4ade80',
    });
  }

  return (
    <View style={sb.container}>
      <View style={sb.statsRow}>
        {items.map((item, i) => (
          <StatItem key={item.icon} {...item} />
        ))}
      </View>
    </View>
  );
}

const sb = StyleSheet.create({
  container: {
    marginHorizontal: s(16),
    marginTop: s(4),
    marginBottom: s(4),
    backgroundColor: colors.bgGlass,
    borderRadius: s(16),
    paddingVertical: s(10),
    paddingHorizontal: s(6),
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start' },
  stat: { alignItems: 'center', flex: 1 },
  statIcon: {
    width: s(24), height: s(24), borderRadius: s(12),
    backgroundColor: colors.bgInput,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: s(4),
  },
  statValue: { fontSize: s(12), fontFamily: typography.fonts.heading, color: colors.text, marginBottom: s(1) },
  statLabel: { fontSize: s(7), fontFamily: typography.fonts.body, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.3 },
});
