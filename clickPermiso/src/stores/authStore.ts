import { create } from 'zustand';
import { authApi, perfilApi } from '../api/apiClient';
import type { Perfil } from '../types';

interface AuthUser {
  id: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  perfil: Perfil | null;
  initialized: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => void;
  fetchPerfil: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  perfil: null,
  initialized: false,

  initialize: async () => {
    const token   = localStorage.getItem('token');
    const userStr = localStorage.getItem('auth_user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as AuthUser;
        set({ user });
        await get().fetchPerfil();
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('auth_user');
      }
    }
    set({ initialized: true });
  },

  login: async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      localStorage.setItem('token', response.token);
      const user: AuthUser = { id: response.id, email: response.email };
      localStorage.setItem('auth_user', JSON.stringify(user));
      set({ user });
      await get().fetchPerfil();
      return { error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al iniciar sesión';
      return { error: msg };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_user');
    set({ user: null, perfil: null });
  },

  fetchPerfil: async () => {
    try {
      const perfil = await perfilApi.getMe();
      set({ perfil });
    } catch (err) {
      console.error('Error al cargar perfil:', err);
    }
  },
}));