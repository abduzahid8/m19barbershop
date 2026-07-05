import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '../context/AuthContext';
import { colors, shadows, spacing, borderRadius, typography } from '../theme/colors';
import { scale as s, SCREEN_WIDTH } from '../theme/responsive';

import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import ServicesScreen from '../screens/ServicesScreen';
import BookingScreen from '../screens/BookingScreen';
import GalleryScreen from '../screens/GalleryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BarbersScreen from '../screens/BarbersScreen';

const InnerStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_CONFIG = [
  { name: 'Home', label: 'Главная', icon: 'home' },
  { name: 'Services', label: 'Услуги', icon: 'scissors' },
  { name: 'Booking', label: 'Запись', icon: 'calendar', center: true },
  { name: 'Gallery', label: 'Мастера', icon: 'users' },
  { name: 'Profile', label: 'Профиль', icon: 'user' },
];

function TabIcon({ routeName, isFocused }) {
  const config = TAB_CONFIG.find(t => t.name === routeName);
  if (config?.center) return null;
  return (
    <Feather
      name={config?.icon}
      size={s(24)}
      color={isFocused ? '#262A44' : '#C7CCE1'}
    />
  );
}

function CenterTabButton({ onPress, isFocused }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View style={[
        tabStyles.centerBtn,
        isFocused && tabStyles.centerBtnActive,
      ]}>
        <Feather
          name="calendar"
          size={s(24)}
          color={isFocused ? '#FFFFFF' : '#102852'}
        />
      </View>
    </TouchableOpacity>
  );
}

function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[tabStyles.outerContainer, { bottom: insets.bottom + s(8) }]}>
      <View style={tabStyles.container}>
        <View style={tabStyles.bar}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const config = TAB_CONFIG.find(t => t.name === route.name);
            const isBooking = route.name === 'Booking';

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            if (isBooking) {
              return (
                <View key={route.key} style={tabStyles.centerTabItem}>
                  <View style={tabStyles.centerWrap}>
                    <CenterTabButton onPress={onPress} isFocused={isFocused} />
                  </View>
                </View>
              );
            }

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={tabStyles.tabBtn}
                activeOpacity={0.7}
              >
                <TabIcon routeName={route.name} isFocused={isFocused} />
                <Text style={[
                  tabStyles.label,
                  isFocused && tabStyles.labelActive,
                ]}>
                  {config?.label}
                </Text>
                {isFocused && <View style={tabStyles.activeDot} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="Booking" component={BookingScreen} />
      <Tab.Screen name="Gallery" component={GalleryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <InnerStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <InnerStack.Screen name="Tabs" component={MainTabs} />
      <InnerStack.Screen
        name="Barbers"
        component={BarbersScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </InnerStack.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {!user ? (
        <AuthScreen />
      ) : (
        <MainStack />
      )}
    </NavigationContainer>
  );
}

const tabStyles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    alignSelf: 'center',
  },
  container: {
    width: SCREEN_WIDTH - s(24),
    height: s(70),
    borderRadius: s(40),
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1.5,
    borderTopColor: 'rgba(255,255,255,0.8)',
    borderLeftColor: 'rgba(255,255,255,0.8)',
    borderBottomColor: 'rgba(255,255,255,0.3)',
    borderRightColor: 'rgba(255,255,255,0.3)',
    overflow: 'visible',
    paddingHorizontal: s(4),
    ...shadows.card,
  },
  bar: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabBtn: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: s(6),
  },
  label: {
    fontSize: s(9),
    fontFamily: typography.fonts.body,
    color: '#C7CCE1',
    marginTop: s(3),
    textAlign: 'center',
  },
  labelActive: {
    color: '#262A44',
    fontFamily: typography.fonts.bodyMedium,
  },
  activeDot: {
    position: 'absolute',
    bottom: s(9),
    width: s(18),
    height: s(3),
    borderRadius: s(20),
    backgroundColor: '#262A44',
  },
  centerBtn: {
    width: s(54),
    height: s(54),
    borderRadius: s(27),
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#102852',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.elevated,
  },
  centerBtnActive: {
    backgroundColor: '#102852',
    borderColor: '#102852',
  },
  centerTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerWrap: {
    marginTop: -s(30),
    zIndex: 10,
    alignItems: 'center',
  },
});
