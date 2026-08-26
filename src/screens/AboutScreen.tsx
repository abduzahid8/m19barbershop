import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, fontSize, fonts, colors, rs } from '../theme';

const PAD = spacing.xl;
const ACCENT = '#9FE870';

const LOGO_BADGE = require('../../assets/logo-watermark.png');

const SERVICES = [
  'Стрижки',
  'Оформление бороды',
  'Бритьё',
  'Окрашивание волос и бороды',
  'Уход за лицом',
  'Биозавивка и другие услуги',
];

const BOOKING_METHODS = [
  'По телефону',
  'Через Telegram',
  'Самостоятельно через онлайн-запись в приложении',
];

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, { paddingTop: spacing.xs }]}>
        <Text style={styles.headerTitle}>О НАС</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.badgeWrap}>
          <Image source={LOGO_BADGE} style={styles.badge} resizeMode="contain" />
        </View>

        <View style={[styles.section, styles.firstSection]}>
          <Text style={styles.eyebrow}>M19 BARBERSHOP</Text>
          <Text style={styles.title}>СТИЛЬ. КАЧЕСТВО.{'\n'}ВНИМАНИЕ К ДЕТАЛЯМ.</Text>
          <View style={styles.divider} />

          <Text style={styles.paragraph}>
            M19 Barbershop — современный барбершоп в самом центре Ташкента, рядом с
            метро «Айбек». Мы открылись в 2022 году и за это время заслужили доверие
            тысяч клиентов благодаря высокому качеству работы, внимательному сервису
            и уютной атмосфере.
          </Text>

          <Text style={styles.founder}>
            Основатель — <Text style={styles.founderName}>Zayd Makhmud</Text>.
          </Text>

          <Text style={styles.paragraph}>
            Наша цель — чтобы каждый гость чувствовал себя комфортно и уходил
            полностью довольным результатом. Поэтому мы уделяем внимание не только
            качеству стрижек, но и чистоте, сервису и атмосфере.
          </Text>

          <Text style={styles.paragraph}>
            В нашей команде работают опытные барберы со стажем от 10 до 16 лет. Мы
            постоянно совершенствуем качество обслуживания, следим за современными
            тенденциями и используем только профессиональные материалы.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>У НАС ДОСТУПНЫ ВСЕ ОСНОВНЫЕ УСЛУГИ</Text>
          {SERVICES.map((s) => (
            <Bullet key={s} text={s} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ЗАПИСАТЬСЯ МОЖНО ЛЮБЫМ УДОБНЫМ СПОСОБОМ</Text>
          {BOOKING_METHODS.map((m) => (
            <Bullet key={m} text={m} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Мы находимся в удобной локации — в центре города, рядом с метро «Айбек»,
            поэтому до нас легко добраться из любой части Ташкента.
          </Text>
          <Text style={[styles.paragraph, { marginTop: spacing.md }]}>
            Спасибо каждому гостю за доверие. Мы продолжаем развиваться и уже
            работаем над открытием второго филиала M19 Barbershop. До встречи!
          </Text>
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
