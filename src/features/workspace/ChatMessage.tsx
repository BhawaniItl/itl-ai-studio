import { memo, useCallback, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Bell, BookOpen, Check, Copy, FileText, RefreshCw, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

const citationIcon = { act: BookOpen, case: Scale, circular: FileText, notification: Bell };

export const ChatMessageBubble = memo(function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";
  const copyMessage = useCallback(async () => { try { await navigator.clipboard.writeText(message.content); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); } }, [message.content]);
  return <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
    {!isUser && <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full gradient-primary text-[11px] font-bold text-primary-foreground">ITL</div>}
    <div className={cn("min-w-0 max-w-3xl", isUser && "text-right")}><div className={cn("rounded-2xl px-4 py-3 text-[15px] leading-relaxed", isUser ? "bg-primary text-primary-foreground shadow-soft" : "border border-border/60 bg-card text-card-foreground shadow-soft")}>{isUser ? <p className="whitespace-pre-wrap">{message.content}</p> : <div className="markdown-body text-[15px] leading-[1.7]"><ReactMarkdown components={{ h1: (props) => <h1 className="mb-2 text-lg font-semibold tracking-tight" {...props} />, h2: (props) => <h2 className="mb-2 mt-4 text-base font-semibold tracking-tight" {...props} />, p: (props) => <p className="my-2" {...props} />, ul: (props) => <ul className="my-2 list-disc space-y-1 pl-5" {...props} />, ol: (props) => <ol className="my-2 list-decimal space-y-1 pl-5" {...props} />, code: ({ className, ...props }) => <code className={cn("rounded bg-muted px-1 py-0.5 font-mono text-[13px]", className)} {...props} />, pre: (props) => <pre className="my-3 overflow-x-auto rounded-xl border border-border bg-muted p-3 font-mono text-[13px] leading-relaxed" {...props} />, table: (props) => <div className="my-3 overflow-x-auto rounded-xl border border-border"><table className="w-full text-left text-sm" {...props} /></div>, th: (props) => <th className="border-b border-border bg-muted px-3 py-2 font-semibold" {...props} />, td: (props) => <td className="border-b border-border px-3 py-2 last:border-b-0" {...props} />, a: (props) => <a target="_blank" rel="noreferrer" className="text-primary underline underline-offset-2" {...props} /> }}>{message.content}</ReactMarkdown></div>}</div>
      {!isUser && message.citations?.length ? <div className="mt-2 flex flex-wrap gap-1.5">{message.citations.map((citation) => { const Icon = citationIcon[citation.type]; return <Badge key={citation.id} variant="outline" className="gap-1.5 rounded-lg border-border/70 bg-card/60 py-1 pl-1.5 pr-2 font-medium"><Icon className="h-3 w-3" /><span className="text-[11px]">{citation.title}</span></Badge>; })}</div> : null}
      {!isUser && <div className="mt-2 flex items-center gap-1"><Button variant="ghost" size="sm" onClick={() => void copyMessage()} className="h-7 gap-1.5 px-2 text-[11px] text-muted-foreground">{copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}{copied ? "Copied" : "Copy"}</Button><Button variant="ghost" size="sm" disabled className="h-7 gap-1.5 px-2 text-[11px] text-muted-foreground"><RefreshCw className="h-3 w-3" /> Regenerate</Button></div>}
    </div>
  </motion.div>;
});

export function TypingIndicator() { return <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground"><span className="font-medium text-foreground">ITL is thinking</span><span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary [animation-delay:0ms]" /><span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary [animation-delay:150ms]" /><span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary [animation-delay:300ms]" /></div>; }
