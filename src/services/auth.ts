import { supabase } from '../lib/supabase';
import type { ApiResult } from './api';

export interface AuthUser {
  id: string;
  phone: string;
}

// ─── Phone OTP ─────────────────────────────────────────────

export async function sendOTP(phone: string): Promise<ApiResult<void>> {
  const { error } = await supabase.auth.signInWithOtp({ phone });
  if (error) return { data: null, error: error.message };
  return { data: undefined, error: null };
}

export async function verifyOTP(
  phone: string,
  token: string
): Promise<ApiResult<AuthUser>> {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });
  if (error || !data.user) {
    return { data: null, error: error?.message || 'Verification failed' };
  }
  return {
    data: { id: data.user.id, phone: data.user.phone || phone },
    error: null,
  };
}

// ─── Session ───────────────────────────────────────────────

export async function getSession(): Promise<ApiResult<AuthUser | null>> {
  const { data, error } = await supabase.auth.getSession();
  if (error) return { data: null, error: error.message };
  if (!data.session?.user) return { data: null, error: null };
  return {
    data: {
      id: data.session.user.id,
      phone: data.session.user.phone || '',
    },
    error: null,
  };
}

export async function signOut(): Promise<ApiResult<void>> {
  const { error } = await supabase.auth.signOut();
  if (error) return { data: null, error: error.message };
  return { data: undefined, error: null };
}

// ─── Auth State Listener ───────────────────────────────────

export function onAuthStateChange(
  callback: (user: AuthUser | null) => void
) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      callback({ id: session.user.id, phone: session.user.phone || '' });
    } else {
      callback(null);
    }
  });
}
