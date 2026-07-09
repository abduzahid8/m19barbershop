import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import * as authService from '../services/auth';
import type { AuthUser } from '../services/auth';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (phone: string) => Promise<string | null>;
  verifyCode: (phone: string, token: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authService.getSession().then((result) => {
      if (result.data) setUser(result.data);
      setIsLoading(false);
    });

    const subscription = authService.onAuthStateChange((u) => {
      setUser(u);
    });

    return () => subscription.data?.subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (phone: string): Promise<string | null> => {
    const result = await authService.sendOTP(phone);
    return result.error;
  }, []);

  const verifyCode = useCallback(
    async (phone: string, token: string): Promise<string | null> => {
      const result = await authService.verifyOTP(phone, token);
      if (result.data) setUser(result.data);
      return result.error;
    },
    []
  );

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        signIn,
        verifyCode,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
