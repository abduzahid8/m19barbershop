import { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { AppProvider } from './src/state/AppContext';
import { BookingProvider } from './src/state/BookingContext';
import AppNavigator from './src/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Gramatika-Bold': require('./assets/fonts/Gramatika-Bold.ttf'),
    'Gramatika-Regular': require('./assets/fonts/Gramatika-Regular.ttf'),
    'Geometria-Medium': require('./assets/fonts/geometria_medium.otf'),
    'Geometria-Light': require('./assets/fonts/geometria_light.otf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
      <AppProvider>
        <BookingProvider>
          <NavigationContainer>
            <View style={styles.root} onLayout={onLayoutRootView}>
              <StatusBar style="light" />
              <AppNavigator />
            </View>
          </NavigationContainer>
        </BookingProvider>
      </AppProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
