import { render, screen } from '@testing-library/react-native';
import ProfileScreen from '../screens/ProfileScreen';

jest.mock('@expo/vector-icons/Feather', () => 'Feather');

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('../state/AppContext', () => ({
  useApp: () => ({
    upcoming: {
      id: 'a1',
      date: '2026-07-15',
      time: '14:00',
      barberName: 'Rustam',
      serviceNames: ['Haircut', 'Beard Trim'],
      status: 'upcoming',
      barberId: 'b1',
    },
    history: [
      {
        id: 'a2', date: '2026-06-24', time: '11:00',
        barberName: 'Sherzod', serviceNames: ['Haircut'],
        status: 'completed', barberId: 'b4',
      },
    ],
    shopReviews: [
      { id: 'sr1', author: 'Alex', rating: 5, text: 'Great!', date: '2026-06-15' },
    ],
    addShopReview: jest.fn(),
    addAppointment: jest.fn(),
    cancelAppointment: jest.fn(),
    appointments: [],
    userName: 'You',
  }),
}));

describe('ProfileScreen', () => {
  it('renders title', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Profile')).toBeTruthy();
  });

  it('renders shop name', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('M19 Barbershop')).toBeTruthy();
  });

  it('renders upcoming appointment', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Next appointment')).toBeTruthy();
    expect(screen.getByText('Confirmed')).toBeTruthy();
    expect(screen.getByText(/Rustam/)).toBeTruthy();
  });

  it('renders review count', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('1 reviews')).toBeTruthy();
  });

  it('renders loyalty section', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Loyalty')).toBeTruthy();
  });

  it('renders settings link', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Settings')).toBeTruthy();
  });
});
