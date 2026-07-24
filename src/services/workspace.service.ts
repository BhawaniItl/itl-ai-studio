/* eslint-disable prettier/prettier */
import { isAxiosError } from "axios";
import { api, endpoints } from "./api/api";
import { chatFolders, promptSuggestions, workspaceModules } from "@/mock/workspace";
import type { Attachment, ChatMessage, ChatThread, Citation, PromptSuggestion } from "@/types";

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
  id?: string | number;
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
  id?: string | number;
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
  related_questions?: string[];
  relatedQuestions?: string[];
  messages?: BackendMessage[];
}

interface BackendAssistantMessage {
  id: number;
  answer: string;
  confidence: number;
  query_time_ms: number;
  sources: BackendCitation[];
  related_judgements?: unknown[];
  verification?: unknown;
  pipeline?: unknown;
  created_at: string;
}

interface BackendAiQueryResponse {
  success: boolean;
  message: string;
  data: {
    conversation: BackendThread;
    user_message: {
      id: number;
      query: string;
      created_at: string;
    };
    assistant_message: BackendAssistantMessage;
  };
}

const normalizePromptSuggestion = (value: unknown): PromptSuggestion | null => {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const moduleId = item.moduleId ?? item.module_id;
  if (typeof item.id !== "string" || typeof item.title !== "string" || typeof item.prompt !== "string" || typeof moduleId !== "string") return null;
  return { id: item.id, title: item.title, prompt: item.prompt, moduleId };
};

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

const normalizeMessage = (
  message: BackendMessage,
  fallbackRole: ChatMessage["role"] = "assistant",
): ChatMessage => {
  const rawSources =
    message.sources ?? message.citations ?? message.references ?? [];

  return {
    id: String(message.id ?? crypto.randomUUID()),
    role: message.role ?? fallbackRole,
    content: message.content ?? "",
    createdAt:
      message.createdAt ??
      message.created_at ??
      new Date().toISOString(),
    citations: rawSources.map((source, index) =>
      normalizeCitation(source, index)
    ),
    attachments: message.attachments ?? [],
  };
};

const normalizeThread = (
  thread: BackendThread | null | undefined
): ChatThread | null => {
  if (!thread || thread.id == null) return null;

  return {
    id: String(thread.id),
    title: thread.title ?? "New chat",
    moduleId: thread.moduleId ?? thread.module_id ?? "income-tax",
    toolId: thread.toolId ?? thread.tool_id ?? "ask",
    updatedAt:
      thread.updatedAt ??
      thread.updated_at ??
      new Date().toISOString(),
    pinned: thread.pinned,
    favorite: thread.favorite,
    folder: thread.folder,
    tags: thread.tags,
    relatedQuestions: thread.relatedQuestions ?? thread.related_questions ?? [],
    messages: (thread.messages ?? []).map((message) =>
      normalizeMessage(message)
    ),
  };
};

const getThreadPayload = (data: unknown): BackendThread[] => {
  if (Array.isArray(data)) return data as BackendThread[];
  if (data && typeof data === "object" && Array.isArray((data as { threads?: BackendThread[] }).threads)) {
    return (data as { threads: BackendThread[] }).threads;
  }
  return [];
};

export const workspaceService = {
  getModules: () => Promise.resolve(workspaceModules),
  getSuggestions: async (moduleId?: string): Promise<PromptSuggestion[]> => {
    const { data } = await api.get<unknown>(endpoints.workspace.templates);
    const suggestions = Array.isArray(data)
      ? data.map(normalizePromptSuggestion).filter((item): item is PromptSuggestion => item !== null)
      : [];
    return moduleId ? suggestions.filter((suggestion) => suggestion.moduleId === moduleId) : suggestions;
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

    const { data } = await api.post<BackendAiQueryResponse>(
      endpoints.ai.query,
      {
        query: prompt,
        thread_id: threadId ?? undefined,
        module_id: context.moduleId,
        tool_id: context.toolId,
      }
    );

    const conversation = data.data.conversation;
    const assistant = data.data.assistant_message;

    const normalizedThread = normalizeThread({
      ...conversation,
      id: String(conversation.id),
    });

    const normalizedMessage: ChatMessage = {
      id: String(assistant.id),
      role: "assistant",
      content: assistant.answer,
      createdAt: assistant.created_at,
      citations: (assistant.sources ?? []).map((source, index) =>
        normalizeCitation(source, index)
      ),
      attachments: [],
    };

    return {
      message: normalizedMessage,
      thread: normalizedThread,
    };
  },
};

