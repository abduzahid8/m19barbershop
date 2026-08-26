import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, borderRadius, fonts } from '../theme';

interface TimeSlotProps {
  time: string;
  available: boolean;
  selected: boolean;
  onPress: () => void;
}

export default function TimeSlot({ time, available, selected, onPress }: TimeSlotProps) {
  return (
    <TouchableOpacity
      onPress={available ? onPress : undefined}
      activeOpacity={0.7}
      style={[styles.block, selected && styles.blockSelected, !available && styles.blockTaken]}
    >
      <Text style={[styles.time, selected && styles.timeSelected]}>{time}</Text>
      <View style={styles.spacer} />
      <View style={[styles.dot, selected && styles.dotSelected, !available && !selected && styles.dotTaken]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  block: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  blockSelected: {
    backgroundColor: colors.accent,
  },
  blockTaken: {
    opacity: 0.2,
  },
  time: {
    fontSize: fontSize.lg, fontFamily: fonts.body, fontWeight: '600',
    color: colors.text,
  },
  timeSelected: { color: colors.onAccent },
  spacer: { flex: 1 },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.success,
  },
  dotSelected: {
    backgroundColor: colors.onAccent,
  },
  dotTaken: {
    backgroundColor: colors.textTertiary,
  },
});
