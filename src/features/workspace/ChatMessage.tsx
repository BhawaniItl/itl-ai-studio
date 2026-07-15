import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
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
            <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:my-2 prose-table:my-3 prose-th:bg-muted prose-th:text-foreground prose-td:border prose-td:border-border prose-th:border prose-th:border-border prose-td:p-2 prose-th:p-2 prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-[13px] prose-code:before:content-[''] prose-code:after:content-['']">
              <ReactMarkdown
                components={{
                  code({ inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    if (!inline && match) {
                      return (
                        <SyntaxHighlighter
                          style={oneLight}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            borderRadius: "0.75rem",
                            fontSize: "13px",
                            padding: "0.9rem",
                            border: "1px solid var(--color-border)",
                          }}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      );
                    }
                    return <code className={className} {...props}>{children}</code>;
                  },
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
