import { create } from "zustand";

interface WorkspaceStore {
  activeModuleId: string;
  activeToolId: string;
  activeThreadId: string | null;
  setModule: (id: string) => void;
  setTool: (id: string) => void;
  setThread: (id: string | null) => void;
}
export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  activeModuleId: "income-tax",
  activeToolId: "ask",
  activeThreadId: "t1",
  setModule: (id) => set({ activeModuleId: id }),
  setTool: (id) => set({ activeToolId: id }),
  setThread: (id) => set({ activeThreadId: id }),
}));
