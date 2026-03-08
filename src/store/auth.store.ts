import { access_key, user_token } from "@/constants";
import { User } from "@/types";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),

  login: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(access_key, token);
      localStorage.setItem(user_token, JSON.stringify(user));
    }
    set({ user, token });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(access_key);
      localStorage.removeItem(user_token);
    }
    set({ user: null, token: null });
  },

  initialize: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(access_key);
      const userStr = localStorage.getItem(user_token);
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ user, token, isLoading: false });
          return;
        } catch {}
      }
    }
    set({ isLoading: false });
  },
}));
