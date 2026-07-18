import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, spacing, fontSize, borderRadius, fonts } from '../theme';

interface ReviewCardProps {
  name: string;
  date: string;
  rating: number;
  text: string;
  initials: string;
  color: string;
  width: number;
  avatarUrl?: string;
}

export default function ReviewCard({ name, date, rating, text, initials, color, width, avatarUrl }: ReviewCardProps) {
  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.header}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: color, alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}
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
      <Text style={styles.text} numberOfLines={3}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#161412',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: spacing.sm + 2,
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: fontSize.xs,
    fontFamily: fonts.display,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerText: { flex: 1, minWidth: 0 },
  name: {
    fontSize: fontSize.xs,
    fontFamily: fonts.body,
    fontWeight: '600',
    color: colors.white,
  },
  date: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.45)',
    fontFamily: fonts.bodyLight,
    marginTop: 1,
  },
  stars: { flexDirection: 'row', gap: 1 },
  star: { fontSize: 11 },
  starOn: { color: '#FFC107' },
  starOff: { color: 'rgba(255,255,255,0.2)' },
  text: {
    fontSize: 10,
    lineHeight: 13,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: fonts.bodyLight,
  },
});
