import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, fonts } from '../theme';

interface TimeSlotProps {
  time: string;
  available: boolean;
  selected: boolean;
  onPress: () => void;
}

export default function TimeSlot({ time, available, selected, onPress }: TimeSlotProps) {
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const display = `${hour > 12 ? hour - 12 : hour === 0 ? 12 : hour}:${m}`;
  const ampm = hour >= 12 ? 'PM' : 'AM';

  return (
    <TouchableOpacity
      onPress={available ? onPress : undefined}
      activeOpacity={0.7}
      style={[styles.block, selected && styles.blockSelected, !available && styles.blockTaken]}
    >
      {selected && (
        <View style={styles.selectedBar} />
      )}
      <Text style={[styles.time, selected && styles.timeSelected]}>{display}</Text>
      <Text style={[styles.ampm, selected && styles.timeSelected]}>{ampm}</Text>
      <View style={styles.spacer} />
      {selected ? (
        <View style={styles.badge}>
          <Feather name="check" size={11} color={colors.onAccent} />
          <Text style={styles.badgeText}>Selected</Text>
        </View>
      ) : available ? (
        <Text style={styles.free}>Free</Text>
      ) : (
        <Text style={styles.taken}>Taken</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  block: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
    marginBottom: spacing.xs,
    position: 'relative',
    overflow: 'hidden',
  },
  blockSelected: {
    backgroundColor: colors.accent,
  },
  blockTaken: {
    opacity: 0.25,
  },
  selectedBar: {
    position: 'absolute',
    left: 0, top: 4, bottom: 4, width: 3,
    backgroundColor: colors.onAccent,
    borderRadius: 1.5,
  },
  time: {
    fontSize: fontSize.lg, fontFamily: fonts.body, fontWeight: '600',
    color: colors.text,
  },
  ampm: {
    fontSize: fontSize.xs, fontFamily: fonts.bodyLight,
    color: colors.textTertiary,
    marginTop: 2,
  },
  timeSelected: { color: colors.onAccent },
  spacer: { flex: 1 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.onAccent,
    paddingHorizontal: spacing.sm + 2, paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: fontSize.xs, fontFamily: fonts.body, fontWeight: '600', color: colors.accent,
  },
  free: {
    fontSize: fontSize.sm, fontFamily: fonts.bodyLight,
    color: colors.success, fontWeight: '500',
  },
  taken: {
    fontSize: fontSize.sm, fontFamily: fonts.bodyLight,
    color: colors.textTertiary,
  },
});
