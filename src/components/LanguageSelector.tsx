import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import type { Lang } from '../i18n/translations';
import { fonts, rs } from '../theme';

const LANGS: Lang[] = ['RU', 'UZ', 'EN'];

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage();

  return (
    <View style={styles.langRow}>
      {LANGS.map((l) => (
        <TouchableOpacity
          key={l}
          onPress={() => setLang(l)}
          activeOpacity={0.7}
          accessibilityRole="button"
          testID={`langBtn-${l}`}
        >
          <Text style={[styles.lang, lang === l && styles.langActive]}>{l}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  langRow: { flexDirection: 'row', alignItems: 'center', gap: rs(4) },
  lang: {
    fontSize: rs(12), fontFamily: fonts.body, color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1, paddingVertical: rs(4), paddingHorizontal: rs(7),
  },
  langActive: { color: '#9FE870', borderBottomWidth: 2, borderBottomColor: '#9FE870' },
});
