import { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { Appointment, ShopReview } from '../data';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';
import type { AppointmentRow, ReviewRow, LoyaltyRow } from '../lib/database.types';

interface AppState {
  appointments: Appointment[];
  upcoming: Appointment | null;
  history: Appointment[];
  addAppointment: (a: Omit<Appointment, 'id'>) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
  userName: string;
  shopReviews: ShopReview[];
  addShopReview: (review: { author: string; rating: number; text: string }) => Promise<void>;
  loyaltyPoints: number;
  totalVisits: number;
  loyaltyTier: string;
  loading: boolean;
}

const AppContext = createContext<AppState | null>(null);

function toAppointment(row: AppointmentRow): Appointment {
  return {
    id: row.id,
    barberId: row.barber_id,
    barberName: row.barber_name,
    serviceNames: row.service_names,
    date: row.date,
    time: row.time,
    status: row.status,
  };
}

function toShopReview(row: ReviewRow): ShopReview {
  return {
    id: row.id,
    author: row.author,
    rating: row.rating,
    text: row.text,
    date: row.date,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [shopReviews, setShopReviews] = useState<ShopReview[]>([]);
  const [loyalty, setLoyalty] = useState<LoyaltyRow | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) {
      setAppointments([]);
      setShopReviews([]);
      setLoyalty(null);
      setLoading(false);
      return;
    }

    const [apptResult, reviewResult, loyaltyResult] = await Promise.all([
      api.getAppointments(user.id),
      api.getReviews(),
      api.getLoyalty(user.id),
    ]);

    if (apptResult.data) setAppointments(apptResult.data.map(toAppointment));
    if (reviewResult.data) setShopReviews(reviewResult.data.map(toShopReview));
    if (loyaltyResult.data) setLoyalty(loyaltyResult.data);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const addAppointment = useCallback(async (draft: Omit<Appointment, 'id'>) => {
    if (!user) return;
    const result = await api.createAppointment({
      user_id: user.id,
      barber_id: draft.barberId,
      barber_name: draft.barberName,
      service_names: draft.serviceNames,
      date: draft.date,
      time: draft.time,
      status: draft.status,
    });
    if (result.data) {
      setAppointments((prev) => [...prev, toAppointment(result.data!)]);
    }
  }, [user?.id]);

  const cancelAppointment = useCallback(async (id: string) => {
    const result = await api.cancelAppointment(id);
    if (result.data) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
      );
    }
  }, []);

  const addShopReview = useCallback(async (draft: { author: string; rating: number; text: string }) => {
    if (!user) return;
    const result = await api.addReview({
      user_id: user.id,
      author: draft.author,
      rating: draft.rating,
      text: draft.text,
    });
    if (result.data) {
      setShopReviews((prev) => [toShopReview(result.data!), ...prev]);
    }
  }, [user?.id]);

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
        userName: user?.phone || 'Guest',
        shopReviews, addShopReview,
        loyaltyPoints: loyalty?.points || 0,
        totalVisits: loyalty?.total_visits || 0,
        loyaltyTier: loyalty?.tier || 'bronze',
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
