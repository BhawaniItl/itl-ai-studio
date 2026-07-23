/* eslint-disable prettier/prettier */

import { useAuthStore } from "@/store/authStore";

/* ---------- State ---------- */

export const useCurrentUser = () =>
  useAuthStore((state) => state.user);

export const useToken = () =>
  useAuthStore((state) => state.token);

export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);

export const useIsAdmin = () =>
  useAuthStore((state) => state.user?.is_admin ?? false);

/* ---------- Actions ---------- */

export const useSetSession = () =>
  useAuthStore((state) => state.setSession);

export const useUpdateUser = () =>
  useAuthStore((state) => state.updateUser);

export const useClearAuth = () =>
  useAuthStore((state) => state.clear);