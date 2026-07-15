import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultTheme, type ThemeConfig } from "@/config/theme";

interface ThemeStore {
  theme: ThemeConfig;
  setMode: (mode: ThemeConfig["mode"]) => void;
  update: (patch: Partial<ThemeConfig>) => void;
  reset: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: defaultTheme,
      setMode: (mode) => set((s) => ({ theme: { ...s.theme, mode } })),
      update: (patch) => set((s) => ({ theme: { ...s.theme, ...patch } })),
      reset: () => set({ theme: defaultTheme }),
    }),
    { name: "itl.theme" },
  ),
);
