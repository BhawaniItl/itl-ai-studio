/* eslint-disable prettier/prettier */
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Check, Download, RefreshCw, ThumbsDown, ThumbsUp, Scale, FileText, BookOpen, Bell, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

export function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const isError = message.status === "error";
  const isPending = message.status === "pending";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy — your browser blocked clipboard access.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: isPending ? 0.6 : 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div
          className={cn(
            "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold",
            isError ? "bg-destructive/15 text-destructive" : "gradient-primary text-primary-foreground",
          )}
        >
          {isError ? <AlertTriangle className="h-4 w-4" /> : "ITL"}
        </div>
      )}
      <div className={cn("max-w-3xl min-w-0", isUser ? "text-right" : "")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-[15px] leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground shadow-soft"
              : isError
                ? "border border-destructive/30 bg-destructive/8 text-destructive"
                : "bg-card text-card-foreground border border-border/60 shadow-soft",
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="markdown-body space-y-2 text-[15px] leading-[1.7]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: (p) => <h1 className="text-lg font-semibold tracking-tight" {...p} />,
                  h2: (p) => <h2 className="text-base font-semibold tracking-tight" {...p} />,
                  p: (p) => <p className="my-2 whitespace-pre-wrap" {...p} />,
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
                  a: (p) => <a className="text-primary underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer" {...p} />,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {!isUser && !isError && message.citations && message.citations.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.citations.map((c) => (
              <Badge
                key={c.id}
                variant="outline"
                className="gap-1.5 rounded-lg border-border/70 bg-card/60 py-1 pr-2 pl-1.5 font-medium"
                title={c.snippet}
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

        {!isUser && !isError && (
          <div className="mt-2 flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-[11px] text-muted-foreground" onClick={handleCopy}>
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-[11px] text-muted-foreground">
              <Download className="h-3 w-3" /> Export
            </Button>
            {/* Regenerate is a placeholder — wiring it up requires re-sending the parent
                user message, which will fall out naturally once streaming support lands. */}
            <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-[11px] text-muted-foreground" disabled title="Coming soon">
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