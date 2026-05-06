import { create } from 'zustand';
import { supabase } from '../supabaseClient';
import type { User, Session } from '@supabase/supabase-js';
import type { Perfil } from '../types';

interface AuthState {
  user: User | null;
  session: Session | null;
  perfil: Perfil | null;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  fetchPerfil: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  perfil: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        set({ user: session.user, session });
        await get().fetchPerfil();
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      set({ initialized: true });
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ user: session?.user ?? null, session });
      if (session?.user) {
        await get().fetchPerfil();
      } else {
        set({ perfil: null });
      }
    });
  },

  login: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ loading: false });
    return { error: error?.message ?? null };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, perfil: null });
  },

  fetchPerfil: async () => {
    const userId = get().user?.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data && !error) {
      set({ perfil: data as Perfil });
    }
  },
}));
