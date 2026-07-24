/* eslint-disable prettier/prettier */
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CmsContentPage } from "@/types/cms";

/**
 * Registry of route → rich preview renderer. Empty today — every route falls
 * through to the raw JSON view. When real page previews are ready, register
 * `{ home: HomePreview, pricing: PricingPreview, ... }` here and this
 * component will pick them up automatically; nothing else needs to change.
 */
type PreviewRenderer = (page: CmsContentPage) => React.ReactNode;
const previewRenderers: Record<string, PreviewRenderer> = {};

export function CmsJsonPreview({ page }: { page: CmsContentPage }) {
  const richRenderer = previewRenderers[page.route];
  if (richRenderer) return <>{richRenderer(page)}</>;
  return <RawJsonPreview content={page.content} />;
}

function RawJsonPreview({ content }: { content: unknown }) {
  const [copied, setCopied] = useState(false);
  const formatted = JSON.stringify(content, null, 2);

  const copy = async () => {
    await navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="absolute right-2 top-2 h-7 gap-1.5 text-[11px]"
        onClick={copy}
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        {copied ? "Copied" : "Copy JSON"}
      </Button>
      <pre className="max-h-[70vh] overflow-auto rounded-xl bg-secondary/30 p-4 pt-12 font-mono text-xs leading-relaxed text-foreground">
        {formatted}
      </pre>
    </div>
  );
}