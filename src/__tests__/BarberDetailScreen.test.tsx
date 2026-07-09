import { render, screen } from '@testing-library/react-native';
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
const mockRoute = { params: { barberId: 'b1' } };

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

  it('renders barber details for valid barberId', () => {
    render(<BarberDetailScreen />);
    const rustamElements = screen.getAllByText('Rustam');
    expect(rustamElements.length).toBeGreaterThan(0);
    expect(screen.getByText('Top Barber')).toBeTruthy();
  });

  it('renders Book with him button for available barber', () => {
    render(<BarberDetailScreen />);
    expect(screen.getByText('Book with him')).toBeTruthy();
  });

  it('renders error for invalid barberId', () => {
    mockRoute.params = { barberId: 'nonexistent' };
    render(<BarberDetailScreen />);
    expect(screen.getByText('Barber not found')).toBeTruthy();
    mockRoute.params = { barberId: 'b1' };
  });
});
