import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, PanelLeftOpen, PanelRightOpen, Share2, Sparkles } from "lucide-react";
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
import type { ChatThread } from "@/types";

const createOptimisticThread = (prompt: string, moduleId: string, toolId: string): ChatThread => {
  const timestamp = new Date().toISOString();
  return {
    id: `local-${crypto.randomUUID()}`,
    title: prompt,
    moduleId,
    toolId,
    updatedAt: timestamp,
    messages: [{ id: crypto.randomUUID(), role: "user", content: prompt, createdAt: timestamp }],
  };
};

export function WorkspaceShell() {
  const leftOpen = useSidebarStore((state) => state.leftOpen);
  const rightOpen = useSidebarStore((state) => state.rightOpen);
  const toggleLeft = useSidebarStore((state) => state.toggleLeft);
  const toggleRight = useSidebarStore((state) => state.toggleRight);
  const activeThreadId = useWorkspaceStore((state) => state.activeThreadId);
  const activeToolId = useWorkspaceStore((state) => state.activeToolId);
  const activeModuleId = useWorkspaceStore((state) => state.activeModuleId);
  const setTool = useWorkspaceStore((state) => state.setTool);
  const setThread = useWorkspaceStore((state) => state.setThread);
  const threads = useChatStore((state) => state.threads);
  const createThread = useChatStore((state) => state.createThread);
  const upsertThread = useChatStore((state) => state.upsertThread);
  const addMessage = useChatStore((state) => state.addMessage);
  const deleteThread = useChatStore((state) => state.deleteThread);
  const { data: modules } = useWorkspaceModules();
  const [isSending, setIsSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const thread = useMemo(() => threads.find((item) => item.id === activeThreadId) ?? null, [activeThreadId, threads]);
  const activeModule = useMemo(() => modules?.find((module) => module.id === activeModuleId), [activeModuleId, modules]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeThreadId, isSending, thread?.messages.length]);

  const handleSend = useCallback(async (prompt: string) => {
    if (isSending) return;
    const currentThread = useChatStore.getState().threads.find((item) => item.id === useWorkspaceStore.getState().activeThreadId);
    const optimisticThread = currentThread ?? createOptimisticThread(prompt, activeModuleId, activeToolId);
    const requestThreadId = currentThread && !currentThread.id.startsWith("local-") ? currentThread.id : null;

    if (currentThread) {
      addMessage(currentThread.id, { id: crypto.randomUUID(), role: "user", content: prompt, createdAt: new Date().toISOString() });
    } else {
      createThread(optimisticThread);
      setThread(optimisticThread.id);
    }

    setIsSending(true);
    try {
      const result = await chatService.sendMessage(requestThreadId, prompt, { moduleId: activeModuleId, toolId: activeToolId });
      const serverThread = result.thread;
      const localMessages = useChatStore.getState().threads.find((item) => item.id === optimisticThread.id)?.messages ?? [];
      const resolvedThreadId = serverThread?.id ?? optimisticThread.id;

      if (serverThread) {
        upsertThread({ ...serverThread, title: serverThread.title || optimisticThread.title, messages: localMessages });
        if (optimisticThread.id !== serverThread.id) deleteThread(optimisticThread.id);
        setThread(serverThread.id);
      }
      addMessage(resolvedThreadId, result.message);
    } catch {
      addMessage(optimisticThread.id, {
        id: crypto.randomUUID(), role: "assistant",
        content: "⚠️ Unable to generate a response.\n\nPlease try again.", createdAt: new Date().toISOString(),
      });
    } finally {
      setIsSending(false);
    }
  }, [activeModuleId, activeToolId, addMessage, createThread, deleteThread, isSending, setThread, upsertThread]);

  return (
    <div className="grid h-screen overflow-hidden bg-background transition-[grid-template-columns] duration-300" style={{ gridTemplateColumns: `${leftOpen ? "280px" : "0px"} minmax(0,1fr) ${rightOpen ? "340px" : "0px"}` }}>
      <div className={cn("min-h-0 overflow-hidden", !leftOpen && "invisible")}>{leftOpen && <WorkspaceSidebar />}</div>
      <main className="flex min-h-0 min-w-0 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur">
          <div className="flex min-w-0 items-center gap-2">
            {!leftOpen && <Button variant="ghost" size="icon" onClick={toggleLeft} className="h-8 w-8"><PanelLeftOpen className="h-4 w-4" /></Button>}
            <div className="flex min-w-0 items-center gap-2">{activeModule && <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg text-primary-foreground" style={{ background: activeModule.color }}><Icon name={activeModule.icon} className="h-3.5 w-3.5" /></span>}<h2 className="truncate text-sm font-semibold">{thread?.title ?? "New chat"}</h2></div>
          </div>
          <div className="flex items-center gap-1"><div className="mr-2 hidden gap-0.5 rounded-lg border border-border/60 bg-secondary/60 p-0.5 md:flex">{(activeModule?.tools ?? []).map((tool) => <button key={tool.id} type="button" onClick={() => setTool(tool.id)} className={cn("flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors", activeToolId === tool.id ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground")}><Icon name={tool.icon} className="h-3 w-3" />{tool.name}</button>)}</div><Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Share chat"><Share2 className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8" aria-label="More options"><MoreHorizontal className="h-4 w-4" /></Button>{!rightOpen && <Button variant="ghost" size="icon" onClick={toggleRight} className="h-8 w-8"><PanelRightOpen className="h-4 w-4" /></Button>}</div>
        </header>
        <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto"><div className="mx-auto max-w-3xl px-4 py-8">{thread?.messages.length ? <div className="space-y-5">{thread.messages.map((message) => <ChatMessageBubble key={message.id} message={message} />)}{isSending && <TypingIndicator />}<div ref={endRef} /></div> : <EmptyState moduleName={activeModule?.name ?? "tax research"} />}</div></div>
        <div className="shrink-0 border-t border-border/60 bg-background/60 px-4 pb-5 pt-4 backdrop-blur"><div className="mx-auto max-w-3xl"><PromptComposer onSend={handleSend} isStreaming={isSending} /></div></div>
      </main>
      <div className={cn("min-h-0 overflow-hidden", !rightOpen && "invisible")}>{rightOpen && <ContextPanel />}</div>
    </div>
  );
}

function EmptyState({ moduleName }: { moduleName: string }) { return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-8 max-w-xl text-center"><div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-float"><Sparkles className="h-6 w-6" /></div><h1 className="text-2xl font-bold tracking-tight">How can I help with <span className="text-gradient">{moduleName}</span> today?</h1><p className="mt-2 text-sm text-muted-foreground">Ask a question, paste a query, or drop a notice PDF. Answers come with verifiable citations.</p></motion.div>; }
