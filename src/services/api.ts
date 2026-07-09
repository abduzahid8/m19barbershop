import { supabase } from '../lib/supabase';
import type {
  BarberRow,
  ServiceRow,
  AppointmentRow,
  ReviewRow,
  TimeSlotRow,
  LoyaltyRow,
  ProfileRow,
} from '../lib/database.types';

export interface ApiResult<T> {
  data: T | null;
  error: string | null;
}

function handleError(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    return (err as { message: string }).message;
  }
  return 'An unexpected error occurred';
}

// ─── Barbers ───────────────────────────────────────────────

export async function getBarbers(): Promise<ApiResult<BarberRow[]>> {
  const { data, error }: any = await supabase
    .from('barbers')
    .select('*')
    .order('name');
  if (error) return { data: null, error: handleError(error) };
  return { data: data as BarberRow[], error: null };
}

export async function getBarberById(id: string): Promise<ApiResult<BarberRow>> {
  const { data, error }: any = await supabase
    .from('barbers')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return { data: null, error: handleError(error) };
  return { data: data as BarberRow, error: null };
}

// ─── Services ──────────────────────────────────────────────

export async function getServices(): Promise<ApiResult<ServiceRow[]>> {
  const { data, error }: any = await supabase
    .from('services')
    .select('*')
    .order('price');
  if (error) return { data: null, error: handleError(error) };
  return { data: data as ServiceRow[], error: null };
}

// ─── Time Slots ────────────────────────────────────────────

export async function getTimeSlotsForBarber(
  barberId: string,
  date: string
): Promise<ApiResult<TimeSlotRow[]>> {
  const { data, error }: any = await supabase
    .from('time_slots')
    .select('*')
    .eq('barber_id', barberId)
    .eq('date', date)
    .order('time');
  if (error) return { data: null, error: handleError(error) };
  return { data: data as TimeSlotRow[], error: null };
}

// ─── Appointments ──────────────────────────────────────────

export async function createAppointment(
  appointment: {
    user_id: string;
    barber_id: string;
    barber_name: string;
    service_names: string[];
    date: string;
    time: string;
    status: string;
  }
): Promise<ApiResult<AppointmentRow>> {
  const { data, error }: any = await supabase
    .from('appointments')
    .insert(appointment)
    .select()
    .single();
  if (error) return { data: null, error: handleError(error) };
  return { data: data as AppointmentRow, error: null };
}

export async function getAppointments(
  userId: string
): Promise<ApiResult<AppointmentRow[]>> {
  const { data, error }: any = await supabase
    .from('appointments')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  if (error) return { data: null, error: handleError(error) };
  return { data: data as AppointmentRow[], error: null };
}

export async function cancelAppointment(
  id: string
): Promise<ApiResult<AppointmentRow>> {
  const { data, error }: any = await supabase
    .from('appointments')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .select()
    .single();
  if (error) return { data: null, error: handleError(error) };
  return { data: data as AppointmentRow, error: null };
}

// ─── Reviews ───────────────────────────────────────────────

export async function getReviews(): Promise<ApiResult<ReviewRow[]>> {
  const { data, error }: any = await supabase
    .from('reviews')
    .select('*')
    .order('date', { ascending: false });
  if (error) return { data: null, error: handleError(error) };
  return { data: data as ReviewRow[], error: null };
}

export async function addReview(
  review: {
    user_id: string | null;
    author: string;
    rating: number;
    text: string;
  }
): Promise<ApiResult<ReviewRow>> {
  const { data, error }: any = await supabase
    .from('reviews')
    .insert({
      ...review,
      date: new Date().toISOString().split('T')[0],
    })
    .select()
    .single();
  if (error) return { data: null, error: handleError(error) };
  return { data: data as ReviewRow, error: null };
}

// ─── Loyalty ───────────────────────────────────────────────

export async function getLoyalty(
  userId: string
): Promise<ApiResult<LoyaltyRow>> {
  const { data, error }: any = await supabase
    .from('loyalty_points')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) return { data: null, error: handleError(error) };
  return { data: data as LoyaltyRow, error: null };
}

// ─── Profile ───────────────────────────────────────────────

export async function getProfile(
  userId: string
): Promise<ApiResult<ProfileRow>> {
  const { data, error }: any = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return { data: null, error: handleError(error) };
  return { data: data as ProfileRow, error: null };
}

export async function updateProfile(
  userId: string,
  updates: Partial<Omit<ProfileRow, 'id' | 'created_at' | 'phone'>>
): Promise<ApiResult<ProfileRow>> {
  const { data, error }: any = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) return { data: null, error: handleError(error) };
  return { data: data as ProfileRow, error: null };
}

// ─── Storage ───────────────────────────────────────────────

export async function uploadBarberImage(
  barberId: string,
  uri: string
): Promise<ApiResult<string>> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const ext = uri.split('.').pop() || 'jpg';
  const filePath = `${barberId}/${Date.now()}.${ext}`;

  const { error: uploadError }: any = await supabase.storage
    .from('barber-portfolio')
    .upload(filePath, blob, { contentType: `image/${ext}` });
  if (uploadError) return { data: null, error: handleError(uploadError) };

  const { data: signedUrlData, error: signedError }: any = await supabase.storage
    .from('barber-portfolio')
    .createSignedUrl(filePath, 60 * 60 * 24 * 7);
  if (signedError) return { data: null, error: handleError(signedError) };

  return { data: signedUrlData.signedUrl, error: null };
}

export async function getSignedUrl(
  path: string
): Promise<ApiResult<string>> {
  const { data, error }: any = await supabase.storage
    .from('barber-portfolio')
    .createSignedUrl(path, 60 * 60 * 24 * 7);
  if (error) return { data: null, error: handleError(error) };
  return { data: data?.signedUrl, error: null };
}
