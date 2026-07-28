/* eslint-disable prettier/prettier */
import { isAxiosError } from "axios";
import { api, endpoints } from "./api/api";
import { promptSuggestions, workspaceModules } from "@/mock/workspace";
import type { Attachment, ChatMessage, ChatThread, Citation, MessageAttachment, PromptSuggestion, RelatedJudgement } from "@/types";

/**
 * Maps a workspace tool to the {provider, tool} pair the backend's
 * /ai/query expects. Confirmed against the vendor's own Django reference
 * client (core/views.py + core/case_law_research_views.py) — critically,
 * "Case Law Research" is NOT `provider: main, tool: case-laws` (that's a
 * different, secondary endpoint requiring a context_answer). It's its own
 * provider — the judgement/premium search bot.
 *
 * Tools not listed here have no working backend yet (see mock/workspace.ts
 * `disabled` flags) — sendMessage() refuses to call for them rather than
 * silently falling back to Ask Bot.
 */
const TOOL_BACKEND_ROUTE_MAP: Record<string, { provider: string; tool: string }> = {
  ask: { provider: "main", tool: "chat" },
  "case-law": { provider: "premium", tool: "search" },
  "notice-reply": { provider: "notice", tool: "process" },
  summarize: { provider: "summarizer", tool: "summarize" },
};

/**
 * Tools backed by the multipart file-upload endpoints (/ai/notice/generate,
 * /ai/summarize) rather than the JSON /ai/query endpoint — confirmed against
 * core/draft_assistant.py and core/summarizer.py, which both accept a file
 * as optional (zero-or-more), never required.
 */
const FILE_TOOL_ENDPOINTS: Record<string, string> = {
  "notice-reply": endpoints.ai.noticeGenerate,
  summarize: endpoints.ai.summarize,
};

const BACKEND_ROUTE_TO_UI_TOOL_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(TOOL_BACKEND_ROUTE_MAP).map(([uiTool, route]) => [`${route.provider}:${route.tool}`, uiTool]),
);

interface AiQueryContext {
  moduleId: string;
  toolId: string;
}

/** Generic `{ success, message, data }` envelope every /ai/* route returns. */
interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

interface BackendCitation {
  id?: string | number;
  source_no?: number;
  document_type?: string;
  heading?: string;
  title?: string;
  reference?: string;
  citation?: string;
  court?: string;
  court_name?: string;
  court_area?: string;
  link?: string;
  url?: string;
  similarity?: number;
  snippet?: string;
}

interface BackendRelatedJudgement {
  id?: string | number;
  partyname?: string;
  court?: string;
  facts?: string;
  issue?: string;
  held?: string;
  ratio?: string;
  link?: string;
}

interface BackendAttachment {
  filename?: string;
  content_type?: string;
  size?: number;
  download_url?: string;
}

/** Shape returned by ChatService.serialize_message on the backend. */
interface BackendMessage {
  id: number | string;
  parent_message_id?: number | string | null;
  role: "user" | "assistant" | "system";
  message_type?: string;
  status?: string;
  content?: string | null;
  confidence?: number | null;
  query_time_ms?: number | null;
  sources?: BackendCitation[] | null;
  related_judgements?: BackendRelatedJudgement[] | null;
  needs_clarification?: boolean | null;
  deep_research_used?: boolean | null;
  attachment?: BackendAttachment | null;
  feedback?: "up" | "down" | null;
  created_at: string;
}

/** Shape returned by ChatService.serialize_conversation on the backend. */
interface BackendConversation {
  id: number | string;
  title?: string;
  provider?: string;
  tool?: string;
  module?: string | null;
  status?: string;
  is_archived?: boolean;
  created_at?: string;
  updated_at?: string;
  last_message_at?: string | null;
  messages?: BackendMessage[];
}

/** Shape of the `data` field returned by POST /ai/query. */
interface BackendQueryResult {
  conversation: BackendConversation;
  user_message: {
    id: number | string;
    query: string;
    created_at: string;
  };
  assistant_message: {
    id: number | string;
    answer: string;
    confidence?: number | null;
    query_time_ms?: number | null;
    sources?: BackendCitation[] | null;
    related_judgements?: BackendRelatedJudgement[] | null;
    needs_clarification?: boolean | null;
    deep_research_used?: boolean | null;
    verification?: unknown;
    pipeline?: unknown;
    created_at: string;
  };
}

