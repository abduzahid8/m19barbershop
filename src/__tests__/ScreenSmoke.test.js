import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('../context/AuthContext', () => {
  const React = require('react');
  return {
    AuthContext: React.createContext({
      user: { id: '1', name: 'Иван', phone: '+998901234567', avatar: 'https://x.test/avatar.jpg' },
      signIn: jest.fn(() => Promise.resolve({ success: true })),
      signUp: jest.fn(() => Promise.resolve({ success: true })),
      signOut: jest.fn(() => Promise.resolve()),
      loading: false,
    }),
    useAuth: () => ({
      user: { id: '1', name: 'Иван', phone: '+998901234567', avatar: 'https://x.test/avatar.jpg' },
      signIn: jest.fn(() => Promise.resolve({ success: true })),
      signUp: jest.fn(() => Promise.resolve({ success: true })),
      signOut: jest.fn(() => Promise.resolve()),
      loading: false,
    }),
  };
});

import HomeScreen from '../screens/HomeScreen';
import ServicesScreen from '../screens/ServicesScreen';
import GalleryScreen from '../screens/GalleryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BarbersScreen from '../screens/BarbersScreen';
import BookingScreen from '../screens/BookingScreen';
import AuthScreen from '../screens/AuthScreen';
import AppNavigator from '../navigation/AppNavigator';

const mockNav = { navigate: jest.fn(), goBack: jest.fn(), addListener: jest.fn(() => () => {}) };

describe('Screen mount smoke tests', () => {
  it('renders HomeScreen without crashing', () => {
    const tree = render(<HomeScreen />);
    expect(tree).toBeTruthy();
  });

  it('renders ServicesScreen without crashing', () => {
    const tree = render(<ServicesScreen />);
    expect(tree).toBeTruthy();
  });

  it('renders GalleryScreen without crashing', () => {
    const tree = render(<GalleryScreen />);
    expect(tree).toBeTruthy();
  });

  it('renders ProfileScreen without crashing', () => {
    const tree = render(<ProfileScreen />);
    expect(tree).toBeTruthy();
  });

  it('renders BarbersScreen without crashing', () => {
    const tree = render(<BarbersScreen />);
    expect(tree).toBeTruthy();
  });

  it('renders BookingScreen (step 0) without crashing', () => {
    const tree = render(<BookingScreen navigation={mockNav} route={{ params: {} }} />);
    expect(tree).toBeTruthy();
  });

  it('renders AuthScreen (login) without crashing', () => {
    const tree = render(<AuthScreen />);
    expect(tree).toBeTruthy();
  });

  it('renders AppNavigator (signed in) without crashing', () => {
    const tree = render(<AppNavigator />);
    expect(tree).toBeTruthy();
  });
});

describe('UX/UI proportionality sanity', () => {
  it('BookingScreen step bar labels are readable (fontSize >= 9)', () => {
    const tree = render(<BookingScreen navigation={mockNav} route={{ params: {} }} />);
    const labels = tree.getAllByText(/Услуга|Мастер|Время|Итог/);
    expect(labels.length).toBeGreaterThan(0);
    labels.forEach(node => {
      const fontSize = node.props.style?.fontSize || (Array.isArray(node.props.style) ? null : null);
      const flat = Array.isArray(node.props.style) ? Object.assign({}, ...node.props.style.filter(Boolean)) : node.props.style;
      expect(flat?.fontSize ?? 0).toBeGreaterThanOrEqual(9);
    });
  });

  it('AuthScreen brand title fits a reasonable size', () => {
    const tree = render(<AuthScreen />);
    const title = tree.getByText('M19');
    const flat = title.props.style;
    expect(flat.fontSize).toBeGreaterThanOrEqual(28);
  });
});
