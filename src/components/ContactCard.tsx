import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, fonts, rs } from '../theme';

type IconName = React.ComponentProps<typeof Feather>['name'];

interface ContactCardProps {
  icon: IconName;
  label: string;
  value: string;
  accent?: string;
  onPress?: () => void;
}

export default function ContactCard({ icon, label, value, accent = '#9FE870', onPress }: ContactCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.card}>
      <View style={styles.iconWrap}>
        <Feather name={icon} size={rs(16)} color={accent} />
      </View>
      <View style={styles.text}>
        <Text allowFontScaling={false} numberOfLines={1} style={styles.label}>{label}</Text>
        <Text allowFontScaling={false} numberOfLines={1} adjustsFontSizeToFit style={styles.value}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(10),
    backgroundColor: '#161412',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingVertical: rs(14),
    paddingHorizontal: rs(10),
  },
  iconWrap: {
    width: rs(21),
    height: rs(21),
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, minWidth: 0 },
  label: {
    fontSize: rs(10),
    color: 'rgba(255,255,255,0.55)',
    fontFamily: fonts.bodyLight,
    letterSpacing: 0.3,
  },
  value: {
    fontSize: rs(13),
    color: colors.white,
    fontFamily: fonts.body,
    fontWeight: '500',
    marginTop: rs(2),
  },
});