const titleCase = (s: string) => s.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const normalizeCitation = (citation: BackendCitation, index: number): Citation => {
  const rawType = citation.document_type ?? "Source";
  return {
    id: citation.id != null ? String(citation.id) : `${rawType}-${index}-${citation.heading ?? citation.title ?? "item"}`,
    sourceNo: citation.source_no,
    // Vendor's own document_type, passed through as-is (title-cased for
    // display) rather than collapsed into a fixed set — this is what was
    // making every non-"act" source display as "ACTS" before: unrecognized
    // types silently fell back to a hardcoded default.
    documentType: titleCase(rawType),
    heading: citation.heading ?? citation.title ?? "Untitled source",
    reference: citation.reference,
    citation: citation.citation,
    court: citation.court ?? citation.court_name,
    courtArea: citation.court_area,
    link: citation.link ?? citation.url,
    similarity: citation.similarity,
    snippet: citation.snippet,
  };
};

const normalizeCitations = (sources: BackendCitation[] | null | undefined): Citation[] =>
  // Vendor ordering is preserved — no sort applied.
  (sources ?? []).map((source, index) => normalizeCitation(source, index));

const normalizeRelatedJudgement = (j: BackendRelatedJudgement, index: number): RelatedJudgement => ({
  id: j.id != null ? String(j.id) : `related-${index}-${j.partyname ?? "case"}`,
  partyName: j.partyname ?? "Untitled case",
  court: j.court,
  facts: j.facts,
  issue: j.issue,
  held: j.held,
  ratio: j.ratio,
  link: j.link,
});

const normalizeRelatedJudgements = (list: BackendRelatedJudgement[] | null | undefined): RelatedJudgement[] =>
  (list ?? []).map(normalizeRelatedJudgement);

const normalizeAttachment = (a: BackendAttachment | null | undefined): MessageAttachment | undefined =>
  a?.filename
    ? {
        filename: a.filename,
        contentType: a.content_type,
        size: a.size,
        downloadUrl: a.download_url ?? "",
      }
    : undefined;

/** Normalizes a message that already came pre-shaped from the backend's `serialize_message`. */
const normalizeStoredMessage = (message: BackendMessage): ChatMessage => ({
  id: String(message.id),
  role: message.role,
  content: message.content ?? "",
  createdAt: message.created_at,
  citations: normalizeCitations(message.sources),
  relatedJudgements: normalizeRelatedJudgements(message.related_judgements),
  needsClarification: message.needs_clarification ?? false,
  deepResearchUsed: message.deep_research_used ?? false,
  attachment: normalizeAttachment(message.attachment),
  attachments: [],
  feedback: message.feedback ?? undefined,
});

const normalizeThread = (
  conversation: BackendConversation | null | undefined,
  overrides: { moduleId?: string; toolId?: string } = {},
): ChatThread | null => {
  if (!conversation || conversation.id == null) return null;

  const hasMessages = Array.isArray(conversation.messages);

  return {
    id: String(conversation.id),
    title: conversation.title || "New chat",
    // The backend is the source of truth once it has a value — the previous
    // implementation always fell back to "income-tax" regardless of what the
    // conversation actually was, which is why GST conversations kept showing
    // up under the Income Tax module.
    moduleId: conversation.module ?? overrides.moduleId ?? "gst",
    toolId:
      (conversation.provider && conversation.tool
        ? BACKEND_ROUTE_TO_UI_TOOL_MAP[`${conversation.provider}:${conversation.tool}`]
        : undefined) ?? overrides.toolId ?? "ask",
    updatedAt:
      conversation.last_message_at ?? conversation.updated_at ?? new Date().toISOString(),
    messages: hasMessages ? conversation.messages!.map(normalizeStoredMessage) : [],
    // Only present when this thread came from a full detail fetch (GET /ai/conversations/{id}),
    // so WorkspaceShell knows whether it still needs to load message history.
    hasLoadedMessages: hasMessages || undefined,
  };
};

