import { render, screen, fireEvent } from '@testing-library/react-native';
import SettingsScreen from '../screens/SettingsScreen';

jest.mock('@expo/vector-icons/Feather', () => 'Feather');

describe('SettingsScreen', () => {
  it('renders title', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Settings')).toBeTruthy();
  });

  it('renders preferences section', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Notifications')).toBeTruthy();
    expect(screen.getByText('Remind me of appointments')).toBeTruthy();
    expect(screen.getByText('Language')).toBeTruthy();
    expect(screen.getByText('English')).toBeTruthy();
  });

  it('renders account section with logout', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Account')).toBeTruthy();
    expect(screen.getByText('Log out')).toBeTruthy();
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
