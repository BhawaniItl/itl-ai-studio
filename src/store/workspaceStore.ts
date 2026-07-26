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
  activeModuleId: "gst",
  activeToolId: "ask",
  activeThreadId: null,
  // Switching module or tool moves to a completely different conversation
  // namespace (module+tool) — any previously selected conversation belongs
  // to the old workspace and must not stay selected in the new one.
  setModule: (id) => set({ activeModuleId: id, activeThreadId: null }),
  setTool: (id) => set({ activeToolId: id, activeThreadId: null }),
  setThread: (id) => set({ activeThreadId: id }),
  reset: () => set({ activeModuleId: "gst", activeToolId: "ask", activeThreadId: null }),
}));