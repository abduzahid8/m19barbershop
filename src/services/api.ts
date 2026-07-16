import type { Barber, Service, Appointment, ShopReview } from '../data';
import { config } from './config';

export interface ApiResult<T> {
  data: T | null;
  error: string | null;
}

async function proxyFetch<T>(path: string, options: RequestInit = {}): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${config.proxyUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    const json = await res.json();
    if (!json.success) {
      return { data: null, error: json.error || 'Request failed' };
    }
    return { data: json.data as T, error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
}

// ─── Barbers (Altegio) ─────────────────────────────────

export async function getBarbers(): Promise<ApiResult<Barber[]>> {
  return proxyFetch('/staff');
}

export async function getBarberById(id: string): Promise<ApiResult<Barber | null>> {
  return proxyFetch(`/staff/${id}`);
}

// ─── Services (Altegio) ────────────────────────────────

export async function getServices(): Promise<ApiResult<Service[]>> {
  return proxyFetch('/services');
}

// ─── Time Slots (Altegio timetable) ────────────────────

export interface TimeSlot {
  time: string;
  available: boolean;
}

export async function getTimeSlotsForBarber(
  barberId: string,
  date: string
): Promise<ApiResult<TimeSlot[]>> {
  return proxyFetch(`/staff/${barberId}/slots?date=${date}`);
}

// ─── Appointments (Altegio) ────────────────────────────

export async function createAppointment(params: {
  userEmail: string;
  userName: string;
  barberId: string;
  serviceIds: string[];
  datetime: string;
  duration: number;
}): Promise<ApiResult<{ id: string }>> {
  return proxyFetch('/appointments', {
    method: 'POST',
    body: JSON.stringify({
      staff_id: params.barberId,
      service_ids: params.serviceIds,
      client_name: params.userName,
      client_email: params.userEmail,
      datetime: params.datetime,
      seance_length: params.duration,
    }),
  });
}

export async function getAppointments(
  email: string
): Promise<ApiResult<Appointment[]>> {
  return proxyFetch(`/appointments?email=${encodeURIComponent(email)}`);
}

export async function cancelAppointment(
  id: string
): Promise<ApiResult<null>> {
  return proxyFetch(`/appointments/${id}`, { method: 'DELETE' });
}

// ─── Reviews (Altegio comments) ────────────────────────

export async function getReviews(): Promise<ApiResult<ShopReview[]>> {
  return proxyFetch('/reviews');
}
