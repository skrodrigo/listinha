import { api } from '@/infra/api';
import { User, Session } from '@/types';

export const authService = {
  async getSession(): Promise<Session | null> {
    try {
      const response = await api.get<Session>('/api/auth/session');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  async logout(): Promise<void> {
    await api.post('/api/auth/logout');
  },

  async register(email: string, password: string): Promise<void> {
    await api.post('/api/register', { email, password });
  },

  async login(email: string, password: string): Promise<void> {
    await api.post('/api/auth/sign-in/email', { email, password });
  },
};
