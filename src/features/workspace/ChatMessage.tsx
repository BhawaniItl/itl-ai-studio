import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Copy, Download, RefreshCw, ThumbsDown, ThumbsUp, Scale, FileText, BookOpen, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

export function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full gradient-primary text-[11px] font-bold text-primary-foreground">
          ITL
        </div>
      )}
      <div className={cn("max-w-3xl min-w-0", isUser ? "text-right" : "")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-[15px] leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground shadow-soft"
              : "bg-card text-card-foreground border border-border/60 shadow-soft",
          )}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="markdown-body space-y-2 text-[15px] leading-[1.7]">
              <ReactMarkdown
                components={{
                  h1: (p) => <h1 className="text-lg font-semibold tracking-tight" {...p} />,
                  h2: (p) => <h2 className="text-base font-semibold tracking-tight" {...p} />,
                  p: (p) => <p className="my-2" {...p} />,
                  ul: (p) => <ul className="my-2 list-disc pl-5 space-y-1" {...p} />,
                  ol: (p) => <ol className="my-2 list-decimal pl-5 space-y-1" {...p} />,
                  strong: (p) => <strong className="font-semibold text-foreground" {...p} />,
                  em: (p) => <em className="italic" {...p} />,
                  code: (p) => (
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-[13px]" {...p} />
                  ),
                  pre: (p) => (
                    <pre className="my-3 overflow-x-auto rounded-xl border border-border bg-muted p-3 font-mono text-[13px] leading-relaxed" {...p} />
                  ),
                  table: (p) => (
                    <div className="my-3 overflow-x-auto rounded-xl border border-border">
                      <table className="w-full text-left text-sm" {...p} />
                    </div>
                  ),
                  th: (p) => <th className="border-b border-border bg-muted px-3 py-2 font-semibold" {...p} />,
                  td: (p) => <td className="border-b border-border px-3 py-2 last:border-b-0" {...p} />,
                  a: (p) => <a className="text-primary underline-offset-2 hover:underline" {...p} />,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {!isUser && message.citations && message.citations.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.citations.map((c) => (
              <Badge
                key={c.id}
                variant="outline"
                className="gap-1.5 rounded-lg border-border/70 bg-card/60 py-1 pr-2 pl-1.5 font-medium"
              >
                {c.type === "act" && <BookOpen className="h-3 w-3" />}
                {c.type === "case" && <Scale className="h-3 w-3" />}
                {c.type === "circular" && <FileText className="h-3 w-3" />}
                {c.type === "notification" && <Bell className="h-3 w-3" />}
                <span className="text-[11px]">{c.title}</span>
              </Badge>
            ))}
          </div>
        )}

        {!isUser && (
          <div className="mt-2 flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-[11px] text-muted-foreground">
              <Copy className="h-3 w-3" /> Copy
            </Button>
            <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-[11px] text-muted-foreground">
              <Download className="h-3 w-3" /> Export
            </Button>
            <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-[11px] text-muted-foreground">
              <RefreshCw className="h-3 w-3" /> Regenerate
            </Button>
            <span className="mx-1 h-3.5 w-px bg-border" />
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
              <ThumbsDown className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary [animation-delay:300ms]" />
    </div>
  );
}
