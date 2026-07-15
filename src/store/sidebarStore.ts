import { create } from "zustand";

interface SidebarStore {
  leftOpen: boolean;
  rightOpen: boolean;
  toggleLeft: () => void;
  toggleRight: () => void;
  setLeft: (v: boolean) => void;
  setRight: (v: boolean) => void;
}
export const useSidebarStore = create<SidebarStore>((set) => ({
  leftOpen: true,
  rightOpen: true,
  toggleLeft: () => set((s) => ({ leftOpen: !s.leftOpen })),
  toggleRight: () => set((s) => ({ rightOpen: !s.rightOpen })),
  setLeft: (leftOpen) => set({ leftOpen }),
  setRight: (rightOpen) => set({ rightOpen }),
}));
