import { renderHook, act } from '@testing-library/react-native';
import { AppProvider, useApp } from '../state/AppContext';

describe('AppContext', () => {
  it('provides seed data', () => {
    const { result } = renderHook(() => useApp(), { wrapper: AppProvider });
    expect(result.current.appointments.length).toBeGreaterThan(0);
    expect(result.current.shopReviews.length).toBeGreaterThan(0);
    expect(result.current.userName).toBe('You');
  });

  it('adds appointment', () => {
    const { result } = renderHook(() => useApp(), { wrapper: AppProvider });
    act(() => result.current.addAppointment({
      barberId: 'b1', barberName: 'Rustam',
      serviceNames: ['Haircut'],
      date: '2026-07-20', time: '14:00', status: 'upcoming',
    }));
    const upcoming = result.current.appointments.filter(a => a.status === 'upcoming');
    expect(upcoming.length).toBeGreaterThan(0);
  });

  it('cancels appointment', () => {
    const { result } = renderHook(() => useApp(), { wrapper: AppProvider });
    const firstId = result.current.appointments[0].id;
    act(() => result.current.cancelAppointment(firstId));
    const cancelled = result.current.appointments.find(a => a.id === firstId);
    expect(cancelled?.status).toBe('cancelled');
  });

  it('adds shop review', () => {
    const { result } = renderHook(() => useApp(), { wrapper: AppProvider });
    act(() => result.current.addShopReview({ author: 'Test', rating: 5, text: 'Great shop!' }));
    expect(result.current.shopReviews[0].author).toBe('Test');
    expect(result.current.shopReviews[0].rating).toBe(5);
  });

  it('computes upcoming appointment', () => {
    const { result } = renderHook(() => useApp(), { wrapper: AppProvider });
    expect(result.current.upcoming).not.toBeNull();
    expect(result.current.upcoming?.status).toBe('upcoming');
  });

  it('computes history', () => {
    const { result } = renderHook(() => useApp(), { wrapper: AppProvider });
    expect(result.current.history.length).toBeGreaterThan(0);
    result.current.history.forEach(a => {
      expect(a.status).toBe('completed');
    });
  });
});
