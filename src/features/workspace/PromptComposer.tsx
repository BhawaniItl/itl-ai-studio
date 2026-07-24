import { useEffect, useRef, useState } from "react";
import { Paperclip, Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePromptSuggestions } from "@/hooks";
import { useWorkspaceStore } from "@/store";

interface PromptComposerProps {
  onSend: (prompt: string) => Promise<void> | void;
  isStreaming?: boolean;
}

export function PromptComposer({ onSend, isStreaming = false }: PromptComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const activeModuleId = useWorkspaceStore((state) => state.activeModuleId);
  const { data: suggestions } = usePromptSuggestions(activeModuleId);
  const canSend = value.trim().length > 0 && !isStreaming;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [value]);

  const submit = () => {
    const prompt = value.trim();
    if (!prompt || isStreaming) return;
    setValue("");
    void onSend(prompt);
  };

  return (
    <div className="w-full">
      {suggestions && suggestions.length > 0 && (
        <div className="mb-3 flex flex-wrap justify-center gap-2">
          {suggestions.map((suggestion) => (
            <button key={suggestion.id} type="button" onClick={() => setValue(suggestion.prompt)} disabled={isStreaming}
              className="rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50">
              <span className="mr-1.5 text-primary">✦</span>{suggestion.title}
            </button>
          ))}
        </div>
      )}
      <form onSubmit={(event) => { event.preventDefault(); submit(); }} className={cn("glass-strong flex items-end gap-2 rounded-2xl p-2.5 shadow-float", isStreaming && "opacity-80")}>
        <Button type="button" variant="ghost" size="icon" disabled className="h-9 w-9 shrink-0 rounded-xl" aria-label="Attachments will be available soon"><Paperclip className="h-4 w-4" /></Button>
        <textarea ref={textareaRef} value={value} disabled={isStreaming} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submit(); }
        }} rows={1} placeholder="Ask ITL AI about Income Tax or GST — statute, case law, circulars, notice replies…" className="min-h-[36px] max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed" />
        <Button type="button" variant="ghost" size="icon" disabled className="h-9 w-9 shrink-0 rounded-xl" aria-label="Voice input will be available soon"><Mic className="h-4 w-4" /></Button>
        <Button type="submit" size="icon" disabled={!canSend} className="h-9 w-9 shrink-0 rounded-xl gradient-primary text-primary-foreground shadow-soft" aria-label="Send message"><Send className="h-4 w-4" /></Button>
      </form>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">Responses are grounded in Indian tax statute & case law. Always verify citations before advising clients.</p>
    </div>
  );
}
