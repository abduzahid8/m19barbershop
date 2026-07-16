import { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useGoogleAuth, fetchGoogleUser, saveSession, guestSignIn, type AuthUser } from '../services/auth';
import { colors, spacing, fontSize, borderRadius, fonts } from '../theme';

export default function SignInScreen() {
  const { request, response, promptAsync } = useGoogleAuth();
  const { setUser } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      fetchGoogleUser(response.authentication.accessToken).then(async (googleUser) => {
        if (googleUser) {
          await saveSession(googleUser);
          setUser(googleUser);
          setError(null);
        } else {
          setError('Не удалось получить профиль');
        }
      });
    } else if (response?.type === 'error') {
      setError('Вход отменён или не удался');
    }
  }, [response]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.brand}>
            <Text style={styles.logo}>M19</Text>
            <Text style={styles.subtitle}>Barbershop</Text>
          </View>

          <Text style={styles.title}>Добро пожаловать</Text>
          <Text style={styles.description}>
            Войдите через Google, чтобы записаться на услуги
          </Text>

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={styles.googleBtn}
            onPress={() => promptAsync()}
            disabled={!request}
            activeOpacity={0.85}
          >
            <View style={styles.googleIconWrap}>
              <Text style={styles.googleIcon}>G</Text>
            </View>
            <Text style={styles.googleBtnText}>Войти через Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipBtn}
            onPress={async () => {
              const guest = await guestSignIn();
              if (guest) setUser(guest);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.skipBtnText}>Продолжить как гость</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    justifyContent: 'center',
  },
  brand: {
    alignItems: 'center',
    marginBottom: spacing.huge + spacing.xl,
  },
  logo: {
    fontSize: fontSize.huge,
    fontFamily: fonts.display,
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: fontSize.sm,
    fontFamily: fonts.bodyLight,
    color: colors.textSecondary,
    marginTop: -4,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: fontSize.xxxl,
    fontFamily: fonts.display,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fontSize.md,
    fontFamily: fonts.bodyLight,
    color: colors.textSecondary,
    lineHeight: fontSize.md + 6,
    marginBottom: spacing.xxl,
  },
  error: {
    fontSize: fontSize.sm,
    fontFamily: fonts.body,
    color: colors.error,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingVertical: spacing.md + 2,
    borderRadius: borderRadius.full,
    gap: spacing.md,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  googleIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  googleBtnText: {
    fontSize: fontSize.md,
    fontFamily: fonts.body,
    fontWeight: '600',
    color: '#333',
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginTop: spacing.xxl,
  },
  skipBtnText: {
    fontSize: fontSize.sm,
    fontFamily: fonts.body,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
