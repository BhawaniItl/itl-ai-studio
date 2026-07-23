/* eslint-disable prettier/prettier */
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  firm?: string;
  mobile?: string;
  status: "APPROVED" | "PENDING" | "SUSPENDED";
  plan?: string;
  is_admin: boolean;
  is_staff: boolean;
}

interface AuthStore {
  user: AuthUser | null;
  token: string | null;

  setSession: (user: AuthUser, token: string) => void;
  updateUser: (changes: Partial<AuthUser>) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      setSession: (user, token) =>
        set({
          user,
          token,
        }),

      updateUser: (changes) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                ...changes,
              }
            : null,
        })),

      clear: () =>
        set({
          user: null,
          token: null,
        }),
    }),
    {
      name: "itl.auth",
    },
  ),
);

// ---------- Selectors ----------

export const useCurrentUser = () =>
  useAuthStore((state) => state.user);

export const useToken = () =>
  useAuthStore((state) => state.token);

export const useIsAuthenticated = () =>
  useAuthStore((state) => !!state.token);

export const useIsAdmin = () =>
  useAuthStore((state) => !!state.user?.is_admin);

export const useSetSession = () =>
  useAuthStore((state) => state.setSession);

export const useUpdateUser = () =>
  useAuthStore((state) => state.updateUser);

export const useClearAuth = () =>
  useAuthStore((state) => state.clear);