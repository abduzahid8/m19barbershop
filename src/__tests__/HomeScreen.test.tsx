import { render, screen, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';
import { LanguageProvider } from '../i18n/LanguageContext';

jest.mock('@expo/vector-icons/Feather', () => 'Feather');

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

function renderHomeScreen() {
  return render(
    <LanguageProvider>
      <HomeScreen />
    </LanguageProvider>
  );
}

describe('HomeScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders hero content', () => {
    renderHomeScreen();
    expect(screen.getAllByText('M19').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/M19\s+BARBERSHOP/)).toBeTruthy();
    expect(screen.getByText(/ЗАПИСАТЬСЯ/)).toBeTruthy();
  });

  it('renders online booking button', () => {
    renderHomeScreen();
    expect(screen.getByText('Онлайн-запись')).toBeTruthy();
  });

  it('navigates to Booking on online booking press', () => {
    renderHomeScreen();
    const bookBtn = screen.getByText('Онлайн-запись');
    fireEvent.press(bookBtn);
    expect(mockNavigate).toHaveBeenCalledWith('Booking');
  });

  it('renders sections', () => {
    renderHomeScreen();
    expect(screen.getByText('ОТЗЫВЫ КЛИЕНТОВ')).toBeTruthy();
    expect(screen.getByText('ЛОКАЦИЯ')).toBeTruthy();
  });
});
