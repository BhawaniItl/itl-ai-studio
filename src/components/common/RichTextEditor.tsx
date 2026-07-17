import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Quote,
  Code,
  Table as TableIcon,
  Eye,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  autosave?: (html: string) => void;
  minHeight?: number;
}

/**
 * Reusable rich-text editor built on contentEditable + execCommand.
 * Intentionally dependency-free; can be swapped for TipTap later without
 * touching consumers.
 */
export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Start writing…",
  autosave,
  minHeight = 240,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [html, setHtml] = useState(value);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== html) ref.current.innerHTML = html;
  }, [html]);

  useEffect(() => {
    if (!autosave) return;
    const t = setTimeout(() => autosave(html), 800);
    return () => clearTimeout(t);
  }, [html, autosave]);

  function exec(cmd: string, arg?: string) {
    document.execCommand(cmd, false, arg);
    if (ref.current) setHtml(ref.current.innerHTML);
  }

  const tools: { icon: React.ReactNode; label: string; run: () => void }[] = [
    { icon: <Heading1 className="h-4 w-4" />, label: "H1", run: () => exec("formatBlock", "H1") },
    { icon: <Heading2 className="h-4 w-4" />, label: "H2", run: () => exec("formatBlock", "H2") },
    { icon: <Bold className="h-4 w-4" />, label: "Bold", run: () => exec("bold") },
    { icon: <Italic className="h-4 w-4" />, label: "Italic", run: () => exec("italic") },
    { icon: <Underline className="h-4 w-4" />, label: "Underline", run: () => exec("underline") },
    { icon: <List className="h-4 w-4" />, label: "Bulleted list", run: () => exec("insertUnorderedList") },
    { icon: <ListOrdered className="h-4 w-4" />, label: "Numbered list", run: () => exec("insertOrderedList") },
    { icon: <Quote className="h-4 w-4" />, label: "Quote", run: () => exec("formatBlock", "BLOCKQUOTE") },
    { icon: <Code className="h-4 w-4" />, label: "Code", run: () => exec("formatBlock", "PRE") },
    {
      icon: <LinkIcon className="h-4 w-4" />,
      label: "Link",
      run: () => {
        const url = window.prompt("URL");
        if (url) exec("createLink", url);
      },
    },
    {
      icon: <ImageIcon className="h-4 w-4" />,
      label: "Image",
      run: () => {
        const url = window.prompt("Image URL");
        if (url) exec("insertImage", url);
      },
    },
    {
      icon: <TableIcon className="h-4 w-4" />,
      label: "Table",
      run: () =>
        exec(
          "insertHTML",
          "<table class='w-full border-collapse'><thead><tr><th class='border p-2'>H1</th><th class='border p-2'>H2</th></tr></thead><tbody><tr><td class='border p-2'>A</td><td class='border p-2'>B</td></tr></tbody></table>",
        ),
    },
  ];

  return (
    <div className="rounded-xl border border-border/60 bg-card">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border/60 bg-secondary/30 p-1.5">
        {tools.map((t) => (
          <Button
            key={t.label}
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title={t.label}
            onClick={t.run}
          >
            {t.icon}
          </Button>
        ))}
        <div className="ml-auto flex items-center gap-0.5">
          <Button
            type="button"
            variant={mode === "edit" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => setMode("edit")}
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button
            type="button"
            variant={mode === "preview" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => setMode("preview")}
          >
            <Eye className="h-3.5 w-3.5" /> Preview
          </Button>
        </div>
      </div>
      <div className="relative" style={{ minHeight }}>
        {mode === "edit" ? (
          <div
            ref={ref}
            contentEditable
            suppressContentEditableWarning
            data-placeholder={placeholder}
            onInput={(e) => {
              const next = (e.target as HTMLDivElement).innerHTML;
              setHtml(next);
              onChange?.(next);
            }}
            className={cn(
              "prose prose-sm max-w-none px-4 py-3 focus:outline-none dark:prose-invert",
              "[&:empty]:before:pointer-events-none [&:empty]:before:text-muted-foreground [&:empty]:before:content-[attr(data-placeholder)]",
            )}
          />
        ) : (
          <div
            className="prose prose-sm max-w-none px-4 py-3 dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  );
}
