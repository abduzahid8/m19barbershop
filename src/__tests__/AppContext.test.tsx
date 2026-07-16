import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AppProvider, useApp } from '../state/AppContext';

const mockAppointments = [
  { id: 'a1', barberId: 'b1', barberName: 'Rustam', serviceNames: ['Стрижка'], date: '2026-07-20', time: '14:00', status: 'upcoming' as const },
  { id: 'a2', barberId: 'b1', barberName: 'Rustam', serviceNames: ['Коррекция бороды'], date: '2026-06-15', time: '10:00', status: 'completed' as const },
];

jest.mock('../services/api', () => ({
  getAppointments: jest.fn(() => Promise.resolve({ data: mockAppointments, error: null })),
  getReviews: jest.fn(() => Promise.resolve({ data: [], error: null })),
  createAppointment: jest.fn(() => Promise.resolve({ data: { id: 'new-id' }, error: null })),
  cancelAppointment: jest.fn(() => Promise.resolve({ data: null, error: null })),
  getBarbers: jest.fn(() => Promise.resolve({ data: [], error: null })),
  getServices: jest.fn(() => Promise.resolve({ data: [], error: null })),
  getTimeSlotsForBarber: jest.fn(() => Promise.resolve({ data: [], error: null })),
}));

describe('AppContext', () => {
  it('provides initial state', async () => {
    const { result } = renderHook(() => useApp(), { wrapper: AppProvider });
    await waitFor(() => {
      expect(result.current.appointments).toBeDefined();
    });
    expect(result.current.shopReviews).toBeDefined();
    expect(result.current.userName).toBeDefined();
  });

  it('loads appointments and computes upcoming', async () => {
    const { result } = renderHook(() => useApp(), { wrapper: AppProvider });
    await waitFor(() => {
      expect(result.current.appointments.length).toBeGreaterThan(0);
    });
    expect(result.current.upcoming).not.toBeNull();
    expect(result.current.upcoming?.status).toBe('upcoming');
  });

  it('computes history', async () => {
    const { result } = renderHook(() => useApp(), { wrapper: AppProvider });
    await waitFor(() => {
      expect(result.current.appointments.length).toBeGreaterThan(0);
    });
    expect(result.current.history.length).toBeGreaterThan(0);
    result.current.history.forEach(a => {
      expect(a.status).toBe('completed');
    });
  });

  it('cancels appointment', async () => {
    const { result } = renderHook(() => useApp(), { wrapper: AppProvider });
    await waitFor(() => {
      expect(result.current.appointments.length).toBeGreaterThan(0);
    });
    const firstId = result.current.appointments[0].id;
    await act(async () => {
      await result.current.cancelAppointment(firstId);
    });
    const cancelled = result.current.appointments.find(a => a.id === firstId);
    expect(cancelled?.status).toBe('cancelled');
  });
});
