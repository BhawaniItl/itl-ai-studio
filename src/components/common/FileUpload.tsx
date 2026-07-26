/* eslint-disable prettier/prettier */
import { useCallback, useRef, useState } from "react";
import { UploadCloud, X, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn, generateId } from "@/lib/utils";
import { mockUpload, acceptedMime, type UploadKind } from "@/services/upload.service";
import type { UploadedFile } from "@/types/cms";

interface Props {
  kinds?: UploadKind[];
  multiple?: boolean;
  maxSizeMb?: number;
  onChange?: (files: UploadedFile[]) => void;
}

export function FileUpload({
  kinds = ["pdf", "docx", "image", "excel", "csv", "zip"],
  multiple = true,
  maxSizeMb = 20,
  onChange,
}: Props) {
  const [items, setItems] = useState<UploadedFile[]>([]);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = kinds.flatMap((k) => acceptedMime[k]).join(",");

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const arr = Array.from(files);
      const queued: UploadedFile[] = arr.map((f) => ({
        id: generateId(),
        name: f.name,
        size: f.size,
        type: f.type,
        progress: 0,
        status: "uploading",
      }));
      setItems((prev) => {
        const next = multiple ? [...prev, ...queued] : queued;
        onChange?.(next);
        return next;
      });
      for (let i = 0; i < arr.length; i++) {
        const file = arr[i];
        const id = queued[i].id;
        if (file.size > maxSizeMb * 1024 * 1024) {
          setItems((prev) =>
            prev.map((it) =>
              it.id === id ? { ...it, status: "error", error: `Exceeds ${maxSizeMb}MB` } : it,
            ),
          );
          continue;
        }
        const done = await mockUpload(file, (p) => {
          setItems((prev) => prev.map((it) => (it.id === id ? { ...it, progress: p } : it)));
        });
        setItems((prev) => {
          const next = prev.map((it) => (it.id === id ? { ...done, id } : it));
          onChange?.(next);
          return next;
        });
      }
    },
    [maxSizeMb, multiple, onChange],
  );

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/70 bg-secondary/30 px-6 py-10 text-center transition-colors",
          drag && "border-primary bg-primary/5",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={accept}
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            if (inputRef.current) inputRef.current.value = "";
          }}
        />
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <UploadCloud className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium">Drop files or click to upload</p>
        <p className="text-xs text-muted-foreground">
          {kinds.join(", ").toUpperCase()} · up to {maxSizeMb}MB
        </p>
      </label>

      {items.length > 0 && (
        <ul className="mt-4 space-y-2">
          {items.map((it) => (
            <li
              key={it.id}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-3 py-2.5"
            >
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-secondary/60">
                {it.status === "done" ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : it.status === "uploading" ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <FileText className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{it.name}</p>
                <div className="flex items-center gap-2">
                  <Progress value={it.progress} className="h-1" />
                  <span className="text-[11px] text-muted-foreground">
                    {(it.size / 1024).toFixed(0)} KB
                  </span>
                </div>
                {it.error && <p className="text-xs text-destructive">{it.error}</p>}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  setItems((prev) => {
                    const next = prev.filter((x) => x.id !== it.id);
                    onChange?.(next);
                    return next;
                  });
                }}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}