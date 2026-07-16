import { render, screen, waitFor } from '@testing-library/react-native';
import BarberDetailScreen from '../screens/BarberDetailScreen';

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

jest.mock('expo-blur', () => ({
  BlurView: 'BlurView',
}));

jest.mock('@expo/vector-icons/Feather', () => 'Feather');

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockRoute = { params: { barberId: 'fb-barber-5' } };

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
  useRoute: () => mockRoute,
}));

describe('BarberDetailScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockGoBack.mockClear();
  });

  it('renders barber details for valid barberId', async () => {
    render(<BarberDetailScreen />);
    await waitFor(() => {
      expect(screen.getAllByText('Rustam').length).toBeGreaterThan(0);
    });
    expect(screen.getByText('Топ Барбер')).toBeTruthy();
  });

  it('renders "Записаться к нему" button for available barber', async () => {
    render(<BarberDetailScreen />);
    await waitFor(() => {
      expect(screen.getByText('Записаться к нему')).toBeTruthy();
    });
  });

  it('renders error for invalid barberId', () => {
    mockRoute.params = { barberId: 'nonexistent' };
    render(<BarberDetailScreen />);
    expect(screen.getByText('Барбер не найден')).toBeTruthy();
    mockRoute.params = { barberId: 'fb-barber-5' };
  });
});
