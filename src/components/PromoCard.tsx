import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, fonts } from '../theme';

type IconName = React.ComponentProps<typeof Feather>['name'];

interface PromoCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon: string;
  bg?: string;
  fg?: string;
  width: number;
}

export default function PromoCard({ title, subtitle, badge, icon, bg = '#9FE870', fg = '#0F1410', width }: PromoCardProps) {
  return (
    <View style={[styles.card, { width, backgroundColor: bg }]}>
      {badge && (
        <View style={[styles.badge, { backgroundColor: rgba(fg, 0.18) }]}>
          <Text style={[styles.badgeText, { color: fg }]}>{badge}</Text>
        </View>
      )}
      <View style={[styles.iconCircle, { backgroundColor: rgba(fg, 0.14) }]}>
        <Feather name={icon as IconName} size={18} color={fg} />
      </View>
      <Text style={[styles.title, { color: fg }]} numberOfLines={2}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: rgba(fg, 0.7) }]} numberOfLines={2}>{subtitle}</Text>
      )}
    </View>
  );
}

function rgba(hex: string, alpha: number) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    minHeight: 132,
    justifyContent: 'space-between',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
    marginBottom: spacing.sm,
  },
  badgeText: {
    fontSize: 9,
    fontFamily: fonts.body,
    letterSpacing: 1,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.md,
    fontFamily: fonts.display,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: fonts.bodyLight,
    marginTop: 2,
    lineHeight: 14,
  },
});
