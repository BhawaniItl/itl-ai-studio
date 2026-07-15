import { create } from "zustand";
import type { ChatMessage, ChatThread } from "@/types";
import { sampleThreads } from "@/mock/workspace";

interface ChatStore {
  threads: ChatThread[];
  addMessage: (threadId: string, message: ChatMessage) => void;
  createThread: (t: ChatThread) => void;
  updateThread: (id: string, patch: Partial<ChatThread>) => void;
  deleteThread: (id: string) => void;
}
export const useChatStore = create<ChatStore>((set) => ({
  threads: sampleThreads,
  addMessage: (threadId, message) =>
    set((s) => ({
      threads: s.threads.map((t) =>
        t.id === threadId
          ? { ...t, messages: [...t.messages, message], updatedAt: new Date().toISOString() }
          : t,
      ),
    })),
  createThread: (t) => set((s) => ({ threads: [t, ...s.threads] })),
  updateThread: (id, patch) =>
    set((s) => ({ threads: s.threads.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
  deleteThread: (id) => set((s) => ({ threads: s.threads.filter((t) => t.id !== id) })),
}));
