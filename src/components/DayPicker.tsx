import { useMemo } from 'react';
import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { getDayNames } from '../data';
import { colors, spacing, fontSize, borderRadius, fonts } from '../theme';

interface DayPickerProps {
  selected: string | null;
  onSelect: (date: string) => void;
}

export default function DayPicker({ selected, onSelect }: DayPickerProps) {
  const days = useMemo(() => getDayNames(), []);
  const today = days[0]?.fullDate;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {days.map((d) => {
        const isSelected = d.fullDate === selected;
        const isToday = d.fullDate === today;
        return (
          <TouchableOpacity
            key={d.fullDate}
            onPress={() => onSelect(d.fullDate)}
            activeOpacity={0.7}
            style={[styles.pill, isSelected && styles.pillSelected, isToday && !isSelected && styles.pillToday]}
          >
            <Text style={[styles.pillDay, isSelected && styles.pillTextSelected]}>{d.day}</Text>
            <Text style={[styles.pillDate, isSelected && styles.pillTextSelected]}>{d.date}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  pillSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  pillToday: {
    borderColor: colors.text,
    borderWidth: 1.5,
  },
  pillDay: {
    fontSize: fontSize.xs, fontFamily: fonts.bodyLight,
    color: colors.textSecondary,
  },
  pillDate: {
    fontSize: fontSize.md, fontFamily: fonts.body, fontWeight: '600',
    color: colors.text,
  },
  pillTextSelected: { color: colors.onAccent },
});
