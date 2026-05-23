import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";
import type { AuthState } from "@/types/auth";

const STORAGE_KEY = "stocklogic-auth";

const authStorage: StateStorage = {
  getItem: (name) => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(name) ?? sessionStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (typeof window === "undefined") return;
    try {
      const parsed = JSON.parse(value) as {
        state?: Pick<AuthState, "user" | "persistSession">;
      };
      const remember = parsed.state?.persistSession ?? false;

      if (remember) {
        localStorage.setItem(name, value);
        sessionStorage.removeItem(name);
      } else {
        sessionStorage.setItem(name, value);
        localStorage.removeItem(name);
      }
    } catch {
      console.log("Failed to parse auth state, defaulting to sessionStorage");
      sessionStorage.setItem(name, value);
    }
  },
  removeItem: (name) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      persistSession: false,
      setAuth: (token, user, persistSession = true) => {
        set({ token, user, persistSession });
      },
      logout: () => {
        set({ token: null, user: null, persistSession: false });
        authStorage.removeItem(STORAGE_KEY);
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => authStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        persistSession: state.persistSession,
      }),
    },
  ),
);
