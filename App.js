import React, { useEffect, useState, Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/theme/colors';

SplashScreen.preventAutoHideAsync();

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ info: errorInfo });
  }
  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, backgroundColor: '#EAF0F8', justifyContent: 'center', padding: 20 }}>
          <ScrollView>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'red', marginBottom: 10 }}>
              Error:
            </Text>
            <Text style={{ fontSize: 14, color: '#333', marginBottom: 10 }}>
              {this.state.error.toString()}
            </Text>
            {this.state.info && (
              <Text style={{ fontSize: 11, color: '#666' }}>
                {this.state.info.componentStack}
              </Text>
            )}
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Gramatika-Black': require('./assets/fonts/GramatikaTrial-Black-BF65dea4c4a007c.otf'),
    'Gramatika-Bold': require('./assets/fonts/Gramatika-Bold.ttf'),
    'Gramatika-BoldItalic': require('./assets/fonts/GramatikaTrial-BoldItalic-BF65dea4c5ba1ff.otf'),
    'Gramatika-ExtraLight': require('./assets/fonts/GramatikaTrial-ExtraLight-BF65dea4c5b0dc5.otf'),
    'Gramatika-Italic': require('./assets/fonts/GramatikaTrial-Italic-BF65dea4c5a1363.otf'),
    'Gramatika-Light': require('./assets/fonts/GramatikaTrial-Light-BF65dea4c59cf23.otf'),
    'Gramatika-Medium': require('./assets/fonts/GramatikaTrial-Medium-BF65dea4c5c6afd.otf'),
    'Gramatika-Regular': require('./assets/fonts/Gramatika-Regular.ttf'),
    'Geometria-Light': require('./assets/fonts/Geometria-Light.ttf'),
    'Geometria-Medium': require('./assets/fonts/geometria_medium.otf'),
  });

  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded || fontError) {
        await SplashScreen.hideAsync();
        setAppReady(true);
      }
    }
    prepare();
  }, [fontsLoaded, fontError]);

  if (!appReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.buttonPrimary} />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="dark" backgroundColor={colors.background} />
          <AppNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
