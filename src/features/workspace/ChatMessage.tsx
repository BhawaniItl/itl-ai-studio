/* eslint-disable prettier/prettier */
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Check, Download, Wand2, ThumbsDown, ThumbsUp, Scale, FileText, BookOpen, Bell, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store";
import { chatService } from "@/services/workspace.service";
import type { ChatMessage } from "@/types";

const REFINE_SUGGESTIONS = ["Make it more formal", "Summarize", "Explain in simple language", "Add more case law"];

export function ChatMessageBubble({ message, threadId }: { message: ChatMessage; threadId: string }) {
  const isUser = message.role === "user";
  const isError = message.status === "error";
  const isPending = message.status === "pending";
  const [copied, setCopied] = useState(false);
  const [isRefineOpen, setIsRefineOpen] = useState(false);

  // Optimistic/local-only messages (e.g. still in flight, or an error bubble)
  // don't have a real backend message id yet — feedback and refine both need
  // one, so they're disabled rather than firing a request that can't succeed.
  const hasBackendId = !message.id.startsWith("local-");

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
          <>
            <div className="mt-2 flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-[11px] text-muted-foreground" onClick={handleCopy}>
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-[11px] text-muted-foreground">
                <Download className="h-3 w-3" /> Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 px-2 text-[11px] text-muted-foreground"
                disabled={!hasBackendId}
                title={hasBackendId ? undefined : "Still saving — try again in a moment"}
                onClick={() => setIsRefineOpen(true)}
              >
                <Wand2 className="h-3 w-3" /> Refine
              </Button>
              <span className="mx-1 h-3.5 w-px bg-border" />
              <FeedbackButtons threadId={threadId} message={message} disabled={!hasBackendId} />
            </div>
            <RefineDialog
              open={isRefineOpen}
              onOpenChange={setIsRefineOpen}
              threadId={threadId}
              message={message}
            />
          </>
        )}
      </div>
    </motion.div>
  );
}

function FeedbackButtons({
  threadId,
  message,
  disabled,
}: {
  threadId: string;
  message: ChatMessage;
  disabled: boolean;
}) {
  const updateMessage = useChatStore((s) => s.updateMessage);
  const [submitting, setSubmitting] = useState<"up" | "down" | null>(null);
  const alreadyGiven = message.feedback;

  const submit = async (rating: "up" | "down") => {
    if (disabled || alreadyGiven || submitting) return;
    setSubmitting(rating);
    try {
      await chatService.submitFeedback(message.id, rating);
      updateMessage(threadId, message.id, { feedback: rating });
    } catch {
      toast.error("Couldn't submit feedback — please try again.");
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        disabled={disabled || !!alreadyGiven || submitting === "down"}
        onClick={() => submit("up")}
        title="Good response"
        className={cn(
          "h-7 w-7",
          alreadyGiven === "up" ? "text-primary" : "text-muted-foreground",
        )}
      >
        {submitting === "up" ? <Loader2 className="h-3 w-3 animate-spin" /> : <ThumbsUp className="h-3 w-3" fill={alreadyGiven === "up" ? "currentColor" : "none"} />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        disabled={disabled || !!alreadyGiven || submitting === "up"}
        onClick={() => submit("down")}
        title="Bad response"
        className={cn(
          "h-7 w-7",
          alreadyGiven === "down" ? "text-destructive" : "text-muted-foreground",
        )}
      >
        {submitting === "down" ? <Loader2 className="h-3 w-3 animate-spin" /> : <ThumbsDown className="h-3 w-3" fill={alreadyGiven === "down" ? "currentColor" : "none"} />}
      </Button>
    </>
  );
}

function RefineDialog({
  open,
  onOpenChange,
  threadId,
  message,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  threadId: string;
  message: ChatMessage;
}) {
  const [instruction, setInstruction] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const addMessage = useChatStore((s) => s.addMessage);

  const handleSubmit = async () => {
    const trimmed = instruction.trim();
    if (!trimmed || isRefining) return;
    setIsRefining(true);
    try {
      // Appended as a NEW assistant message — the original answer is never
      // overwritten, and the conversation history stays intact.
      const refined = await chatService.refineMessage(message.id, trimmed);
      addMessage(threadId, refined);
      setInstruction("");
      onOpenChange(false);
    } catch {
      toast.error("Couldn't refine that answer — please try again.");
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !isRefining && onOpenChange(next)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Refine this answer</DialogTitle>
          <DialogDescription>How would you like to refine this answer?</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {REFINE_SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setInstruction(s)}
                className="rounded-full border border-border/60 bg-card/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
          <Textarea
            autoFocus
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="e.g. Make it more formal, or add more case law…"
            rows={3}
            disabled={isRefining}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isRefining}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!instruction.trim() || isRefining} className="gap-1.5">
            {isRefining && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isRefining ? "Refining…" : "Refine"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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