import { render } from '@testing-library/react-native';
import AppNavigator from '../navigation/AppNavigator';

jest.mock('../screens/HomeScreen', () => () => null);
jest.mock('../screens/BarbersScreen', () => () => null);
jest.mock('../screens/ProfileScreen', () => () => null);

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: ({ children }: { children: React.ReactNode }) => children,
  }),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: ({ children }: { children: React.ReactNode }) => children,
  }),
}));

describe('AppNavigator', () => {
  it('renders without crashing', () => {
    expect(() => render(<AppNavigator />)).not.toThrow();
  });
});
