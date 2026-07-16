import { render, screen, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';

jest.mock('expo-video', () => ({
  VideoView: 'VideoView',
  useVideoPlayer: jest.fn(() => ({
    loop: true,
    muted: true,
    play: jest.fn(),
  })),
}));

jest.mock('@expo/vector-icons/Feather', () => 'Feather');

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders logo and subtitle', () => {
    render(<HomeScreen />);
    expect(screen.getByText('M19')).toBeTruthy();
    expect(screen.getByText('Barbershop')).toBeTruthy();
  });

  it('renders stats', () => {
    render(<HomeScreen />);
    expect(screen.getByText('Барберы')).toBeTruthy();
    expect(screen.getByText('Услуги')).toBeTruthy();
    expect(screen.getByText('Лет')).toBeTruthy();
  });

  it('renders book now button', () => {
    render(<HomeScreen />);
    expect(screen.getByText('Записаться')).toBeTruthy();
  });

  it('navigates to Booking on Book now press', () => {
    render(<HomeScreen />);
    const bookBtn = screen.getByText('Записаться');
    fireEvent.press(bookBtn);
    expect(mockNavigate).toHaveBeenCalledWith('Booking', { preselectedBarber: undefined });
  });
});
