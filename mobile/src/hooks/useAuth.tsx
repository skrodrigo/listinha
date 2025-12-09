import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/infra/services';
import { useConnectivity } from '@/context/ConnectivityContext';

interface AuthContextType {
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ isAuthenticated: false, signIn: async () => { }, signOut: async () => { }, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isOffline } = useConnectivity();

  useEffect(() => {
    async function checkSession() {
      try {
        const sessionExists = await authService.getSession();
        setIsAuthenticated(sessionExists);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const signIn = async () => {
    const sessionExists = await authService.getSession();
    setIsAuthenticated(sessionExists);
  };

  const signOut = async () => {
    try {
      await authService.logout();
    } finally {
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: isAuthenticated || isOffline, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
