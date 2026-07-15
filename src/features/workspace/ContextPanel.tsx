import { BookOpen, Scale, FileText, Bell, Bookmark, Paperclip, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSidebarStore } from "@/store";

const referenced = [
  { icon: BookOpen, title: "Section 148, Income Tax Act, 1961", meta: "Statute · Central", tag: "Act" },
  { icon: Scale, title: "Union of India v. Ashish Agarwal", meta: "SC · (2022) 6 SCC 728", tag: "Case" },
  { icon: FileText, title: "CBDT Instruction No. 1/2022", meta: "Circular · 11 May 2022", tag: "Circular" },
  { icon: Bell, title: "Notification No. 20/2021 – Income-tax", meta: "31 March 2021", tag: "Notification" },
];

const bookmarks = [
  { title: "Reassessment framework post 2021", meta: "Saved 2 days ago" },
  { title: "GST ITC on capital goods", meta: "Saved 1 week ago" },
];

const attachments = [
  { name: "SCN_143(2)_ay23-24.pdf", size: "412 KB" },
  { name: "Balance_sheet_FY23.xlsx", size: "1.2 MB" },
];

export function ContextPanel() {
  const toggleRight = useSidebarStore((s) => s.toggleRight);
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
          <TabsTrigger value="sources" className="text-xs">Sources</TabsTrigger>
          <TabsTrigger value="bookmarks" className="text-xs">Saved</TabsTrigger>
          <TabsTrigger value="files" className="text-xs">Files</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="scrollbar-thin flex-1 space-y-2 overflow-y-auto px-3 pt-3 pb-4">
          <p className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Referenced in this chat
          </p>
          {referenced.map((r) => (
            <Card key={r.title} className="p-3 shadow-soft transition-shadow hover:shadow-elevated">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/8 text-primary">
                  <r.icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold leading-tight text-foreground">{r.title}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{r.meta}</p>
                </div>
                <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {r.tag}
                </span>
              </div>
            </Card>
          ))}
          <div className="pt-2">
            <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Related questions
            </p>
            {[
              "Does TOLA extend limitation for AY 2016-17?",
              "Impact of Ashish Agarwal on pending 148 notices",
              "When does the 10-year limitation apply?",
            ].map((q) => (
              <button
                key={q}
                className="mb-1.5 block w-full rounded-lg border border-border/60 bg-card/50 px-3 py-2 text-left text-[12px] leading-snug text-foreground/90 transition-colors hover:border-primary/30 hover:bg-primary/5"
              >
                {q}
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookmarks" className="scrollbar-thin flex-1 space-y-2 overflow-y-auto px-3 pt-3 pb-4">
          {bookmarks.map((b) => (
            <Card key={b.title} className="p-3 shadow-soft">
              <div className="flex items-start gap-2.5">
                <Bookmark className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-[13px] font-semibold">{b.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{b.meta}</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="files" className="scrollbar-thin flex-1 space-y-2 overflow-y-auto px-3 pt-3 pb-4">
          {attachments.map((f) => (
            <Card key={f.name} className="p-3 shadow-soft">
              <div className="flex items-start gap-2.5">
                <Paperclip className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold">{f.name}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{f.size}</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </aside>
  );
}
