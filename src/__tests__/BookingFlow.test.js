import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import BookingScreen from '../screens/BookingScreen';
import AuthScreen from '../screens/AuthScreen';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock the AuthContext so we have a signed-in user for Booking
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'Иван', phone: '+998901234567' },
    signIn: jest.fn(() => Promise.resolve({ success: true })),
    signUp: jest.fn(() => Promise.resolve({ success: true })),
    loading: false,
  }),
}));

describe('AuthScreen Flow', () => {
  it('renders sign-in mode by default and handles input changes', async () => {
    render(<AuthScreen />);

    // 'Войти' appears in both the tab and the submit button — use getAllByText
    expect(screen.getAllByText('Войти').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByPlaceholderText('+998 __ ___ __ __')).toBeTruthy();
    expect(screen.getByPlaceholderText('Пароль')).toBeTruthy();

    const phoneInput = screen.getByPlaceholderText('+998 __ ___ __ __');
    const passwordInput = screen.getByPlaceholderText('Пароль');

    fireEvent.changeText(phoneInput, '+998901234567');
    fireEvent.changeText(passwordInput, 'password123');

    expect(phoneInput.props.value).toBe('+998901234567');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('switches to sign-up mode when registering is selected', async () => {
    render(<AuthScreen />);
    
    const signUpTab = screen.getByText('Регистрация');
    fireEvent.press(signUpTab);

    // Wait for input wrapper animation transition
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Имя')).toBeTruthy();
    });
  });

  it('triggers OTP generation and renders verification layout on form submit', async () => {
    jest.useFakeTimers();
    render(<AuthScreen />);

    const phoneInput = screen.getByPlaceholderText('+998 __ ___ __ __');
    const passwordInput = screen.getByPlaceholderText('Пароль');

    fireEvent.changeText(phoneInput, '+998909663440');
    fireEvent.changeText(passwordInput, 'password123');

    // Press 'Войти' submit button
    const submitBtns = screen.getAllByText('Войти');
    fireEvent.press(submitBtns[submitBtns.length - 1]);

    // Fast-forward simulated delay to trigger SMS
    jest.advanceTimersByTime(650);

    // Verify OTP container is shown (new AuthScreen says "Код из СМС" + "Отправлен на ...")
    await waitFor(() => {
      expect(screen.getByText('Код из СМС')).toBeTruthy();
      expect(screen.getByText(/Отправлен на \+998909663440/)).toBeTruthy();
    });

    jest.useRealTimers();
  });
});

describe('BookingScreen Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navigates through the 4-step booking reservation successfully', async () => {
    jest.useFakeTimers();

    render(<BookingScreen navigation={mockNavigation} route={{ params: {} }} />);

    // --- STEP 0: SERVICE SELECTION ---
    expect(screen.getByText('Выберите услугу')).toBeTruthy();
    const serviceCard = screen.getByText('Мужская стрижка');
    fireEvent.press(serviceCard);

    // Press next
    const nextBtn = screen.getByText('Далее');
    fireEvent.press(nextBtn);

    // --- STEP 1: BARBER SELECTION ---
    expect(screen.getByText('Выберите мастера')).toBeTruthy();
    const barberCard = screen.getByText('Мухаммад');
    fireEvent.press(barberCard);
    
    // Press next
    fireEvent.press(screen.getByText('Далее'));

    // --- STEP 2: DATE & TIME SELECTION ---
    expect(screen.getByText('Дата и время')).toBeTruthy();
    
    // Select time slot '09:00' (available for barber id '1' since not in booked slots)
    const timeSlot = screen.getByText('09:00');
    fireEvent.press(timeSlot);

    // Press "Перейти к подтверждению"
    fireEvent.press(screen.getByText('Перейти к подтверждению'));

    // --- STEP 3: CONFIRMATION ---
    expect(screen.getByText('Подтверждение')).toBeTruthy();
    expect(screen.getAllByText('Мужская стрижка').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Мухаммад').length).toBeGreaterThan(0);
    expect(screen.getByText('09:00')).toBeTruthy();

    // Confirm booking
    const confirmBtn = screen.getByText('Подтвердить запись');
    fireEvent.press(confirmBtn);

    // Fast-forward simulated database network delay
    jest.runAllTimers();

    // --- SUCCESS CONFIRMATION ---
    const successTitle = await screen.findByText('Запись подтверждена!');
    expect(successTitle).toBeTruthy();
    expect(screen.getByText('Ждём вас в назначенное время')).toBeTruthy();

    // Press "На главную" to reset and navigate home
    const homeBtn = screen.getByText('На главную');
    fireEvent.press(homeBtn);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
    
    jest.useRealTimers();
  });
});
