import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { Barber } from '../data';

import TabBar from '../components/TabBar';
import HomeScreen from '../screens/HomeScreen';
import BarberDetailScreen from '../screens/BarberDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AltegioBookingScreen from '../screens/AltegioBookingScreen';
import { colors } from '../theme';

export type RootStackParamList = {
  MainTabs: undefined;
  Booking: { preselectedBarber?: Barber } | undefined;
  BarberDetail: { barberId: string };
  Settings: undefined;
};

export type TabParamList = {
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Главная' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="Booking"
        component={AltegioBookingScreen}
        options={{ presentation: 'fullScreenModal' }}
      />
      <Stack.Screen
        name="BarberDetail"
        component={BarberDetailScreen}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
