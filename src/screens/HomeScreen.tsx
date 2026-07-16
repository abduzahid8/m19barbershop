import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBarbers, useServices } from '../hooks/useData';
import { colors, spacing, fontSize, fonts } from '../theme';
import Button from '../components/Button';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { data: barbers } = useBarbers();
  const { data: services } = useServices();
  const player = useVideoPlayer(require('../../123.mp4'), (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.hero}>
          <VideoView
            player={player}
            style={styles.video}
            contentFit="cover"
            nativeControls={false}
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.topSection}>
              <Text style={styles.logoSmall}>M19</Text>
              <Text style={styles.subtitleSmall}>Barbershop</Text>
            </View>
            <View style={styles.centerSection}>
              <Text style={styles.discountLine}>
                НА ПЕРВЫЙ ВИЗИТ{'\n'}
                <Text style={styles.discountBold}>-20%</Text> <Text style={styles.discountHighlight}>СКИДКА</Text>
              </Text>
              <Text style={styles.description}>
                Один из лучших барбершопов в центре Ташкента с рейтингом 5.0 ⭐
              </Text>
            </View>
            <View style={styles.bottomWrapper}>
                <View style={styles.stats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNum}>{barbers.length}</Text>
                  <Text style={styles.statLabel}>Барберы</Text>
                </View>
                <View style={styles.statDot} />
                <View style={styles.statItem}>
                  <Text style={styles.statNum}>{services.length}</Text>
                  <Text style={styles.statLabel}>Услуги</Text>
                </View>
                <View style={styles.statDot} />
                <View style={styles.statItem}>
                  <Text style={styles.statNum}>8+</Text>
                  <Text style={styles.statLabel}>Лет</Text>
                </View>
              </View>
              <View style={styles.ctaWrapper}>
                <Button
                  title="Записаться"
                  onPress={() => navigation.navigate('Booking', { preselectedBarber: undefined })}
                  fullWidth
                  style={styles.cta}
                />
              </View>
            </View>
          </View>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    flex: 1,
    overflow: 'hidden',
  },
  video: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  },
  heroOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  heroContent: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
  },
  topSection: {
    paddingTop: spacing.xl,
    alignItems: 'center',
    paddingBottom: spacing.sm,
  },
  logoSmall: {
    fontSize: fontSize.xxl,
    fontFamily: fonts.display,
    color: colors.white,
    letterSpacing: -0.5,
  },
  subtitleSmall: {
    fontSize: fontSize.sm,
    fontFamily: fonts.bodyLight,
    color: 'rgba(255,255,255,0.7)',
    marginTop: -2,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomWrapper: {
    paddingBottom: 100,
  },
  discountLine: {
    fontSize: fontSize.xxl,
    fontFamily: fonts.bodyLight,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  discountBold: {
    fontSize: fontSize.xxl,
    fontFamily: fonts.display,
    color: colors.white,
    letterSpacing: 1,
  },
  discountHighlight: {
    fontSize: fontSize.xxl,
    fontFamily: fonts.display,
    color: colors.black,
    backgroundColor: colors.white,
    letterSpacing: 1,
  },
  description: {
    fontSize: fontSize.md,
    fontFamily: fonts.bodyLight,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    lineHeight: fontSize.md + 6,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  ctaWrapper: {
    paddingTop: spacing.lg,
  },
  cta: {},
});
