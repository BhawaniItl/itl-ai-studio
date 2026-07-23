/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PanelLeftOpen, PanelRightOpen, Share2, MoreHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/common/Icon";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import { ContextPanel } from "./ContextPanel";
import { PromptComposer } from "./PromptComposer";
import { ChatMessageBubble, TypingIndicator } from "./ChatMessage";
import { useSidebarStore, useWorkspaceStore, useChatStore } from "@/store";
import { useWorkspaceModules } from "@/hooks";
import { chatService } from "@/services/workspace.service";
import { cn } from "@/lib/utils";

export function WorkspaceShell() {
  const leftOpen = useSidebarStore((s) => s.leftOpen);
  const rightOpen = useSidebarStore((s) => s.rightOpen);
  const toggleLeft = useSidebarStore((s) => s.toggleLeft);
  const toggleRight = useSidebarStore((s) => s.toggleRight);

  const activeThreadId = useWorkspaceStore((s) => s.activeThreadId);
  const activeToolId = useWorkspaceStore((s) => s.activeToolId);
  const setTool = useWorkspaceStore((s) => s.setTool);
  const activeModuleId = useWorkspaceStore((s) => s.activeModuleId);
  const { data: modules } = useWorkspaceModules();
  const threads = useChatStore((s) => s.threads);
  const addMessage = useChatStore((s) => s.addMessage);

  const activeModule = modules?.find((m) => m.id === activeModuleId);
  const thread = threads.find((t) => t.id === activeThreadId) ?? null;

  const [streaming, setStreaming] = useState(false);

  async function handleSend(prompt: string) {
    if (!thread) return;
    addMessage(thread.id, {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
      createdAt: new Date().toISOString(),
    });
    setStreaming(true);
    const reply = await chatService.sendMessage(thread.id, prompt);
    addMessage(thread.id, reply);
    setStreaming(false);
  }

  return (
    <div
      className={cn(
        "grid h-screen overflow-hidden bg-background transition-[grid-template-columns] duration-300",
      )}
      style={{
        gridTemplateColumns: `${leftOpen ? "280px" : "0px"} minmax(0,1fr) ${rightOpen ? "340px" : "0px"}`,
      }}
    >
      <div className={cn("overflow-hidden", !leftOpen && "invisible")}>
        {leftOpen && <WorkspaceSidebar />}
      </div>

      {/* Main */}
      <div className="flex min-w-0 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur">
          <div className="flex min-w-0 items-center gap-2">
            {!leftOpen && (
              <Button variant="ghost" size="icon" onClick={toggleLeft} className="h-8 w-8">
                <PanelLeftOpen className="h-4 w-4" />
              </Button>
            )}
            <div className="flex min-w-0 items-center gap-2">
              {activeModule && (
                <span
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-lg text-primary-foreground"
                  style={{ background: activeModule.color }}
                >
                  <Icon name={activeModule.icon} className="h-3.5 w-3.5" />
                </span>
              )}
              <h2 className="truncate text-sm font-semibold">
                {thread?.title ?? "New chat"}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* Tool tabs */}
            <div className="mr-2 hidden gap-0.5 rounded-lg border border-border/60 bg-secondary/60 p-0.5 md:flex">
              {(activeModule?.tools ?? []).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTool(t.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                    activeToolId === t.id
                      ? "bg-card text-foreground shadow-soft"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon name={t.icon} className="h-3 w-3" />
                  {t.name}
                </button>
              ))}
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            {!rightOpen && (
              <Button variant="ghost" size="icon" onClick={toggleRight} className="h-8 w-8">
                <PanelRightOpen className="h-4 w-4" />
              </Button>
            )}
          </div>
        </header>

        {/* Messages */}
        <div className="scrollbar-thin flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-8">
            {thread && thread.messages.length > 0 ? (
              <div className="space-y-5">
                {thread.messages.map((m) => (
                  <ChatMessageBubble key={m.id} message={m} />
                ))}
                {streaming && <TypingIndicator />}
              </div>
            ) : (
              <EmptyState moduleName={activeModule?.name ?? ""} />
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-border/60 bg-background/60 px-4 pb-5 pt-4 backdrop-blur">
          <div className="mx-auto max-w-3xl">
            <PromptComposer onSend={handleSend} isStreaming={streaming} />
          </div>
        </div>
      </div>

      <div className={cn("overflow-hidden", !rightOpen && "invisible")}>
        {rightOpen && <ContextPanel />}
      </div>
    </div>
  );
}

function EmptyState({ moduleName }: { moduleName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto mt-8 max-w-xl text-center"
    >
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-float">
        <Sparkles className="h-6 w-6" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">
        How can I help with <span className="text-gradient">{moduleName}</span> today?
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Ask a question, paste a query, or drop a notice PDF. Answers come with verifiable citations.
      </p>
    </motion.div>
  );
}
