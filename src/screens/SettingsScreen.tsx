import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, fonts } from '../theme';
import Button from '../components/Button';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Preferences</Text>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Feather name="bell" size={18} color={colors.textSecondary} />
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>Notifications</Text>
                <Text style={styles.rowDesc}>Remind me of appointments</Text>
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
                <Text style={styles.rowLabel}>Language</Text>
              </View>
            </View>
            <Text style={styles.rowValue}>English</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account</Text>
          <Button title="Log out" variant="outline" fullWidth onPress={() => {}} style={styles.logout} />
        </View>

        <Text style={styles.version}>M19 Barbershop v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xxl, paddingBottom: spacing.huge },
  title: {
    fontSize: fontSize.xxxl,
    fontFamily: fonts.display,
    color: colors.text,
    marginBottom: spacing.xxxl,
    paddingTop: spacing.huge,
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
  logout: { marginTop: spacing.md },
  version: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    fontFamily: fonts.bodyLight,
    textAlign: 'center',
    marginTop: spacing.huge,
  },
});
