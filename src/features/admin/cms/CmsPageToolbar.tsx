/* eslint-disable prettier/prettier */
import { Eye, Pencil, RotateCcw, Save, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { CmsContentPage } from "@/types/cms";

interface CmsPageToolbarProps {
  page: CmsContentPage;
  dirty: boolean;
  errors: string[];
  canSave: boolean;
  saving: boolean;
  preview: boolean;
  onTogglePreview: () => void;
  onTitleChange: (title: string) => void;
  onDiscard: () => void;
  onSave: () => void;
  onDeleteClick: () => void;
}

export function CmsPageToolbar({
  page,
  dirty,
  errors,
  canSave,
  saving,
  preview,
  onTogglePreview,
  onTitleChange,
  onDiscard,
  onSave,
  onDeleteClick,
}: CmsPageToolbarProps) {
  return (
    <div className="mb-4 space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid flex-1 gap-3 sm:grid-cols-2 sm:max-w-md">
          <div className="space-y-1.5">
            <Label htmlFor="cms-page-title" className="text-[11px] text-muted-foreground">
              Title
            </Label>
            <Input
              id="cms-page-title"
              value={page.title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cms-page-route" className="text-[11px] text-muted-foreground">
              Route
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex h-9 items-center rounded-md border border-input bg-secondary/40 px-3 font-mono text-sm text-muted-foreground">
                    /{page.route}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  Route can't be changed after creation — delete and recreate to rename it.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onTogglePreview}>
            {preview ? (
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
            ) : (
              <Eye className="mr-1.5 h-3.5 w-3.5" />
            )}
            {preview ? "Editor" : "Preview"}
          </Button>
          <Button variant="outline" size="sm" onClick={onDiscard} disabled={!dirty}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Discard
          </Button>
          <Button size="sm" onClick={onSave} disabled={!canSave || saving}>
            <Save className="mr-1.5 h-3.5 w-3.5" /> {saving ? "Saving..." : "Save changes"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            title="Delete page"
            onClick={onDeleteClick}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {errors.length > 0 && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription className="text-xs">{errors.join(" ")}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}