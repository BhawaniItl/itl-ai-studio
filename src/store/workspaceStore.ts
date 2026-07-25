/* eslint-disable prettier/prettier */
import { create } from "zustand";

interface WorkspaceStore {
  activeModuleId: string;
  activeToolId: string;
  activeThreadId: string | null;
  setModule: (id: string) => void;
  setTool: (id: string) => void;
  setThread: (id: string | null) => void;
  reset: () => void;
}
export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  activeModuleId: "income-tax",
  activeToolId: "ask",
  activeThreadId: null,

  setModule: (id) => set({ activeModuleId: id, activeThreadId: null }),
  setTool: (id) => set({ activeToolId: id, activeThreadId: null }),
  setThread: (id) => set({ activeThreadId: id }),
  reset: () => set({ activeModuleId: "income-tax", activeToolId: "ask", activeThreadId: null }),
}));