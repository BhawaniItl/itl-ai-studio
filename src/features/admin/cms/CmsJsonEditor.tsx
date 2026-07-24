/* eslint-disable prettier/prettier */
import { useCallback, useMemo } from "react";
import { FileJson } from "lucide-react";
import { CmsJsonNode } from "./CmsJsonNode";
import { applyJsonAction, type CmsJsonAction } from "./cms-json-utils";
import type { CmsJsonObject } from "@/types/cms";

interface CmsJsonEditorProps {
  value: CmsJsonObject | null | undefined;
  onChange: (next: CmsJsonObject) => void;
  readOnly?: boolean;
}

/**
 * Unlimited-nesting, fully data-driven JSON editor. Objects may contain
 * arrays, arrays may contain objects, to any depth — CmsJsonNode recurses
 * on whatever shape it's given, with no per-page or per-key special casing.
 */
export function CmsJsonEditor({ value, onChange, readOnly = false }: CmsJsonEditorProps) {
  // A page can legitimately have a null/missing content blob (e.g. a
  // freshly created page, or a payload gap) — normalize to `{}` so the
  // recursive renderer never has to special-case a nullish root.
  const safeValue: CmsJsonObject = useMemo(() => value ?? {}, [value]);

  const dispatch = useCallback(
    (action: CmsJsonAction) => {
      onChange(applyJsonAction(safeValue, action));
    },
    [safeValue, onChange],
  );

  const hasKeys = Object.keys(safeValue).length > 0;

  if (!hasKeys && readOnly) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 bg-secondary/20 py-12 text-center">
        <FileJson className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">This page has no content yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-2">
      <CmsJsonNode value={safeValue} path={[]} depth={0} dispatch={dispatch} readOnly={readOnly} />
    </div>
  );
}