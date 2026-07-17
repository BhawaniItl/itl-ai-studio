import { create } from "zustand";
import type { AppNotification } from "@/types/cms";
import { seedNotifications } from "@/mock/notifications";

interface NotificationStore {
  items: AppNotification[];
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  add: (n: AppNotification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  unread: () => number;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  items: seedNotifications,
  drawerOpen: false,
  setDrawerOpen: (v) => set({ drawerOpen: v }),
  add: (n) => set((s) => ({ items: [n, ...s.items] })),
  markRead: (id) =>
    set((s) => ({ items: s.items.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
  markAllRead: () => set((s) => ({ items: s.items.map((n) => ({ ...n, read: true })) })),
  remove: (id) => set((s) => ({ items: s.items.filter((n) => n.id !== id) })),
  unread: () => get().items.filter((n) => !n.read).length,
}));
