import { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { Appointment, ShopReview } from '../data';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';

interface AppState {
  appointments: Appointment[];
  upcoming: Appointment | null;
  history: Appointment[];
  addAppointment: (params: {
    barberId: string;
    barberName?: string;
    serviceIds: string[];
    serviceNames?: string[];
    datetime: string;
    duration: number;
  }) => Promise<string | null>;
  cancelAppointment: (id: string) => Promise<string | null>;
  userName: string;
  userEmail: string;
  shopReviews: ShopReview[];
  loading: boolean;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [shopReviews, setShopReviews] = useState<ShopReview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) {
      setAppointments([]);
      setShopReviews([]);
      setLoading(false);
      return;
    }

    const [apptResult, reviewResult] = await Promise.all([
      api.getAppointments(user.email),
      api.getReviews(),
    ]);

    if (apptResult.data) setAppointments(apptResult.data);
    if (reviewResult.data) setShopReviews(reviewResult.data);

    setLoading(false);
  }, [user?.id, user?.email]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const addAppointment = useCallback(async (params: {
    barberId: string;
    barberName?: string;
    serviceIds: string[];
    serviceNames?: string[];
    datetime: string;
    duration: number;
  }): Promise<string | null> => {
    if (!user) return 'Not signed in';
    const result = await api.createAppointment({
      userEmail: user.email,
      userName: user.name,
      barberId: params.barberId,
      serviceIds: params.serviceIds,
      datetime: params.datetime,
      duration: params.duration,
    });
    if (result.error) return result.error;
    const newAppt = result.data;
    if (newAppt) {
      const date = params.datetime.split('T')[0];
      const time = params.datetime.split('T')[1]?.slice(0, 5) || '';
      setAppointments((prev) => [...prev, {
        id: newAppt.id,
        barberId: params.barberId,
        barberName: params.barberName || '',
        serviceNames: params.serviceNames || [],
        date,
        time,
        status: 'upcoming' as const,
      }]);
    }
    return null;
  }, [user?.id, user?.email, user?.name]);

  const cancelAppointment = useCallback(async (id: string): Promise<string | null> => {
    const result = await api.cancelAppointment(id);
    if (result.error === null) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
      );
      return null;
    }
    return result.error;
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
        appointments, upcoming, history, addAppointment, cancelAppointment,
        userName: user?.name || 'Guest',
        userEmail: user?.email || '',
        shopReviews,
        loading,
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
