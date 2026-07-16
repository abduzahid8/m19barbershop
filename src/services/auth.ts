import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { config } from './config';

WebBrowser.maybeCompleteAuthSession();

const STORAGE_KEY = 'm19_user';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export async function getSession(): Promise<{ data: AuthUser | null; error: string | null }> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return { data: null, error: null };
    return { data: JSON.parse(json), error: null };
  } catch {
    return { data: null, error: null };
  }
}

export async function saveSession(user: AuthUser): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export async function guestSignIn(): Promise<AuthUser> {
  const guest: AuthUser = {
    id: 'guest',
    email: 'guest@dev.local',
    name: 'Guest',
  };
  await saveSession(guest);
  return guest;
}

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: config.googleClientId,
    iosClientId: config.googleIosClientId,
    androidClientId: config.googleAndroidClientId,
    scopes: ['profile', 'email'],
  });

  return { request, response, promptAsync };
}

export async function fetchGoogleUser(accessToken: string): Promise<AuthUser | null> {
  try {
    const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    if (!data.id) return null;
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      avatar: data.picture,
    };
  } catch {
    return null;
  }
}
