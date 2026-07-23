/* eslint-disable prettier/prettier */
import { isAxiosError } from "axios";
import { api, endpoints } from "./api/api";
import { workspaceModules } from "@/mock/workspace";
import type { Attachment, ChatFolder, ChatMessage, ChatThread, Citation, PromptSuggestion } from "@/types";

interface AiQueryContext {
  moduleId?: string;
  toolId?: string;
}

interface BackendCitation {
  id?: string;
  title?: string;
  type?: string;
  ref?: string;
  snippet?: string;
  source_type?: string;
  sourceType?: string;
  url?: string;
}

interface BackendMessage {
  id?: string;
  role?: "user" | "assistant" | "system";
  content?: string;
  created_at?: string;
  createdAt?: string;
  citations?: BackendCitation[];
  sources?: BackendCitation[];
  references?: BackendCitation[];
  attachments?: Attachment[];
}

interface BackendThread {
  id?: string;
  title?: string;
  module_id?: string;
  moduleId?: string;
  tool_id?: string;
  toolId?: string;
  updated_at?: string;
  updatedAt?: string;
  pinned?: boolean;
  favorite?: boolean;
  folder?: string;
  tags?: string[];
  messages?: BackendMessage[];
}

interface BackendAiQueryResponse {
  message?: string;
  content?: string;
  role?: "assistant" | "user" | "system";
  citations?: BackendCitation[];
  sources?: BackendCitation[];
  references?: BackendCitation[];
  created_at?: string;
  createdAt?: string;
  thread?: BackendThread;
  conversation?: BackendThread;
  attachments?: Attachment[];
}

const normalizeCitation = (citation: BackendCitation, index: number): Citation => {
  const type = citation.type ?? citation.source_type ?? citation.sourceType ?? "act";
  return {
    id: citation.id ?? `${type}-${index}-${citation.title ?? "item"}`,
    title: citation.title ?? "Untitled source",
    type: type === "case" || type === "act" || type === "circular" || type === "notification"
      ? type
      : "act",
    ref: citation.ref ?? citation.url ?? "Source",
    snippet: citation.snippet,
  };
};

const normalizeMessage = (message: BackendMessage, fallbackRole: ChatMessage["role"] = "assistant"): ChatMessage => {
  const rawSources = message.sources ?? message.citations ?? message.references ?? [];
  return {
    id: message.id ?? crypto.randomUUID(),
    role: message.role ?? fallbackRole,
    content: message.content ?? message.message ?? "",
    createdAt: message.createdAt ?? message.created_at ?? new Date().toISOString(),
    citations: rawSources.map((source, index) => normalizeCitation(source, index)),
    attachments: message.attachments ?? [],
  };
};

const normalizeThread = (thread: BackendThread | null | undefined): ChatThread | null => {
  if (!thread || !thread.id) return null;
  return {
    id: thread.id,
    title: thread.title ?? "New chat",
    moduleId: thread.moduleId ?? thread.module_id ?? "income-tax",
    toolId: thread.toolId ?? thread.tool_id ?? "ask",
    updatedAt: thread.updatedAt ?? thread.updated_at ?? new Date().toISOString(),
    pinned: thread.pinned,
    favorite: thread.favorite,
    folder: thread.folder,
    tags: thread.tags,
    messages: (thread.messages ?? []).map((message) => normalizeMessage(message)),
  };
};

const getThreadPayload = (data: unknown): BackendThread[] => {
  if (Array.isArray(data)) return data as BackendThread[];
  if (data && typeof data === "object" && Array.isArray((data as { threads?: BackendThread[] }).threads)) {
    return (data as { threads: BackendThread[] }).threads;
  }
  return [];
};

const getTodoFallback = <T>(value: T): T => value;

export const workspaceService = {
  getModules: () => Promise.resolve(workspaceModules),
  getFolders: async (): Promise<ChatFolder[]> => {
    try {
      const { data } = await api.get<ChatFolder[]>(endpoints.chat.folders);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      if (isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 501)) {
        // TODO: replace with backend folders endpoint when available.
        return [];
      }
      throw error;
    }
  },
  getSuggestions: async (): Promise<PromptSuggestion[]> => {
    try {
      const { data } = await api.get<PromptSuggestion[]>(endpoints.workspace.templates);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      if (isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 501)) {
        // TODO: backend prompt-template endpoint is not available yet.
        return [];
      }
      throw error;
    }
  },
};

export const chatService = {
  listThreads: async (): Promise<ChatThread[]> => {
    try {
      const { data } = await api.get<unknown>(endpoints.chat.threads);
      return getThreadPayload(data)
        .map((thread) => normalizeThread(thread))
        .filter((thread): thread is ChatThread => thread !== null);
    } catch (error) {
      if (isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 501)) {
        // TODO: backend history listing endpoint is not available yet.
        return [];
      }
      throw error;
    }
  },
  getThread: async (id: string): Promise<ChatThread | null> => {
    try {
      const { data } = await api.get<BackendThread>(endpoints.chat.thread(id));
      return normalizeThread(data);
    } catch (error) {
      if (isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 501)) {
        // TODO: backend conversation detail endpoint is not available yet.
        return null;
      }
      throw error;
    }
  },
  sendMessage: async (
    threadId: string | null,
    prompt: string,
    context: AiQueryContext = {},
  ): Promise<{ message: ChatMessage; thread: ChatThread | null }> => {
    const { data } = await api.post<BackendAiQueryResponse>(endpoints.ai.query, {
      query: prompt,
      thread_id: threadId ?? undefined,
      module_id: context.moduleId,
      tool_id: context.toolId,
    });

    const normalizedThread = normalizeThread(data.thread ?? data.conversation ?? null);
    const normalizedMessage = normalizeMessage(
      {
        id: data.message ?? data.content ?? crypto.randomUUID(),
        role: "assistant",
        content: data.content ?? data.message ?? "",
        createdAt: data.createdAt ?? data.created_at ?? new Date().toISOString(),
        citations: data.citations ?? data.sources ?? data.references ?? [],
        attachments: data.attachments ?? [],
      },
      "assistant",
    );

    return {
      message: normalizedMessage,
      thread: normalizedThread,
    };
  },
};

export const chatFolders = getTodoFallback<ChatFolder[]>([]);
export const promptSuggestions = getTodoFallback<PromptSuggestion[]>([]);
