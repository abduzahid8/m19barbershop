import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fonts } from '../theme';

interface ProgressIndicatorProps {
  total: number;
  current: number;
}

const STEP_LABELS = ['Service', 'Barber', 'Time', 'Done'];

export default function ProgressIndicator({ total, current }: ProgressIndicatorProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isDone = step < current;
        return (
          <View key={i} style={styles.step} >
            <View style={styles.row}>
              <View
                style={[
                  styles.dot,
                  isActive && styles.dotActive,
                  isDone && styles.dotDone,
                ]}
              >
                {isDone && <Text style={styles.check}>✓</Text>}
                {isActive && <Text style={styles.dotNum}>{step}</Text>}
              </View>
              {i < total - 1 && (
                <View
                  style={[
                    styles.line,
                    isDone && styles.lineActive,
                  ]}
                />
              )}
            </View>
            <Text
              style={[
                styles.label,
                isActive && styles.labelActive,
                isDone && styles.labelDone,
              ]}
            >
              {STEP_LABELS[i]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
  },
  step: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  dotDone: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  dotNum: {
    fontSize: fontSize.xs,
    fontFamily: fonts.body,
    fontWeight: '700',
    color: colors.white,
  },
  check: {
    fontSize: fontSize.xs,
    color: colors.white,
    fontWeight: '700',
  },
  line: {
    width: 36,
    height: 1.5,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
    marginBottom: 2,
  },
  lineActive: {
    backgroundColor: colors.accent,
  },
  label: {
    marginTop: spacing.xs,
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    fontFamily: fonts.bodyLight,
  },
  labelActive: {
    color: colors.accent,
    fontFamily: fonts.body,
    fontWeight: '600',
  },
  labelDone: {
    color: colors.accent,
  },
});
