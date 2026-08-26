import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, spacing, fontSize, borderRadius, fonts, rs } from '../theme';


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
        ) : null}
        <View style={styles.headerText}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>
      <View style={styles.stars}>
        {Array.from({ length: 5 }, (_, i) => (
          <Text key={i} style={[styles.star, i < rating ? styles.starOn : styles.starOff]}>⭐️</Text>
        ))}
      </View>
      <Text style={styles.text} numberOfLines={3}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(0,0,0,0.0)',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: rs(9),
    gap: rs(4),
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(6),
  },
  avatar: {
    width: rs(26),
    height: rs(26),
    borderRadius: rs(13),
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLogo: {
    backgroundColor: '#0B0A09',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  avatarLogoImg: {
    width: rs(18),
    height: rs(18),
  },
  headerText: { flex: 1, minWidth: 0 },
  name: {
    fontSize: rs(10),
    fontFamily: fonts.body,
    fontWeight: '600',
    color: colors.white,
  },
  date: {
    fontSize: rs(8),
    color: 'rgba(255,255,255,0.45)',
    fontFamily: fonts.bodyLight,
    marginTop: rs(1),
  },
  stars: { flexDirection: 'row', gap: rs(1) },
  star: { fontSize: rs(10) },
  starOn: { opacity: 1 },
  starOff: { opacity: 0.25 },
  text: {
    fontSize: rs(9),
    lineHeight: rs(12),
    color: 'rgba(255,255,255,0.7)',
    fontFamily: fonts.bodyLight,
  },
});
