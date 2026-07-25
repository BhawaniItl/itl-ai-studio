/* eslint-disable prettier/prettier */
import { create } from "zustand";
import type { ChatMessage, ChatThread } from "@/types";

/**
 * Partial thread data as it arrives from lighter-weight backend responses
 * (e.g. the conversation summary returned by POST /ai/query, which never
 * includes `messages`). `id` is the only required field.
 */
type ThreadPatch = Partial<Omit<ChatThread, "id">> & Pick<ChatThread, "id">;

interface ChatStore {
  threads: ChatThread[];

  /** Full replace — used only for the initial "load my conversations" fetch. */
  replaceThreads: (threads: ChatThread[]) => void;

  /**
   * Replaces only the threads belonging to one Module+Tool workspace, leaving
   * every other workspace's cached threads untouched. This is what the
   * sidebar uses on every fetch — a plain `replaceThreads()` would wipe out
   * e.g. GST→Ask Bot's already-loaded threads the moment the user switches
   * to GST→Case Law and its list comes back.
   */
  setThreadsForScope: (moduleId: string, toolId: string, threads: ChatThread[]) => void;

  /**
   * Merge a thread into the store.
   * - If `patch.messages` is provided, it's treated as authoritative (e.g. a full
   *   conversation fetch) and replaces the thread's message list entirely.
   * - If `patch.messages` is omitted, existing messages are preserved untouched —
   *   this is what makes it safe to call after every /ai/query response without
   *   wiping the optimistic user message that's already on screen.
   */
  upsertThread: (patch: ThreadPatch) => void;

  createThread: (t: ChatThread) => void;
  updateThread: (id: string, patch: Partial<ChatThread>) => void;
  deleteThread: (id: string) => void;

  addMessage: (threadId: string, message: ChatMessage) => void;
  updateMessage: (threadId: string, messageId: string, patch: Partial<ChatMessage>) => void;
  /** Replaces one message with another (e.g. swapping an optimistic id for the real backend id). */
  replaceMessage: (threadId: string, messageId: string, message: ChatMessage) => void;
  removeMessage: (threadId: string, messageId: string) => void;
  clearMessages: (threadId: string) => void;
  /** Wipes all local chat state — used on logout so the next user never sees a stale sidebar. */
  reset: () => void;
}

const nowIso = () => new Date().toISOString();

export const useChatStore = create<ChatStore>((set) => ({
  threads: [],

  replaceThreads: (threads) => set({ threads }),

  setThreadsForScope: (moduleId, toolId, scopedThreads) =>
    set((s) => ({
      threads: [
        ...s.threads.filter((t) => !(t.moduleId === moduleId && t.toolId === toolId)),
        ...scopedThreads,
      ],
    })),

  upsertThread: (patch) =>
    set((s) => {
      const index = s.threads.findIndex((t) => t.id === patch.id);

      if (index === -1) {
        const created: ChatThread = {
          id: patch.id,
          title: patch.title ?? "New chat",
          moduleId: patch.moduleId ?? "income-tax",
          toolId: patch.toolId ?? "ask",
          updatedAt: patch.updatedAt ?? nowIso(),
          messages: patch.messages ?? [],
          hasLoadedMessages: patch.hasLoadedMessages,
          pinned: patch.pinned,
          favorite: patch.favorite,
          folder: patch.folder,
          tags: patch.tags,
        };
        return { threads: [created, ...s.threads] };
      }

      return {
        threads: s.threads.map((t, i) =>
          i === index
            ? {
                ...t,
                ...patch,
                // Never silently drop messages that are already on screen —
                // only overwrite when the caller explicitly provides a new list.
                messages: patch.messages ?? t.messages,
                hasLoadedMessages: patch.messages ? true : (patch.hasLoadedMessages ?? t.hasLoadedMessages),
              }
            : t,
        ),
      };
    }),

  createThread: (t) => set((s) => ({ threads: [t, ...s.threads] })),

  updateThread: (id, patch) =>
    set((s) => ({
      threads: s.threads.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })),

  deleteThread: (id) =>
    set((s) => ({ threads: s.threads.filter((t) => t.id !== id) })),

  addMessage: (threadId, message) =>
    set((s) => ({
      threads: s.threads.map((t) => {
        if (t.id !== threadId) return t;
        // Guard against duplicate inserts (e.g. a re-fired effect or a double click).
        if (t.messages.some((m) => m.id === message.id)) return t;
        return { ...t, messages: [...t.messages, message], updatedAt: nowIso() };
      }),
    })),

  updateMessage: (threadId, messageId, patch) =>
    set((s) => ({
      threads: s.threads.map((t) =>
        t.id === threadId
          ? {
              ...t,
              messages: t.messages.map((m) => (m.id === messageId ? { ...m, ...patch } : m)),
            }
          : t,
      ),
    })),

  replaceMessage: (threadId, messageId, message) =>
    set((s) => ({
      threads: s.threads.map((t) =>
        t.id === threadId
          ? { ...t, messages: t.messages.map((m) => (m.id === messageId ? message : m)) }
          : t,
      ),
    })),

  removeMessage: (threadId, messageId) =>
    set((s) => ({
      threads: s.threads.map((t) =>
        t.id === threadId ? { ...t, messages: t.messages.filter((m) => m.id !== messageId) } : t,
      ),
    })),

  clearMessages: (threadId) =>
    set((s) => ({
      threads: s.threads.map((t) => (t.id === threadId ? { ...t, messages: [] } : t)),
    })),

  reset: () => set({ threads: [] }),
}));