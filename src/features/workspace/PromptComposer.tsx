/* eslint-disable prettier/prettier */
import { useCallback, useEffect, useRef, useState } from "react";
import { Paperclip, Send, StopCircle, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePromptSuggestions } from "@/hooks";
import { useWorkspaceStore } from "@/store";

const MAX_TEXTAREA_HEIGHT_PX = 200;

export function PromptComposer({
  onSend,
  isStreaming = false,
  disabled = false,
  disabledReason,
}: {
  onSend?: (prompt: string) => void;
  isStreaming?: boolean;
  /** True when the active tool has no working backend yet (e.g. Draft Assistant). */
  disabled?: boolean;
  disabledReason?: string;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const activeModuleId = useWorkspaceStore((s) => s.activeModuleId);
  const { data: suggestions } = usePromptSuggestions(activeModuleId);
  const isInputDisabled = isStreaming || disabled;

  // Auto-grow: recalculate on every value change, capped so a huge paste
  // doesn't push the composer (or the messages above it) off screen.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT_PX)}px`;
  }, [value]);

  const submit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isInputDisabled) return; // guards against duplicate/mid-flight/disabled-tool submissions
    onSend?.(trimmed);
    setValue("");
  }, [value, isInputDisabled, onSend]);

  return (
    <div className="w-full">
      {disabled ? (
        <p className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-center text-[12px] text-amber-700 dark:text-amber-400">
          {disabledReason ?? "This tool isn't available yet."}
        </p>
      ) : (
        suggestions &&
        suggestions.length > 0 && (
          <div className="mb-3 flex flex-wrap justify-center gap-2">
            {suggestions.map((s) => (
              <button
                key={s.id}
                type="button"
                disabled={isInputDisabled}
                onClick={() => setValue(s.prompt)}
                className="rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
              >
                <span className="mr-1.5 text-primary">✦</span>
                {s.title}
              </button>
            ))}
          </div>
        )
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="glass-strong flex items-end gap-2 rounded-2xl p-2.5 shadow-float"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isInputDisabled}
          title="Attachments — coming soon"
          className="h-9 w-9 shrink-0 rounded-xl"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <textarea
          ref={textareaRef}
          value={value}
          disabled={isInputDisabled}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            // Enter = send, Shift+Enter = newline.
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder={
            disabled
              ? "This tool isn't available yet…"
              : "Ask ITL AI about Income Tax or GST — statute, case law, circulars, notice replies…"
          }
          className={cn(
            "min-h-[36px] flex-1 resize-none bg-transparent px-2 py-2 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
          style={{ maxHeight: MAX_TEXTAREA_HEIGHT_PX }}
        />
        <Button type="button" variant="ghost" size="icon" disabled={isInputDisabled} title="Voice input — coming soon" className="h-9 w-9 shrink-0 rounded-xl">
          <Mic className="h-4 w-4" />
        </Button>
        {isStreaming ? (
          <Button type="button" size="icon" variant="destructive" disabled className="h-9 w-9 shrink-0 rounded-xl" title="Stopping mid-response isn't supported yet">
            <StopCircle className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            disabled={!value.trim() || isInputDisabled}
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