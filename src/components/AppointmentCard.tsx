import { View, Text, StyleSheet } from 'react-native';
import { Appointment, formatDateLong } from '../data';
import { colors, spacing, fontSize, borderRadius, fonts, cardShadow } from '../theme';

interface AppointmentCardProps {
  appointment: Appointment;
}

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <View style={[styles.card, cardShadow]}>
      <View style={styles.topRow}>
        <View style={styles.indicator} />
        <Text style={styles.label}>UPCOMING</Text>
      </View>
      <Text style={styles.date}>{formatDateLong(appointment.date)}</Text>
      <View style={styles.divider} />
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Time</Text>
        <Text style={styles.detailValue}>{appointment.time}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Barber</Text>
        <Text style={styles.detailValue}>{appointment.barberName}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Service</Text>
        <Text style={styles.detailValue}>{appointment.serviceNames.join(', ')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: spacing.sm,
  },
  label: {
    fontSize: fontSize.xs,
    fontFamily: fonts.body,
    fontWeight: '600',
    color: colors.success,
    letterSpacing: 1.5,
  },
  date: {
    fontSize: fontSize.xl,
    fontFamily: fonts.displayRegular,
    color: colors.cardText,
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs + 2,
  },
  detailLabel: {
    fontSize: fontSize.sm,
    fontFamily: fonts.bodyLight,
    color: colors.cardTextSecondary,
  },
  detailValue: {
    fontSize: fontSize.sm,
    fontFamily: fonts.body,
    fontWeight: '500',
    color: colors.cardText,
  },
});
