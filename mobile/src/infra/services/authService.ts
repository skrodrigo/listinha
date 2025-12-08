import { api } from '@/infra/api';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'sacolafacil.token';

export const authService = {
  async register(data: any): Promise<void> {
    await api.post('/api/auth/register', data);
  },

  async login(data: any): Promise<void> {
    const response = await api.post<{ token: string }>('/api/auth/login', data);
    const { token } = response.data;
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  async getSession(): Promise<boolean> {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return true;
    }
    return false;
  },

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    delete api.defaults.headers.common['Authorization'];
  },
};
