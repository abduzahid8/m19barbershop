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
            <View style={styles.spacerTop} />
            <View>
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
            <View style={styles.spacerBottom} />
          </View>
          <View style={styles.ctaWrapper}>
            <Button
              title="Book now"
              onPress={() => navigation.navigate('Booking', { preselectedBarber: undefined })}
              fullWidth
              style={styles.cta}
            />
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
  spacerTop: {
    flex: 5,
  },
  spacerBottom: {
    flex: 6,
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
  ctaWrapper: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: 140,
    paddingTop: spacing.xl,
  },
  cta: {},
});
