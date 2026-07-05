import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { colors, shadows, typography } from '../theme/colors';
import { scale as s } from '../theme/responsive';
import { reviews } from '../data/mockData';

const STAR_COLORS = ['#F59E0B', '#D1D5DB'];

function Stars({ rating }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map(i => (
        <Feather
          key={i}
          name="star"
          size={s(11)}
          color={i <= rating ? STAR_COLORS[0] : STAR_COLORS[1]}
          fill={i <= rating ? STAR_COLORS[0] : 'none'}
          style={{ marginRight: 1 }}
        />
      ))}
    </View>
  );
}

function ReviewCard({ item }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.authorArea}>
          <Text style={styles.authorName}>{item.author}</Text>
          <Stars rating={item.rating} />
        </View>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <Text style={styles.reviewText} numberOfLines={4}>
        "{item.text}"
      </Text>
    </View>
  );
}

export default function ReviewsCarousel() {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather name="message-square" size={s(16)} color={colors.buttonPrimary} />
          <Text style={styles.title}>Отзывы</Text>
        </View>
        <Text style={styles.count}>{reviews.length} отзывов</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={s(260) + s(12)}
        decelerationRate="fast"
      >
        {reviews.map(r => (
          <ReviewCard key={r.id} item={r} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: s(28),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(16),
    marginBottom: s(14),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  title: {
    fontSize: s(16),
    fontFamily: typography.fonts.heading,
    color: colors.text,
  },
  count: {
    fontSize: s(11),
    fontFamily: typography.fonts.body,
    color: colors.textMuted,
  },
  scrollContent: {
    paddingHorizontal: s(16),
    gap: s(12),
  },
  card: {
    width: s(260),
    borderRadius: s(20),
    backgroundColor: colors.bgCard,
    padding: s(16),
    ...shadows.card,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: s(10),
  },
  avatar: {
    width: s(36),
    height: s(36),
    borderRadius: s(18),
    marginRight: s(10),
  },
  authorArea: {
    flex: 1,
  },
  authorName: {
    fontSize: s(13),
    fontFamily: typography.fonts.heading,
    color: colors.text,
    marginBottom: s(2),
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: s(9),
    fontFamily: typography.fonts.body,
    color: colors.textMuted,
  },
  reviewText: {
    fontSize: s(12),
    fontFamily: typography.fonts.body,
    color: colors.textSecondary,
    lineHeight: s(18),
  },
});
