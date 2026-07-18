import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, fonts } from '../theme';

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
          <View style={styles.pinShadow} />
          <View style={styles.pin}>
            <Text style={styles.pinText}>M19</Text>
          </View>
        </View>
        <View style={styles.mapOverlay} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.address}>{address}</Text>
        <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.cta}>
          <Feather name="map-pin" size={14} color="#9FE870" />
          <Text style={styles.ctaText}>Жми на локацию</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MapPattern() {
  return (
    <View style={styles.mapPattern}>
      {Array.from({ length: 18 }).map((_, i) => (
        <View key={`h-${i}`} style={[styles.gridLineH, { top: 14 + i * 22 }]} />
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <View key={`v-${i}`} style={[styles.gridLineV, { left: 12 + i * 30 }]} />
      ))}
      <View style={[styles.road, { top: 80, left: -20, right: -20, height: 18 }]} />
      <View style={[styles.road, { top: 240, left: -20, right: -20, height: 14 }]} />
      <View style={[styles.roadV, { left: 100, top: -10, bottom: -10, width: 14 }]} />
      <View style={[styles.roadV, { left: 280, top: -10, bottom: -10, width: 12 }]} />
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
    height: 200,
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
    transform: [{ translateX: -22 }, { translateY: -34 }],
    alignItems: 'center',
  },
  pinShadow: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.4)',
    marginBottom: 2,
  },
  pin: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#9FE870',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9FE870',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 8,
  },
  pinText: {
    fontSize: 12,
    fontFamily: fonts.display,
    color: '#0F1410',
    letterSpacing: 0.5,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    gap: spacing.sm,
  },
  address: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.white,
    fontFamily: fonts.bodyLight,
    lineHeight: 18,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(159,232,112,0.35)',
    backgroundColor: 'rgba(159,232,112,0.06)',
  },
  ctaText: {
    fontSize: fontSize.sm,
    color: '#9FE870',
    fontFamily: fonts.body,
    fontWeight: '500',
  },
});
