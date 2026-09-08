import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, fontSize, fonts, colors, rs } from '../theme';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

const PAD = spacing.xl;
const ACCENT = '#9FE870';

const LOGO_BADGE = require('../../assets/logo-watermark.png');

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.bulletDot} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, { paddingTop: spacing.xs }]}>
        <Text style={styles.headerTitle}>{t.about.headerTitle}</Text>
        <LanguageSelector />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.badgeWrap}>
          <Image source={LOGO_BADGE} style={styles.badge} resizeMode="contain" />
        </View>

        <View style={[styles.section, styles.firstSection]}>
          <Text style={styles.eyebrow}>{t.about.eyebrow}</Text>
          <Text style={styles.title}>{t.about.title}</Text>
          <View style={styles.divider} />

          <Text style={styles.paragraph}>{t.about.paragraph1}</Text>

          <Text style={styles.founder}>
            {t.about.founderPrefix}<Text style={styles.founderName}>{t.about.founderName}</Text>.
          </Text>

          <Text style={styles.paragraph}>{t.about.paragraph2}</Text>

          <Text style={styles.paragraph}>{t.about.paragraph3}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.about.servicesTitle}</Text>
          {t.about.services.map((s) => (
            <Bullet key={s} text={s} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.about.bookingMethodsTitle}</Text>
          {t.about.bookingMethods.map((m) => (
            <Bullet key={m} text={m} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.paragraph}>{t.about.closing1}</Text>
          <Text style={[styles.paragraph, { marginTop: spacing.md }]}>{t.about.closing2}</Text>
        </View>

        <View style={{ height: 90 + insets.bottom }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  scroll: { flex: 1 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: PAD, paddingBottom: spacing.xs,
  },
  headerTitle: {
    fontSize: fontSize.lg, fontFamily: fonts.display, color: colors.white,
    letterSpacing: 0.5,
  },

  badgeWrap: { alignItems: 'center', marginTop: spacing.lg },
  badge: { width: rs(230), height: rs(230) },

  section: { marginTop: spacing.xl, paddingHorizontal: PAD },
  firstSection: { marginTop: spacing.lg },
  sectionTitle: {
    fontSize: fontSize.md, fontFamily: fonts.display, color: colors.white,
    letterSpacing: 0.5, marginBottom: spacing.md,
  },

  eyebrow: {
    fontSize: fontSize.sm, fontFamily: fonts.body, color: ACCENT,
    letterSpacing: 1.5, textTransform: 'uppercase',
  },
  title: {
    fontSize: fontSize.xxl, fontFamily: fonts.display, color: colors.white,
    letterSpacing: 0.3, lineHeight: fontSize.xxl + 6, marginTop: spacing.xs,
  },
  divider: {
    width: 32, height: 2, backgroundColor: 'rgba(255,255,255,0.25)',
    marginTop: spacing.md, marginBottom: spacing.md,
  },

  paragraph: {
    fontSize: fontSize.md, fontFamily: fonts.bodyLight, color: 'rgba(255,255,255,0.7)',
    lineHeight: 21, marginBottom: spacing.md,
  },
  founder: {
    fontSize: fontSize.md, fontFamily: fonts.bodyLight, color: 'rgba(255,255,255,0.7)',
    marginBottom: spacing.md,
  },
  founderName: { fontFamily: fonts.body, color: ACCENT },

  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.sm },
  bulletDot: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: ACCENT,
    marginTop: 7,
  },
  bulletText: {
    flex: 1, fontSize: fontSize.md, fontFamily: fonts.bodyLight, color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },
});
