import { create } from "zustand";

interface CommandStore {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
  recent: string[];
  pushRecent: (q: string) => void;
}

export const useCommandStore = create<CommandStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggle: () => set((s) => ({ open: !s.open })),
  recent: [],
  pushRecent: (q) =>
    set((s) => ({ recent: [q, ...s.recent.filter((x) => x !== q)].slice(0, 8) })),
}));
