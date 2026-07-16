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

// ---------- AuthContext ----------
const mockUser = { id: 'test-user-id', email: 'test@example.com', name: 'Test User' };
jest.mock('./src/contexts/AuthContext', () => {
  const mockUseAuth = () => ({
    user: mockUser,
    isLoading: false,
    isAuthenticated: true,
    signOut: jest.fn(() => Promise.resolve()),
    setUser: jest.fn(),
  });
  return {
    __esModule: true,
    useAuth: mockUseAuth,
    AuthProvider: ({ children }) => children,
  };
});

// ---------- supabase ----------
const mockBarbers = [
  { id: 'b1', name: 'Rustam', specialty: 'Top Barber', rating: 5, review_count: 100, bio: 'Pro barber', image_url: null, portfolio: [], color_index: 0, available: true, created_at: '2025-01-01' },
  { id: 'b2', name: 'Avaz', specialty: 'Barber', rating: 4.9, review_count: 200, bio: 'Experienced barber', image_url: null, portfolio: [], color_index: 1, available: true, created_at: '2025-01-01' },
];
const mockAppointments = [
  { id: 'a1', user_id: 'test-user-id', barber_id: 'b1', barber_name: 'Rustam', service_names: ['Haircut'], date: '2026-07-20', time: '14:00', status: 'upcoming', created_at: '2025-01-01' },
  { id: 'a2', user_id: 'test-user-id', barber_id: 'b1', barber_name: 'Rustam', service_names: ['Beard Trim'], date: '2026-06-15', time: '10:00', status: 'completed', created_at: '2025-01-01' },
];
const mockReviews = [
  { id: 'r1', user_id: null, author: 'You', rating: 5, text: 'Great shop!', date: '2026-07-01', created_at: '2025-01-01' },
];
const mockLoyalty = { id: 'l1', user_id: 'test-user-id', points: 50, tier: 'silver', total_visits: 3, created_at: '2025-01-01' };

const tableData: Record<string, any[]> = {
  barbers: mockBarbers,
  appointments: mockAppointments,
  reviews: mockReviews,
  yandex_reviews: [],
  loyalty_points: [mockLoyalty],
};

function mockFrom(table: string) {
  const data = tableData[table] || [];
  const listPromise = () => Promise.resolve({ data, error: null });
  const singleItem = data.length > 0 ? data[0] : null;
  const singlePromise = () => Promise.resolve({ data: singleItem, error: null });
  const nullPromise = () => Promise.resolve({ data: null, error: null });

  const insertedRecord = { id: 'inserted-id', author: 'Test', rating: 5, text: 'Great shop!', user_id: 'test-user-id', date: '2026-07-09', created_at: '2025-01-01' };

  // Terminal methods (which resolve the promise)
  const builder = {
    order: jest.fn(listPromise),
    single: jest.fn(singlePromise),
    limit: jest.fn(listPromise),
    range: jest.fn(listPromise),
    select: jest.fn(() => builder),
    eq: jest.fn(() => builder),
    neq: jest.fn(() => builder),
    gt: jest.fn(() => builder),
    lt: jest.fn(() => builder),
    in: jest.fn(() => builder),
    is: jest.fn(() => builder),
    like: jest.fn(() => builder),
    ilike: jest.fn(() => builder),
    match: jest.fn(() => builder),
    filter: jest.fn(() => builder),
    or: jest.fn(() => builder),
    not: jest.fn(() => builder),
    contains: jest.fn(() => builder),
    containedBy: jest.fn(() => builder),
    textSearch: jest.fn(() => builder),
    insert: jest.fn(() => builder),
    upsert: jest.fn(() => builder),
    update: jest.fn(() => builder),
    delete: jest.fn(() => builder),
  };

  // Override insert/update for reviews/appointments to return synthesized inserted record
  builder.insert = jest.fn(() => {
    const insertBuilder = { ...builder };
    insertBuilder.select = jest.fn(() => insertBuilder);
    insertBuilder.single = jest.fn(() => Promise.resolve({ data: insertedRecord, error: null }));
    Object.assign(insertBuilder, {
      then: (resolve: any) => Promise.resolve({ data: insertedRecord, error: null }).then(resolve),
    });
    return insertBuilder;
  });

  // Make the builder itself thenable so `await anyChain` works for arbitrary depth
  Object.assign(builder, {
    then: (resolve: any) => listPromise().then(resolve),
  });

  return builder;
}

jest.mock('./src/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithOtp: jest.fn(),
      verifyOtp: jest.fn(),
      getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
    },
    from: jest.fn((table: string) => mockFrom(table)),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(() => Promise.resolve({ data: null, error: null })),
        createSignedUrl: jest.fn(() => Promise.resolve({ data: { signedUrl: '' }, error: null })),
      })),
    },
  },
}));

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
