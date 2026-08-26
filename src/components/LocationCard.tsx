import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, fonts, rs } from '../theme';

interface LocationCardProps {
  address: string;
  onPress?: () => void;
}

export default function LocationCard({ address, onPress }: LocationCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.mapWrap}>
        <MapPattern />
        <View style={styles.pinWrap} pointerEvents="none">
          <View style={styles.pin}>
            <Text style={styles.pinText}>M19</Text>
          </View>
        </View>
        <View style={styles.mapOverlay} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.address}>{address}</Text>
        <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.cta}>
          <Feather name="map-pin" size={rs(12)} color="#9FE870" />
          <Text style={styles.ctaText}>Жми на локацию</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MapPattern() {
  return (
    <View style={styles.mapPattern}>
      {Array.from({ length: 12 }).map((_, i) => (
        <View key={`h-${i}`} style={[styles.gridLineH, { top: rs(10) + i * rs(18) }]} />
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <View key={`v-${i}`} style={[styles.gridLineV, { left: rs(12) + i * rs(30) }]} />
      ))}
      <View style={[styles.road, { top: rs(50), left: -20, right: -20, height: rs(14) }]} />
      <View style={[styles.road, { top: rs(150), left: -20, right: -20, height: rs(12) }]} />
      <View style={[styles.roadV, { left: rs(100), top: -10, bottom: -10, width: rs(12) }]} />
      <View style={[styles.roadV, { left: rs(280), top: -10, bottom: -10, width: rs(10) }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#161412',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  mapWrap: {
    height: rs(114),
    backgroundColor: '#0B0A09',
    overflow: 'hidden',
    position: 'relative',
  },
  mapPattern: { flex: 1, position: 'relative' },
  gridLineH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(180,180,180,0.12)' },
  gridLineV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(180,180,180,0.12)' },
  road: { position: 'absolute', backgroundColor: '#1F1D1B', borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  roadV: { position: 'absolute', backgroundColor: '#1F1D1B', borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  pinWrap: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -rs(31) / 2 }, { translateY: -rs(31) }],
    alignItems: 'center',
  },
  pin: {
    width: rs(31),
    height: rs(31),
    borderRadius: rs(16),
    borderBottomLeftRadius: rs(2),
    backgroundColor: '#9FE870',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-45deg' }],
  },
  pinText: {
    fontSize: rs(9),
    fontFamily: fonts.display,
    color: '#0F1410',
    letterSpacing: 0.5,
    transform: [{ rotate: '45deg' }],
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: rs(9),
    gap: rs(7),
  },
  address: {
    flex: 1,
    fontSize: rs(10),
    color: colors.white,
    fontFamily: fonts.bodyLight,
    lineHeight: rs(13),
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(5),
    paddingHorizontal: rs(7),
    paddingVertical: rs(5),
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(159,232,112,0.35)',
    backgroundColor: 'rgba(159,232,112,0.06)',
  },
  ctaText: {
    fontSize: rs(10),
    color: '#9FE870',
    fontFamily: fonts.body,
    fontWeight: '500',
  },
});
