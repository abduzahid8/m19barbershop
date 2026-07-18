import { View, Text, Switch, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, fontSize, borderRadius, fonts } from '../theme';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn} activeOpacity={0.7}>
            <Feather name="chevron-left" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Настройки</Text>
          <View style={styles.closeBtnPlaceholder} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Предпочтения</Text>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Feather name="bell" size={18} color={colors.textSecondary} />
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>Уведомления</Text>
                <Text style={styles.rowDesc}>Напоминать о записях</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.surfaceAlt, true: colors.accentSecondary }}
              thumbColor={colors.white}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Feather name="globe" size={18} color={colors.textSecondary} />
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>Язык</Text>
              </View>
            </View>
            <Text style={styles.rowValue}>Русский</Text>
          </View>
        </View>

        <Text style={styles.version}>M19 Barbershop v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xxl, paddingBottom: spacing.huge },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xxxl,
    paddingTop: spacing.huge,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -spacing.md,
  },
  closeBtnPlaceholder: { width: 38 },
  title: {
    fontSize: fontSize.xxl,
    fontFamily: fonts.display,
    color: colors.text,
    textAlign: 'center',
  },
  section: { marginBottom: spacing.xxxl },
  sectionLabel: {
    fontSize: fontSize.xs,
    fontFamily: fonts.body,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText: { marginLeft: spacing.md, flex: 1 },
  rowLabel: {
    fontSize: fontSize.md,
    fontFamily: fonts.body,
    fontWeight: '500',
    color: colors.text,
  },
  rowDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontFamily: fonts.bodyLight,
    marginTop: 2,
  },
  rowValue: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontFamily: fonts.body,
  },
  version: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    fontFamily: fonts.bodyLight,
    textAlign: 'center',
    marginTop: spacing.huge,
  },
});
