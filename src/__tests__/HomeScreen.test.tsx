import { render, screen, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';

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

  it('renders hero content', () => {
    render(<HomeScreen />);
    expect(screen.getAllByText('M19').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('BARBERSHOP').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/ЗАПИСАТЬСЯ/)).toBeTruthy();
  });

  it('renders online booking button', () => {
    render(<HomeScreen />);
    expect(screen.getByText('Онлайн-запись')).toBeTruthy();
  });

  it('navigates to Booking on online booking press', () => {
    render(<HomeScreen />);
    const bookBtn = screen.getByText('Онлайн-запись');
    fireEvent.press(bookBtn);
    expect(mockNavigate).toHaveBeenCalledWith('Booking', { preselectedBarber: undefined });
  });

  it('renders sections', () => {
    render(<HomeScreen />);
    expect(screen.getByText('ОТЗЫВЫ КЛИЕНТОВ')).toBeTruthy();
    expect(screen.getByText('НОВОСТИ')).toBeTruthy();
    expect(screen.getByText('ЛОКАЦИЯ')).toBeTruthy();
  });
});
