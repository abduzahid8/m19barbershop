import { render, screen, fireEvent } from '@testing-library/react-native';
import SettingsScreen from '../screens/SettingsScreen';

jest.mock('@expo/vector-icons/Feather', () => 'Feather');

describe('SettingsScreen', () => {
  it('renders title', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Настройки')).toBeTruthy();
  });

  it('renders preferences section', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Уведомления')).toBeTruthy();
    expect(screen.getByText('Напоминать о записях')).toBeTruthy();
    expect(screen.getByText('Язык')).toBeTruthy();
    expect(screen.getByText('Русский')).toBeTruthy();
  });

  it('renders version', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('M19 Barbershop v1.0.0')).toBeTruthy();
  });

  it('toggles notifications off and on', () => {
    render(<SettingsScreen />);
    const switch_ = screen.getByRole('switch');
    expect(switch_.props.value).toBe(true);
    fireEvent(switch_, 'onValueChange', false);
    expect(screen.getByRole('switch').props.value).toBe(false);
    fireEvent(screen.getByRole('switch'), 'onValueChange', true);
    expect(screen.getByRole('switch').props.value).toBe(true);
  });
});
