/* eslint-disable prettier/prettier */
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
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
  isAuthenticated: boolean;
  setSession: (u: AuthUser, t: string) => void;
  updateUser: (u: Partial<AuthUser>) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setSession: (user, token) =>
        set({
            user,
            token,
            isAuthenticated: true,
        }),
      clear: () =>
    set({
        user: null,
        token: null,
        isAuthenticated: false,
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
    }),
    { name: "itl.auth" },
  ),
);
