import { create } from "zustand";
import type { ReactNode } from "react";

export type ModalKind =
  | "confirm"
  | "delete"
  | "alert"
  | "form"
  | "wizard"
  | "preview"
  | "pdf"
  | "image"
  | "markdown"
  | "custom";

export interface ModalConfig {
  id: string;
  kind: ModalKind;
  title?: string;
  description?: string;
  content?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  resolve?: (value: unknown) => void;
}

interface ModalStore {
  stack: ModalConfig[];
  open: (m: Omit<ModalConfig, "id"> & { id?: string }) => Promise<unknown>;
  close: (id: string, value?: unknown) => void;
  closeAll: () => void;
}

export const useModalStore = create<ModalStore>((set, get) => ({
  stack: [],
  open: (m) =>
    new Promise((resolve) => {
      const id = m.id ?? crypto.randomUUID();
      set((s) => ({ stack: [...s.stack, { ...m, id, resolve }] }));
    }),
  close: (id, value) => {
    const modal = get().stack.find((m) => m.id === id);
    modal?.resolve?.(value);
    set((s) => ({ stack: s.stack.filter((m) => m.id !== id) }));
  },
  closeAll: () => set({ stack: [] }),
}));

/** Promise-based modal helpers. */
export const modal = {
  confirm: (opts: { title: string; description?: string; confirmLabel?: string; destructive?: boolean }) =>
    useModalStore.getState().open({ kind: "confirm", ...opts }) as Promise<boolean>,
  alert: (opts: { title: string; description?: string }) =>
    useModalStore.getState().open({ kind: "alert", ...opts }),
  preview: (opts: { title?: string; content: ReactNode }) =>
    useModalStore.getState().open({ kind: "preview", ...opts }),
};
