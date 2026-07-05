import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import BookingScreen from '../screens/BookingScreen';
import AuthScreen from '../screens/AuthScreen';

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'Иван', phone: '+998901234567', avatar: 'https://x.test/x.jpg' },
    signIn: jest.fn(() => Promise.resolve({ success: true })),
    signUp: jest.fn(() => Promise.resolve({ success: true })),
    loading: false,
  }),
}));

const mockNav = { navigate: jest.fn(), goBack: jest.fn(), addListener: jest.fn(() => () => {}) };

describe('BookingScreen – edge cases & proportionality', () => {
  it('blocks "Next" if no service is selected (alert path)', () => {
    jest.spyOn(require('react-native').Alert, 'alert').mockImplementation(() => {});
    render(<BookingScreen navigation={mockNav} route={{ params: {} }} />);
    fireEvent.press(screen.getByText('Далее'));
    expect(require('react-native').Alert.alert).toHaveBeenCalled();
    require('react-native').Alert.alert.mockRestore();
  });

  it('preselects service from route.params', () => {
    const pre = { id: '2', name: 'Стрижка + борода', price: 100000, duration: 75, icon: '🧔', category: 'combo' };
    render(<BookingScreen navigation={mockNav} route={{ params: { selectedService: pre } }} />);
    // Service should be pre-selected — step 1 should be reachable directly
    fireEvent.press(screen.getByText('Далее'));
    expect(screen.getByText('Выберите мастера')).toBeTruthy();
  });

  it('renders time slots in morning tab for selected barber', () => {
    const pre = { id: '1', name: 'Мухаммад', available: true, avatar: 'x', rating: 4.9, experience: 6 };
    render(<BookingScreen navigation={mockNav} route={{ params: { selectedBarber: pre } }} />);
    // Step 0 service first
    fireEvent.press(screen.getByText('Мужская стрижка'));
    fireEvent.press(screen.getByText('Далее')); // → step 1, barber pre-selected
    fireEvent.press(screen.getByText('Далее')); // → step 2, date & time
    expect(screen.getByText('Дата и время')).toBeTruthy();
    expect(screen.getByText('09:00')).toBeTruthy();
  });

  it('success view shows ticket with total formatted', async () => {
    jest.useFakeTimers();
    const preSvc = { id: '1', name: 'Мужская стрижка', price: 60000, duration: 45, icon: '✂️' };
    const preBarber = { id: '1', name: 'Мухаммад', available: true, avatar: 'x', rating: 4.9, experience: 6 };
    render(<BookingScreen navigation={mockNav} route={{ params: { selectedService: preSvc, selectedBarber: preBarber } }} />);

    fireEvent.press(screen.getByText('Далее')); // step 0→1 (barber preselected)
    fireEvent.press(screen.getByText('Далее')); // step 1→2
    fireEvent.press(screen.getByText('09:00'));
    fireEvent.press(screen.getByText('Перейти к подтверждению'));
    fireEvent.press(screen.getByText('Подтвердить запись'));
    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByText('Запись подтверждена!')).toBeTruthy();
    });
    expect(screen.getByText(/6[0о]0?0?0?.*сум/)).toBeTruthy();
    jest.useRealTimers();
  });
});

describe('AuthScreen – UX consistency', () => {
  it('shows sign-up CTA properly when toggled', () => {
    render(<AuthScreen />);
    fireEvent.press(screen.getByText('Регистрация'));
    expect(screen.getByPlaceholderText('Имя')).toBeTruthy();
  });

  it('hides sign-up CTA after switching back to login', () => {
    render(<AuthScreen />);
    fireEvent.press(screen.getByText('Регистрация'));
    fireEvent.press(screen.getByText('Вход'));
    expect(screen.queryByPlaceholderText('Имя')).toBeNull();
  });
});
