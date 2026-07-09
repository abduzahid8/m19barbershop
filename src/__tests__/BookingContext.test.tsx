import { renderHook, act } from '@testing-library/react-native';
import { BookingProvider, useBooking } from '../state/BookingContext';

describe('BookingContext', () => {
  it('starts at step 1 with empty selections', () => {
    const { result } = renderHook(() => useBooking(), { wrapper: BookingProvider });
    expect(result.current.state.currentStep).toBe(1);
    expect(result.current.state.selectedServices).toEqual([]);
    expect(result.current.state.selectedBarber).toBeNull();
    expect(result.current.state.selectedDate).toBeNull();
    expect(result.current.state.selectedTime).toBeNull();
  });

  it('selects service', () => {
    const { result } = renderHook(() => useBooking(), { wrapper: BookingProvider });
    const service = { id: 's1', name: 'Haircut', price: 80000, duration: 45, icon: 'scissors', description: 'Precision cut' };
    act(() => result.current.selectService(service));
    expect(result.current.state.selectedServices).toHaveLength(1);
    expect(result.current.state.selectedServices[0].id).toBe('s1');
  });

  it('toggles service selection (deselect on second tap)', () => {
    const { result } = renderHook(() => useBooking(), { wrapper: BookingProvider });
    const service = { id: 's1', name: 'Haircut', price: 80000, duration: 45, icon: 'scissors', description: 'Precision cut' };
    act(() => result.current.selectService(service));
    expect(result.current.state.selectedServices).toHaveLength(1);
    act(() => result.current.selectService(service));
    expect(result.current.state.selectedServices).toHaveLength(0);
  });

  it('selects barber', () => {
    const { result } = renderHook(() => useBooking(), { wrapper: BookingProvider });
    const barber = { id: 'b1', name: 'Rustam', specialty: 'Top Barber', rating: 4.95, reviewCount: 410, bio: '', portfolio: [], reviews: [], colorIndex: 0, available: true };
    act(() => result.current.selectBarber(barber));
    expect(result.current.state.selectedBarber?.id).toBe('b1');
  });

  it('selects date', () => {
    const { result } = renderHook(() => useBooking(), { wrapper: BookingProvider });
    act(() => result.current.selectDate('2026-07-15'));
    expect(result.current.state.selectedDate).toBe('2026-07-15');
  });

  it('resets time when date changes', () => {
    const { result } = renderHook(() => useBooking(), { wrapper: BookingProvider });
    act(() => result.current.selectTime('10:00'));
    expect(result.current.state.selectedTime).toBe('10:00');
    act(() => result.current.selectDate('2026-07-16'));
    expect(result.current.state.selectedDate).toBe('2026-07-16');
    expect(result.current.state.selectedTime).toBeNull();
  });

  it('navigates through steps', () => {
    const { result } = renderHook(() => useBooking(), { wrapper: BookingProvider });
    act(() => result.current.nextStep());
    expect(result.current.state.currentStep).toBe(2);
    act(() => result.current.nextStep());
    expect(result.current.state.currentStep).toBe(3);
    act(() => result.current.prevStep());
    expect(result.current.state.currentStep).toBe(2);
  });

  it('resets to initial state', () => {
    const { result } = renderHook(() => useBooking(), { wrapper: BookingProvider });
    const service = { id: 's1', name: 'Haircut', price: 80000, duration: 45, icon: 'scissors', description: 'Precision cut' };
    act(() => result.current.selectService(service));
    act(() => result.current.nextStep());
    act(() => result.current.reset());
    expect(result.current.state.currentStep).toBe(1);
    expect(result.current.state.selectedServices).toEqual([]);
  });
});
