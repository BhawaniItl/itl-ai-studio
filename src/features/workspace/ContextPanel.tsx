import { Bell, BookOpen, ChevronsRight, FileText, Paperclip, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useChatStore, useSidebarStore, useWorkspaceStore } from "@/store";
import type { Citation } from "@/types";

const citationIcon = { act: BookOpen, case: Scale, circular: FileText, notification: Bell };

export function ContextPanel() {
  const toggleRight = useSidebarStore((state) => state.toggleRight);
  const activeThreadId = useWorkspaceStore((state) => state.activeThreadId);
  const thread = useChatStore((state) => state.threads.find((item) => item.id === activeThreadId));
  const citations = uniqueById(thread?.messages.flatMap((message) => message.citations ?? []) ?? []);
  const attachments = uniqueById(thread?.messages.flatMap((message) => message.attachments ?? []) ?? []);
  const relatedQuestions = thread?.relatedQuestions ?? [];
  const hasContext = citations.length > 0 || attachments.length > 0 || relatedQuestions.length > 0;

  return <aside className="flex h-full min-h-0 flex-col border-l border-border/60 bg-sidebar/40"><div className="flex items-center justify-between px-4 pb-2 pt-4"><h3 className="text-sm font-semibold">Context</h3><Button variant="ghost" size="icon" onClick={toggleRight} className="h-8 w-8" aria-label="Close context"><ChevronsRight className="h-4 w-4" /></Button></div><div className="scrollbar-thin min-h-0 flex-1 space-y-5 overflow-y-auto px-3 pb-4 pt-3">{citations.length > 0 && <ContextSection title="Sources"><div className="space-y-2">{citations.map((citation) => <CitationCard key={citation.id} citation={citation} />)}</div></ContextSection>}{attachments.length > 0 && <ContextSection title="Attachments"><div className="space-y-2">{attachments.map((attachment) => <Card key={attachment.id} className="p-3 shadow-soft"><div className="flex items-start gap-2.5"><Paperclip className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" /><div className="min-w-0"><p className="truncate text-[13px] font-semibold">{attachment.name}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{formatBytes(attachment.size)} · {attachment.type}</p></div></div></Card>)}</div></ContextSection>}{relatedQuestions.length > 0 && <ContextSection title="Related questions"><div className="space-y-1.5">{relatedQuestions.map((question) => <button key={question} type="button" className="block w-full rounded-lg border border-border/60 bg-card/50 px-3 py-2 text-left text-[12px] leading-snug text-foreground/90 transition-colors hover:border-primary/30 hover:bg-primary/5">{question}</button>)}</div></ContextSection>}{!hasContext && <p className="px-1 pt-2 text-sm text-muted-foreground">Sources, attachments, and related questions will appear here when available.</p>}</div></aside>;
}

function ContextSection({ title, children }: { title: string; children: React.ReactNode }) { return <section><p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>{children}</section>; }
function CitationCard({ citation }: { citation: Citation }) { const Icon = citationIcon[citation.type]; return <Card className="p-3 shadow-soft transition-shadow hover:shadow-elevated"><div className="flex items-start gap-2.5"><div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/8 text-primary"><Icon className="h-3.5 w-3.5" /></div><div className="min-w-0 flex-1"><p className="text-[13px] font-semibold leading-tight text-foreground">{citation.title}</p><p className="mt-1 text-[11px] text-muted-foreground">{citation.ref}</p>{citation.snippet && <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{citation.snippet}</p>}</div><span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium capitalize text-muted-foreground">{citation.type}</span></div></Card>; }
function uniqueById<T extends { id: string }>(items: T[]) { return [...new Map(items.map((item) => [item.id, item])).values()]; }
function formatBytes(bytes: number) { if (bytes < 1024) return `${bytes} B`; if (bytes < 1024 ** 2) return `${Math.round(bytes / 1024)} KB`; return `${(bytes / 1024 ** 2).toFixed(1)} MB`; }
