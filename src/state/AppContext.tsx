import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { Appointment, ShopReview, seedAppointments, seedShopReviews } from '../data';

interface AppState {
  appointments: Appointment[];
  upcoming: Appointment | null;
  history: Appointment[];
  addAppointment: (a: Omit<Appointment, 'id'>) => void;
  cancelAppointment: (id: string) => void;
  userName: string;
  shopReviews: ShopReview[];
  addShopReview: (review: { author: string; rating: number; text: string }) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(seedAppointments);
  const [shopReviews, setShopReviews] = useState<ShopReview[]>(seedShopReviews);

  const addAppointment = useCallback((draft: Omit<Appointment, 'id'>) => {
    const id = 'a' + Date.now();
    setAppointments((prev) => [...prev, { ...draft, id }]);
  }, []);

  const cancelAppointment = useCallback((id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' as const } : a))
    );
  }, []);

  const addShopReview = useCallback((draft: { author: string; rating: number; text: string }) => {
    const review: ShopReview = {
      ...draft,
      id: 'sr' + Date.now(),
      date: new Date().toISOString().split('T')[0],
    };
    setShopReviews((prev) => [review, ...prev]);
  }, []);

  const upcoming = useMemo(
    () => appointments.find((a) => a.status === 'upcoming') ?? null,
    [appointments]
  );

  const history = useMemo(
    () => appointments.filter((a) => a.status === 'completed'),
    [appointments]
  );

  return (
    <AppContext.Provider
      value={{
        appointments, upcoming, history, addAppointment, cancelAppointment, userName: 'You',
        shopReviews, addShopReview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
