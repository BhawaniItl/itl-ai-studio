import { create } from "zustand";
import type { ChatMessage, ChatThread } from "@/types";

interface ChatStore {
  threads: ChatThread[];
  replaceThreads: (threads: ChatThread[]) => void;
  upsertThread: (thread: ChatThread) => void;
  createThread: (thread: ChatThread) => void;
  updateThread: (id: string, patch: Partial<ChatThread>) => void;
  deleteThread: (id: string) => void;
  addMessage: (threadId: string, message: ChatMessage) => void;
  updateMessage: (threadId: string, messageId: string, patch: Partial<ChatMessage>) => void;
  removeMessage: (threadId: string, messageId: string) => void;
  clearMessages: (threadId: string) => void;
}

const now = () => new Date().toISOString();
const messageKey = (message: ChatMessage) =>
  `${message.role}:${message.content.trim()}:${message.createdAt}`;

const mergeMessages = (current: ChatMessage[], incoming: ChatMessage[]) => {
  const seenIds = new Set<string>();
  const seenKeys = new Set<string>();

  return [...current, ...incoming].filter((message) => {
    const key = messageKey(message);
    if (seenIds.has(message.id) || seenKeys.has(key)) return false;
    seenIds.add(message.id);
    seenKeys.add(key);
    return true;
  });
};

const orderThreads = (threads: ChatThread[]) =>
  [...threads].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));

const touchThread = (thread: ChatThread, patch: Partial<ChatThread> = {}): ChatThread => ({
  ...thread,
  ...patch,
  updatedAt: patch.updatedAt ?? now(),
});

export const useChatStore = create<ChatStore>((set) => ({
  threads: [],

  replaceThreads: (incoming) =>
    set((state) => {
      const localById = new Map(state.threads.map((thread) => [thread.id, thread]));
      const merged = incoming.map((thread) => {
        const local = localById.get(thread.id);
        return local
          ? { ...thread, messages: mergeMessages(thread.messages, local.messages) }
          : thread;
      });
      const optimisticOnly = state.threads.filter(
        (thread) => thread.id.startsWith("local-") && !merged.some((item) => item.id === thread.id),
      );
      return { threads: orderThreads([...optimisticOnly, ...merged]) };
    }),

  upsertThread: (thread) =>
    set((state) => {
      const existing = state.threads.find((item) => item.id === thread.id);
      const next = existing
        ? { ...existing, ...thread, messages: mergeMessages(existing.messages, thread.messages) }
        : thread;
      return { threads: orderThreads([next, ...state.threads.filter((item) => item.id !== thread.id)]) };
    }),

  createThread: (thread) =>
    set((state) => ({ threads: orderThreads([thread, ...state.threads.filter((item) => item.id !== thread.id)]) })),

  updateThread: (id, patch) =>
    set((state) => ({
      threads: orderThreads(
        state.threads.map((thread) => (thread.id === id ? touchThread(thread, patch) : thread)),
      ),
    })),

  deleteThread: (id) => set((state) => ({ threads: state.threads.filter((thread) => thread.id !== id) })),

  addMessage: (threadId, message) =>
    set((state) => ({
      threads: orderThreads(
        state.threads.map((thread) =>
          thread.id === threadId && !thread.messages.some((item) => item.id === message.id)
            ? touchThread(thread, { messages: mergeMessages(thread.messages, [message]) })
            : thread,
        ),
      ),
    })),

  updateMessage: (threadId, messageId, patch) =>
    set((state) => ({
      threads: orderThreads(
        state.threads.map((thread) =>
          thread.id === threadId
            ? touchThread(thread, {
                messages: thread.messages.map((message) =>
                  message.id === messageId ? { ...message, ...patch } : message,
                ),
              })
            : thread,
        ),
      ),
    })),

  removeMessage: (threadId, messageId) =>
    set((state) => ({
      threads: state.threads.map((thread) =>
        thread.id === threadId
          ? touchThread(thread, { messages: thread.messages.filter((message) => message.id !== messageId) })
          : thread,
      ),
    })),

  clearMessages: (threadId) =>
    set((state) => ({
      threads: state.threads.map((thread) =>
        thread.id === threadId ? touchThread(thread, { messages: [] }) : thread,
      ),
    })),
}));
