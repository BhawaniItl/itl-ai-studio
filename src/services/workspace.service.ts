import { mockResponse } from "./api/api";
import {
  workspaceModules,
  sampleThreads,
  promptSuggestions,
  chatFolders,
} from "@/mock/workspace";
import type { ChatThread } from "@/types";

export const workspaceService = {
  getModules: () => mockResponse(workspaceModules),
  getFolders: () => mockResponse(chatFolders),
  getSuggestions: (moduleId?: string) =>
    mockResponse(
      moduleId ? promptSuggestions.filter((p) => p.moduleId === moduleId) : promptSuggestions,
    ),
};

export const chatService = {
  listThreads: () => mockResponse(sampleThreads),
  getThread: (id: string) =>
    mockResponse(sampleThreads.find((t) => t.id === id) ?? null),
  createThread: (partial: Partial<ChatThread>) =>
    mockResponse({
      id: crypto.randomUUID(),
      title: partial.title ?? "New chat",
      moduleId: partial.moduleId ?? "income-tax",
      toolId: partial.toolId ?? "ask",
      updatedAt: new Date().toISOString(),
      messages: [],
    } as ChatThread),
  /**
   * Streaming placeholder — later wire to server-sent events / fetch stream.
   * For now returns a mock assistant message after a delay.
   */
  sendMessage: (_threadId: string, prompt: string) =>
    mockResponse(
      {
        id: crypto.randomUUID(),
        role: "assistant" as const,
        createdAt: new Date().toISOString(),
        content: `**Draft answer for:** _${prompt}_\n\nThis is a mock response. Every real answer will include citations from the Income Tax Act, GST Act, rules, circulars and case law.\n\n\`\`\`ts\n// Example computation\nconst tax = income * 0.30;\n\`\`\``,
      },
      700,
    ),
};
