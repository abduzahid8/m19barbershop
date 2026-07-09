import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { mapBarbers, mapServices } from '../services/mappers';
import type { Barber, Service } from '../data';
import type { AppointmentRow, ReviewRow, LoyaltyRow } from '../lib/database.types';

function useQuery<T>(fetcher: () => Promise<api.ApiResult<T[]>>, deps: any[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetcher();
    if (result.error) {
      setError(result.error);
    } else {
      setData(result.data || []);
    }
    setLoading(false);
  }, deps);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

function useSingleQuery<T>(fetcher: () => Promise<api.ApiResult<T | null>>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetcher();
    if (result.error) {
      setError(result.error);
    } else {
      setData(result.data);
    }
    setLoading(false);
  }, deps);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useBarbers() {
  const [data, setData] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await api.getBarbers();
    if (result.error) {
      setError(result.error);
    } else {
      setData(mapBarbers(result.data || []));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useServices() {
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await api.getServices();
    if (result.error) {
      setError(result.error);
    } else {
      setData(mapServices(result.data || []));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useAppointments() {
  const { user } = useAuth();
  return useQuery<AppointmentRow>(
    () => user ? api.getAppointments(user.id) : Promise.resolve({ data: [], error: null }),
    [user?.id]
  );
}

export function useReviews() {
  return useQuery<ReviewRow>(() => api.getReviews(), []);
}

export function useLoyalty() {
  const { user } = useAuth();
  return useSingleQuery<LoyaltyRow>(
    () => user ? api.getLoyalty(user.id) : Promise.resolve({ data: null, error: null }),
    [user?.id]
  );
}
