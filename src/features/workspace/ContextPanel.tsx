/* eslint-disable prettier/prettier */
import { useMemo } from "react";
import { BookOpen, Scale, FileText, Bell, Bookmark, Paperclip, ChevronsRight, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSidebarStore } from "@/store";
import type { Attachment, ChatThread, Citation } from "@/types";

const CITATION_ICON: Record<Citation["type"], typeof BookOpen> = {
  act: BookOpen,
  case: Scale,
  circular: FileText,
  notification: Bell,
};

const CITATION_LABEL: Record<Citation["type"], string> = {
  act: "Act",
  case: "Case",
  circular: "Circular",
  notification: "Notification",
};

function dedupeById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    result.push(item);
  }
  return result;
}

export function ContextPanel({ thread }: { thread: ChatThread | null }) {
  const toggleRight = useSidebarStore((s) => s.toggleRight);

  const sources = useMemo<Citation[]>(() => {
    if (!thread) return [];
    return dedupeById(thread.messages.flatMap((m) => m.citations ?? []));
  }, [thread]);

  const attachments = useMemo<Attachment[]>(() => {
    if (!thread) return [];
    return dedupeById(thread.messages.flatMap((m) => m.attachments ?? []));
  }, [thread]);

  return (
    <aside className="flex h-full flex-col border-l border-border/60 bg-sidebar/40">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h3 className="text-sm font-semibold">Context</h3>
        <Button variant="ghost" size="icon" onClick={toggleRight} className="h-8 w-8">
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
      <Tabs defaultValue="sources" className="flex flex-1 flex-col overflow-hidden">
        <TabsList className="mx-4 grid grid-cols-3 bg-secondary/60">
          <TabsTrigger value="sources" className="text-xs">
            Sources
          </TabsTrigger>
          <TabsTrigger value="bookmarks" className="text-xs">
            Saved
          </TabsTrigger>
          <TabsTrigger value="files" className="text-xs">
            Files
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="scrollbar-thin flex-1 space-y-2 overflow-y-auto px-3 pt-3 pb-4">
          {sources.length > 0 ? (
            <>
              <p className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Referenced in this chat
              </p>
              {sources.map((c) => {
                const Icon = CITATION_ICON[c.type];
                return (
                  <Card key={c.id} className="p-3 shadow-soft transition-shadow hover:shadow-elevated">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/8 text-primary">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold leading-tight text-foreground">{c.title}</p>
                        <p className="mt-1 truncate text-[11px] text-muted-foreground">{c.ref}</p>
                      </div>
                      <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {CITATION_LABEL[c.type]}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </>
          ) : (
            <EmptyState
              icon={BookOpen}
              message={thread ? "No sources cited in this chat yet." : "Start a conversation to see citations here."}
            />
          )}
          {/* Related questions require a backend that suggests follow-ups, which
              the AI service doesn't return yet — omitted rather than faked. */}
        </TabsContent>

        <TabsContent value="bookmarks" className="scrollbar-thin flex-1 space-y-2 overflow-y-auto px-3 pt-3 pb-4">
          {/* No bookmarking feature exists on the backend yet. */}
          <EmptyState icon={Bookmark} message="Saved answers will show up here once bookmarking is available." />
        </TabsContent>

        <TabsContent value="files" className="scrollbar-thin flex-1 space-y-2 overflow-y-auto px-3 pt-3 pb-4">
          {attachments.length > 0 ? (
            attachments.map((f) => (
              <Card key={f.id} className="p-3 shadow-soft">
                <div className="flex items-start gap-2.5">
                  <Paperclip className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold">{f.name}</p>
                    {f.size && <p className="mt-0.5 text-[11px] text-muted-foreground">{f.size}</p>}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <EmptyState icon={Paperclip} message="No files in this conversation." />
          )}
        </TabsContent>
      </Tabs>
    </aside>
  );
}

function EmptyState({ icon: Icon, message }: { icon: typeof Inbox; message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
      <div className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-[12px] text-muted-foreground">{message}</p>
    </div>
  );
}