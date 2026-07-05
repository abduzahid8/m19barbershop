import { View, Text, ScrollView, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { barbers, services, shopInfo } from '../data';
import { useApp } from '../state/AppContext';
import { colors, spacing, fontSize, fonts, borderRadius, cardShadow } from '../theme';
import Button from '../components/Button';
import AppointmentCard from '../components/AppointmentCard';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const HERO_IMG = require('../../logo-5CRrD9HV.png');

function InfoCard({ icon, label, value, onPress }: {
  icon: string; label: string; value: string; onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.infoCard, cardShadow]}
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      <Feather name={icon as any} size={18} color={colors.cardTextSecondary} />
      <View style={styles.infoTextWrap}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { upcoming } = useApp();
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ImageBackground
          source={HERO_IMG}
          style={styles.hero}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.logo}>M19</Text>
            <Text style={styles.subtitle}>Barbershop</Text>
            <View style={styles.heroLine} />
            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{barbers.length}</Text>
                <Text style={styles.statLabel}>Barbers</Text>
              </View>
              <View style={styles.statDot} />
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{services.length}</Text>
                <Text style={styles.statLabel}>Services</Text>
              </View>
              <View style={styles.statDot} />
              <View style={styles.statItem}>
                <Text style={styles.statNum}>8+</Text>
                <Text style={styles.statLabel}>Years</Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.infoRow}>
          <InfoCard
            icon="clock"
            label="Working hours"
            value={shopInfo.hours}
          />
          <InfoCard
            icon="map-pin"
            label="Location"
            value={shopInfo.address}
            onPress={() => {}}
          />
        </View>

        {upcoming && <AppointmentCard appointment={upcoming} />}

        <Button
          title="Book now"
          onPress={() => navigation.navigate('Booking', { preselectedBarber: undefined })}
          fullWidth
          style={styles.cta}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  hero: {
    width: '100%',
    height: 340,
    justifyContent: 'flex-end',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  heroContent: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  logo: {
    fontSize: fontSize.massive,
    fontFamily: fonts.display,
    color: colors.white,
    letterSpacing: -1.5,
    lineHeight: fontSize.massive + 4,
  },
  subtitle: {
    fontSize: fontSize.lg,
    fontFamily: fonts.bodyLight,
    color: 'rgba(255,255,255,0.7)',
    marginTop: -6,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  heroLine: {
    width: 40,
    height: 2,
    backgroundColor: colors.white,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    borderRadius: 1,
    opacity: 0.6,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: fontSize.xl,
    fontFamily: fonts.display,
    color: colors.white,
  },
  statLabel: {
    fontSize: fontSize.xs,
    fontFamily: fonts.bodyLight,
    color: 'rgba(255,255,255,0.6)',
    marginTop: -2,
  },
  statDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  infoTextWrap: {
    gap: 2,
  },
  infoLabel: {
    fontSize: fontSize.xs,
    fontFamily: fonts.body,
    fontWeight: '600',
    color: colors.cardTextSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  infoValue: {
    fontSize: fontSize.xs,
    fontFamily: fonts.bodyLight,
    color: colors.cardTextTertiary,
    lineHeight: 16,
  },
  cta: {
    marginTop: spacing.md,
  },
});
