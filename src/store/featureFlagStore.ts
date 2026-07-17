import { create } from "zustand";
import { defaultFeatureFlags } from "@/config/features";
import type { FeatureFlag } from "@/types/cms";

interface FlagStore {
  flags: FeatureFlag[];
  setFlags: (f: FeatureFlag[]) => void;
  isEnabled: (key: string) => boolean;
  setEnabled: (key: string, enabled: boolean) => void;
}

export const useFeatureFlagStore = create<FlagStore>((set, get) => ({
  flags: defaultFeatureFlags,
  setFlags: (flags) => set({ flags }),
  isEnabled: (key) => get().flags.find((f) => f.key === key)?.enabled ?? false,
  setEnabled: (key, enabled) =>
    set((s) => ({ flags: s.flags.map((f) => (f.key === key ? { ...f, enabled } : f)) })),
}));
