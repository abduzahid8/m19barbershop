import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, fonts } from '../theme';

type IconName = React.ComponentProps<typeof Feather>['name'];

interface ContactCardProps {
  icon: IconName;
  label: string;
  value: string;
  accent?: string;
  onPress?: () => void;
}

export default function ContactCard({ icon, label, value, accent = '#9FE870', onPress }: ContactCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.card}>
      <View style={[styles.iconWrap, { shadowColor: accent }]}>
        <Feather name={icon} size={20} color={accent} />
      </View>
      <View style={styles.text}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#161412',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingVertical: spacing.md + 4,
    paddingHorizontal: spacing.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(159,232,112,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, minWidth: 0 },
  label: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    fontFamily: fonts.bodyLight,
    letterSpacing: 0.3,
  },
  value: {
    fontSize: fontSize.md,
    color: colors.white,
    fontFamily: fonts.body,
    fontWeight: '500',
    marginTop: 2,
  },
});