export const workspaceService = {
  getModules: () => Promise.resolve(workspaceModules),
  getFolders: async () => {
    // No backend folders endpoint exists yet. Folders are a future feature;
    // returning an empty list keeps the sidebar's optional folder section hidden.
    return [] as { id: string; name: string; count: number }[];
  },
  getSuggestions: async (_moduleId?: string): Promise<PromptSuggestion[]> => {
    try {
      const { data } = await api.get<PromptSuggestion[]>(endpoints.workspace.templates);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      if (isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 501)) {
        // TODO: backend prompt-template endpoint is not available yet.
        return promptSuggestions.filter((s) => !_moduleId || s.moduleId === _moduleId);
      }
      throw error;
    }
  },
};

export const isFileTool = (toolId: string): boolean => toolId in FILE_TOOL_ENDPOINTS;

export const chatService = {
  /** Lightweight list for the sidebar — metadata only, no message bodies, scoped to one Module+Tool workspace. */
  listThreads: async (moduleId: string, toolId: string): Promise<ChatThread[]> => {
    try {
      const route = TOOL_BACKEND_ROUTE_MAP[toolId];
      const { data } = await api.get<ApiEnvelope<BackendConversation[]>>(endpoints.ai.conversations, {
        params: { module: moduleId, provider: route?.provider, tool: route?.tool ?? toolId },
      });
      return (data.data ?? [])
        .map((conversation) => normalizeThread(conversation, { moduleId, toolId }))
        .filter((thread): thread is ChatThread => thread !== null);
    } catch (error) {
      if (isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 501)) {
        return [];
      }
      throw error;
    }
  },

  /** Full conversation detail, including message history. */
  getThread: async (id: string): Promise<ChatThread | null> => {
    try {
      const { data } = await api.get<ApiEnvelope<BackendConversation>>(endpoints.ai.conversation(id));
      return normalizeThread(data.data);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  deleteThread: async (id: string): Promise<void> => {
    await api.delete(endpoints.ai.conversation(id));
  },

  sendMessage: async (
    threadId: string | null,
    prompt: string,
    context: AiQueryContext,
    signal?: AbortSignal,
  ): Promise<{ userMessage: ChatMessage; assistantMessage: ChatMessage; thread: ChatThread | null }> => {
    const route = TOOL_BACKEND_ROUTE_MAP[context.toolId];
    if (!route) {
      // Draft Assistant has no entry — no distinct backend for it (see
      // mock/workspace.ts `disabled` note). The composer is disabled for it
      // in the UI, but this guard exists so a stale client can't still fire
      // a request that would silently be treated as Ask Bot.
      throw new Error(`No backend route configured for tool "${context.toolId}".`);
    }
    if (FILE_TOOL_ENDPOINTS[context.toolId]) {
      // Notice Reply and Summarizer are multipart file-upload endpoints —
      // use sendFileMessage() instead.
      throw new Error(`Tool "${context.toolId}" must use sendFileMessage(), not sendMessage().`);
    }

    const { data } = await api.post<ApiEnvelope<BackendQueryResult>>(
      endpoints.ai.query,
      {
        query: prompt,
        // Backend field is `conversation_id` (numeric) — NOT `thread_id`. Sending the wrong
        // key here silently drops it and makes every message start a brand-new conversation.
        conversation_id: threadId ? Number(threadId) : undefined,
        provider: route.provider,
        tool: route.tool,
        module_id: context.moduleId,
      },
      { signal },
    );

    const { conversation, user_message: userMessage, assistant_message: assistantMessage } = data.data;

    const normalizedThread = normalizeThread(conversation, {
      moduleId: context.moduleId,
      toolId: context.toolId,
    });

    return {
      userMessage: {
        id: String(userMessage.id),
        role: "user",
        content: userMessage.query,
        createdAt: userMessage.created_at,
        citations: [],
        attachments: [] as Attachment[],
      },
      assistantMessage: {
        id: String(assistantMessage.id),
        role: "assistant",
        content: assistantMessage.answer,
        createdAt: assistantMessage.created_at,
        citations: normalizeCitations(assistantMessage.sources),
        relatedJudgements: normalizeRelatedJudgements(assistantMessage.related_judgements),
        needsClarification: assistantMessage.needs_clarification ?? false,
        deepResearchUsed: assistantMessage.deep_research_used ?? false,
        attachments: [],
      },
      thread: normalizedThread,
    };
  },

  /**
   * The multipart counterpart to sendMessage() — for Notice Reply and
   * Summarizer, which take an optional file (never required, matching
   * core/draft_assistant.py and core/summarizer.py) plus the query text.
   * Returns the same shape as sendMessage() so callers can treat both
   * uniformly.
   */
  sendFileMessage: async (
    threadId: string | null,
    prompt: string,
    context: AiQueryContext,
    file?: File | null,
    onUploadProgress?: (percent: number) => void,
    signal?: AbortSignal,
  ): Promise<{ userMessage: ChatMessage; assistantMessage: ChatMessage; thread: ChatThread | null }> => {
    const endpoint = FILE_TOOL_ENDPOINTS[context.toolId];
    if (!endpoint) {
      throw new Error(`Tool "${context.toolId}" is not a file-upload tool.`);
    }

    const form = new FormData();
    form.append("query", prompt);
    form.append("module_id", context.moduleId);
    if (threadId) form.append("conversation_id", threadId);
    if (file) form.append("file", file);

    const { data } = await api.post<ApiEnvelope<BackendQueryResult>>(endpoint, form, {
      headers: { "Content-Type": "multipart/form-data" },
      signal,
      onUploadProgress: onUploadProgress
        ? (event) => {
            if (event.total) onUploadProgress(Math.round((event.loaded / event.total) * 100));
          }
        : undefined,
    });

    const { conversation, user_message: userMessage, assistant_message: assistantMessage } = data.data;

    const normalizedThread = normalizeThread(conversation, {
      moduleId: context.moduleId,
      toolId: context.toolId,
    });

    return {
      userMessage: {
        id: String(userMessage.id),
        role: "user",
        content: userMessage.query,
        createdAt: userMessage.created_at,
        citations: [],
        attachments: file ? [{ id: `local-${file.name}`, name: file.name, size: file.size, type: file.type }] : [],
      },
      assistantMessage: {
        id: String(assistantMessage.id),
        role: "assistant",
        content: assistantMessage.answer,
        createdAt: assistantMessage.created_at,
        citations: normalizeCitations(assistantMessage.sources),
        relatedJudgements: normalizeRelatedJudgements(assistantMessage.related_judgements),
        needsClarification: assistantMessage.needs_clarification ?? false,
        deepResearchUsed: assistantMessage.deep_research_used ?? false,
        attachments: [],
      },
      thread: normalizedThread,
    };
  },

  /**
   * Clarifies a draft prompt via the vendor's Clarify API. Real contract
   * (confirmed against api_io_reference.md) is `{query}` in — no
   * previous-answer/session fields — and out comes either
   * `{needs_clarification: false}` (prompt is already clear, nothing to do)
   * or `{needs_clarification: true, options: [...]}`: a list of more
   * specific candidate questions for the user to pick from, NOT a single
   * "improved" prompt to auto-fill.
   */
  clarify: async (
    query: string,
    toolId: string,
    signal?: AbortSignal,
  ): Promise<{ needsClarification: boolean; options: string[] }> => {
    const provider = TOOL_BACKEND_ROUTE_MAP[toolId]?.provider ?? "main";
    const { data } = await api.post<ApiEnvelope<{ needs_clarification?: boolean; options?: string[] }>>(
      endpoints.ai.clarify,
      { query, provider },
      { signal },
    );
    return {
      needsClarification: data.data?.needs_clarification ?? false,
      options: data.data?.options ?? [],
    };
  },

  submitFeedback: async (messageId: string, rating: "up" | "down"): Promise<void> => {
    await api.post(endpoints.ai.messageFeedback(messageId), { rating });
  },

  refineMessage: async (messageId: string, instruction: string): Promise<ChatMessage> => {
    const { data } = await api.post<ApiEnvelope<BackendMessage>>(endpoints.ai.messageRefine(messageId), {
      instruction,
    });
    return normalizeStoredMessage(data.data);
  },
};