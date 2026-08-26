import { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Animated } from 'react-native';
import { colors, spacing, fontSize, borderRadius, fonts } from '../theme';

interface CategoryChipProps {
  label: string;
  icon: string;
  active: boolean;
  onPress: () => void;
}

export default function CategoryChip({ label, icon, active, onPress }: CategoryChipProps) {
  const glow = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const pulseLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    Animated.spring(glow, { toValue: active ? 1 : 0, friction: 8, tension: 80, useNativeDriver: true }).start();
    if (pulseLoopRef.current) {
      pulseLoopRef.current.stop();
      pulseLoopRef.current = null;
    }
    if (active) {
      pulseLoopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
        ]),
        { iterations: -1 }
      );
      pulseLoopRef.current.start();
    } else {
      pulse.setValue(1);
    }
    return () => {
      if (pulseLoopRef.current) {
        pulseLoopRef.current.stop();
        pulseLoopRef.current = null;
      }
    };
  }, [active]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Animated.View style={[styles.chip, active && styles.chipActive, { transform: [{ scale: pulse }] }]}>
        <Animated.View style={[styles.glow, { opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0, 0.6] }) }]} />
        <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
        {active && <View style={styles.indicator} />}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  glow: {
    position: 'absolute', top: -10, left: -10, right: -10, bottom: -10,
    backgroundColor: colors.accent,
    borderRadius: borderRadius.full,
  },
  indicator: {
    position: 'absolute',
    bottom: -1,
    width: 20, height: 3,
    backgroundColor: colors.accent,
    borderRadius: 1.5,
  },
  label: {
    fontSize: fontSize.sm, fontFamily: fonts.body, fontWeight: '500',
    color: colors.textSecondary,
    zIndex: 1,
  },
  labelActive: {
    color: colors.onAccent, fontWeight: '600',
  },
});
