import { useState } from "react";
import { motion } from "framer-motion";
import { Paperclip, Send, Sparkles, StopCircle, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePromptSuggestions } from "@/hooks";
import { useWorkspaceStore } from "@/store";

export function PromptComposer({
  onSend,
  isStreaming = false,
}: {
  onSend?: (prompt: string) => void;
  isStreaming?: boolean;
}) {
  const [value, setValue] = useState("");
  const activeModuleId = useWorkspaceStore((s) => s.activeModuleId);
  const { data: suggestions } = usePromptSuggestions(activeModuleId);

  return (
    <div className="w-full">
      {suggestions && suggestions.length > 0 && (
        <div className="mb-3 flex flex-wrap justify-center gap-2">
          {suggestions.map((s) => (
            <button
              key={s.id}
              onClick={() => setValue(s.prompt)}
              className="rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
            >
              <span className="mr-1.5 text-primary">✦</span>
              {s.title}
            </button>
          ))}
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!value.trim()) return;
          onSend?.(value.trim());
          setValue("");
        }}
        className={cn(
          "glass-strong flex items-end gap-2 rounded-2xl p-2.5 shadow-float",
        )}
      >
        <Button type="button" variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-xl">
          <Paperclip className="h-4 w-4" />
        </Button>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (!value.trim()) return;
              onSend?.(value.trim());
              setValue("");
            }
          }}
          rows={1}
          placeholder="Ask ITL AI about Income Tax or GST — statute, case law, circulars, notice replies…"
          className="min-h-[36px] max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <Button type="button" variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-xl">
          <Mic className="h-4 w-4" />
        </Button>
        {isStreaming ? (
          <Button type="button" size="icon" variant="destructive" className="h-9 w-9 shrink-0 rounded-xl">
            <StopCircle className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            disabled={!value.trim()}
            className="h-9 w-9 shrink-0 rounded-xl gradient-primary text-primary-foreground shadow-soft"
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </form>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        Responses are grounded in Indian tax statute & case law. Always verify citations before advising clients.
      </p>
    </div>
  );
}
