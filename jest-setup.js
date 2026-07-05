// jest-setup.js
// All mock factory functions must use require() internally — no out-of-scope variables.

// ---------- Async Storage ----------
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// ---------- expo-linear-gradient ----------
jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    LinearGradient: ({ children, style, ...rest }) =>
      React.createElement(View, { style, ...rest }, children),
  };
});

// ---------- @expo/vector-icons/Feather ----------
jest.mock('@expo/vector-icons/Feather', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const Feather = ({ name, testID }) =>
    React.createElement(Text, { testID: testID || `feather-${name}` }, name);
  return Feather;
});

// ---------- @expo/vector-icons/Ionicons ----------
jest.mock('@expo/vector-icons/Ionicons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const Ionicons = ({ name, testID }) =>
    React.createElement(Text, { testID: testID || `ionicons-${name}` }, name);
  return Ionicons;
});

// ---------- react-native-reanimated ----------
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View, Text, Image, ScrollView } = require('react-native');

  const dummyAnimation = {
    duration: () => dummyAnimation,
    delay: () => dummyAnimation,
    springify: () => dummyAnimation,
    damping: () => dummyAnimation,
    stiffness: () => dummyAnimation,
    interpolate: () => dummyAnimation,
    easing: () => dummyAnimation,
  };

  const AnimatedMock = {
    View,
    Text,
    Image,
    ScrollView,
    call: () => {},
    createAnimatedComponent: (Component) => Component,
    interpolate: (value, inputRange, outputRange, extrapolate) => {
      return outputRange[0];
    },
  };

  const Easing = {
    ease: (x) => x,
    out: (fn) => (x) => x,
    in: (fn) => (x) => x,
    inOut: (fn) => (x) => x,
    linear: (x) => x,
    quad: (x) => x,
    cubic: (x) => x,
    bezier: () => (x) => x,
  };

  return {
    __esModule: true,
    default: AnimatedMock,
    Easing,
    useSharedValue: (init) => ({ value: init }),
    useAnimatedStyle: (fn) => fn() || {},
    useAnimatedScrollHandler: (handlers) => {
      return (event) => {
        if (handlers && handlers.onScroll) {
          handlers.onScroll(event);
        }
      };
    },
    withSpring: (val) => val,
    withTiming: (val) => val,
    withRepeat: (val) => val,
    withSequence: (...vals) => vals[0],
    withDelay: (delay, val) => val,
    interpolate: (value, inputRange, outputRange, extrapolate) => {
      return outputRange[0];
    },
    Extrapolation: {
      CLAMP: 'clamp',
    },
    FadeInDown: dummyAnimation,
    FadeInUp: dummyAnimation,
    FadeInRight: dummyAnimation,
    FadeIn: dummyAnimation,
    SlideInDown: dummyAnimation,
    createAnimatedComponent: (Component) => Component,
  };
});

// ---------- react-native-safe-area-context ----------
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const insets = { top: 0, bottom: 0, left: 0, right: 0 };
  const frame  = { x: 0, y: 0, width: 390, height: 844 };
  return {
    SafeAreaProvider: ({ children }) => React.createElement(View, {}, children),
    SafeAreaView:     ({ children, style }) => React.createElement(View, { style }, children),
    SafeAreaConsumer: ({ children }) => children({ insets }),
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame:  () => frame,
    initialWindowMetrics: { insets, frame },
  };
});

// ---------- react-native-screens ----------
jest.mock('react-native-screens', () => {
  const { View } = require('react-native');
  return {
    enableScreens: jest.fn(),
    ScreenContainer: View,
    NativeScreen: View,
    NativeScreenContainer: View,
    ScreenStack: View,
    Screen: View,
  };
});

// ---------- @react-navigation/native ----------
jest.mock('@react-navigation/native', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    NavigationContainer: ({ children }) => children,
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
    useIsFocused: () => true,
  };
});

// ---------- expo-status-bar ----------
jest.mock('expo-status-bar', () => ({ StatusBar: () => null }));

// ---------- @react-navigation/bottom-tabs ----------
jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: () => null,
  }),
}));

// ---------- @react-navigation/native-stack ----------
jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: () => null,
  }),
}));

// ---------- @react-navigation/stack ----------
jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: () => null,
  }),
}));
