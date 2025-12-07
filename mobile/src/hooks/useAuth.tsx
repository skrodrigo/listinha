import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/infra/services';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, signIn: async () => { }, signOut: async () => { }, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    setLoading(true);
    try {
      const session = await authService.getSession();
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  const signIn = async () => {
    await loadUser();
  };

  const signOut = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Failed to logout on backend', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};

