import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "user";
}
interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  setSession: (u: AuthUser, t: string) => void;
  clear: () => void;
}
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setSession: (user, token) => set({ user, token }),
      clear: () => set({ user: null, token: null }),
    }),
    { name: "itl.auth" },
  ),
);
