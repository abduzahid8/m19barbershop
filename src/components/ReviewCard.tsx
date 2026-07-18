import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, borderRadius, fonts } from '../theme';

interface ReviewCardProps {
  name: string;
  date: string;
  rating: number;
  text: string;
  initials: string;
  color: string;
  width: number;
}

export default function ReviewCard({ name, date, rating, text, initials, color, width }: ReviewCardProps) {
  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: color }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>
      <View style={styles.stars}>
        {Array.from({ length: 5 }, (_, i) => (
          <Text key={i} style={[styles.star, i < rating ? styles.starOn : styles.starOff]}>★</Text>
        ))}
      </View>
      <Text style={styles.text} numberOfLines={4}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#161412',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: fontSize.sm,
    fontFamily: fonts.display,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerText: { flex: 1, minWidth: 0 },
  name: {
    fontSize: fontSize.sm,
    fontFamily: fonts.body,
    fontWeight: '600',
    color: colors.white,
  },
  date: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.45)',
    fontFamily: fonts.bodyLight,
    marginTop: 1,
  },
  stars: { flexDirection: 'row', gap: 2 },
  star: { fontSize: 14 },
  starOn: { color: '#FFC107' },
  starOff: { color: 'rgba(255,255,255,0.2)' },
  text: {
    fontSize: 11,
    lineHeight: 15,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: fonts.bodyLight,
  },
});
