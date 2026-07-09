import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Barber } from '../data';

import TabBar from '../components/TabBar';
import HomeScreen from '../screens/HomeScreen';
import BarbersScreen from '../screens/BarbersScreen';
import BarberDetailScreen from '../screens/BarberDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BookingScreen from '../screens/BookingScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  Booking: { preselectedBarber?: Barber } | undefined;
  BarberDetail: { barberId: string };
  Settings: undefined;
};

export type TabParamList = {
  Home: undefined;
  Barbers: undefined;
  Profile: undefined;
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
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Barbers" component={BarbersScreen} options={{ tabBarLabel: 'Barbers' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
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
