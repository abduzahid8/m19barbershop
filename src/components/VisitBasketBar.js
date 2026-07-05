import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { colors, typography } from '../theme/colors';
import { scale as s } from '../theme/responsive';
import { SERVICE_PHOTOS } from '../data/serviceVisuals';

function MiniThumb({ service, onRemove }) {
  const photoUri = SERVICE_PHOTOS[service.id] || SERVICE_PHOTOS['1'];
  return (
    <View style={vbb.thumb}>
      <Image source={{ uri: photoUri }} style={vbb.thumbImg} resizeMode="cover" />
      <TouchableOpacity style={vbb.thumbX} onPress={() => onRemove(service.id)} activeOpacity={0.7}>
        <Feather name="x" size={s(7)} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

function PriceAnim({ target }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [d, setD] = useState('0');
  useEffect(() => {
    const l = anim.addListener(({ value: v }) => setD(Math.round(v * target).toLocaleString('ru-RU')));
    anim.setValue(0);
    Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: false }).start();
    return () => anim.removeListener(l);
  }, [target]);
  return <Text style={vbb.price}>{d}</Text>;
}

export default function VisitBasketBar({ selectedServices = [], onRemove, onBook }) {
  const slide = useRef(new Animated.Value(0)).current;
  const prev = useRef(0);

  useEffect(() => {
    if (selectedServices.length > 0 && prev.current === 0) {
      slide.setValue(0);
      Animated.spring(slide, { toValue: 1, damping: 16, stiffness: 200, useNativeDriver: true }).start();
    } else if (selectedServices.length === 0 && prev.current > 0) {
      Animated.timing(slide, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
    prev.current = selectedServices.length;
  }, [selectedServices.length]);

  if (selectedServices.length === 0) return null;

  const totalPrice = selectedServices.reduce((a, s) => a + s.price, 0);
  const totalDur = selectedServices.reduce((a, s) => a + s.duration, 0);
  const visible = selectedServices.slice(0, 3);
  const extra = selectedServices.length - 3;
  const durStr = totalDur >= 60 ? `${Math.floor(totalDur / 60)}ч ${totalDur % 60}м` : `${totalDur}м`;

  return (
    <Animated.View style={[vbb.wrap, { transform: [{ translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [120, 0] }) }] }]}>
      <LinearGradient colors={['#0f172a', '#1e293b']} style={vbb.bar}>
        <View style={vbb.row}>
          <View style={vbb.thumbs}>
            {visible.map(s => <MiniThumb key={s.id} service={s} onRemove={onRemove} />)}
            {extra > 0 && <View style={vbb.extra}><Text style={vbb.extraT}>+{extra}</Text></View>}
          </View>
          <View style={vbb.totals}>
            <PriceAnim target={totalPrice} />
            <Text style={vbb.dur}>{durStr}</Text>
          </View>
        </View>
        <TouchableOpacity style={vbb.btn} onPress={onBook} activeOpacity={0.88}>
          <Text style={vbb.btnTxt}>{selectedServices.length}</Text>
          <Feather name="arrow-right" size={s(14)} color="#0f172a" />
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
}

const vbb = StyleSheet.create({
  wrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 100,
  },
  bar: {
    paddingTop: s(10), paddingBottom: s(28), paddingHorizontal: s(14),
    borderTopLeftRadius: s(20), borderTopRightRadius: s(20),
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: s(10),
  },
  thumbs: { flexDirection: 'row', alignItems: 'center', gap: s(5), flex: 1 },
  thumb: {
    width: s(32), height: s(32), borderRadius: s(16),
    overflow: 'hidden', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)',
  },
  thumbImg: { width: '100%', height: '100%' },
  thumbX: {
    position: 'absolute', top: -s(3), right: -s(3),
    width: s(14), height: s(14), borderRadius: s(7),
    backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center',
  },
  extra: {
    width: s(32), height: s(32), borderRadius: s(16),
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  extraT: { fontSize: s(9), fontFamily: typography.fonts.bodyMedium, color: '#FFF' },
  totals: { alignItems: 'flex-end' },
  price: { fontSize: s(14), fontFamily: typography.fonts.heading, color: '#1AFFD5' },
  dur: { fontSize: s(9), fontFamily: typography.fonts.body, color: 'rgba(255,255,255,0.5)', marginTop: s(1) },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: s(5), backgroundColor: '#1AFFD5', borderRadius: 100, paddingVertical: s(11),
  },
  btnTxt: {
    fontSize: s(12), fontFamily: typography.fonts.heading,
    color: '#0f172a', letterSpacing: 0.5,
  },
});
