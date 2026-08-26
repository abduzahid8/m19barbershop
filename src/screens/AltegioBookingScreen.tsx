import { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { WebView, type WebViewNavigation } from 'react-native-webview';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, fontSize, fonts } from '../theme';

const BOOKING_URL = 'https://n129791.alteg.io';

export default function AltegioBookingScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [error, setError] = useState(false);
  const webRef = useRef<WebView>(null);

  const handleRetry = useCallback(() => {
    setError(false);
    webRef.current?.reload();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Feather name="x" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.error}>
          <Feather name="alert-circle" size={40} color={colors.textTertiary} />
          <Text style={styles.errorText}>Не удалось загрузить страницу</Text>
          <TouchableOpacity onPress={handleRetry} style={styles.retryBtn}>
            <Text style={styles.retryText}>Повторить</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          ref={webRef}
          source={{ uri: BOOKING_URL }}
          style={styles.webview}
          onError={() => setError(true)}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          sharedCookiesEnabled
          cacheEnabled
          setBuiltInZoomControls={false}
          setDisplayZoomControls={false}
          allowsBackForwardNavigationGestures
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  errorText: {
    marginTop: spacing.md,
    fontSize: fontSize.md,
    fontFamily: fonts.bodyLight,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  retryText: {
    fontSize: fontSize.md,
    fontFamily: fonts.body,
    fontWeight: '600',
    color: colors.accent,
  },
});
