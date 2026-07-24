/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileWarning } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageBuilderSkeleton } from "@/features/admin/AdminSkeletons";
import { CmsPageSidebar } from "@/features/admin/cms/CmsPageSidebar";
import { CmsPageToolbar } from "@/features/admin/cms/CmsPageToolbar";
import { CmsJsonEditor } from "@/features/admin/cms/CmsJsonEditor";
import { CmsJsonPreview } from "@/features/admin/cms/CmsJsonPreview";
import { CreateCmsPageDialog } from "@/features/admin/cms/CreateCmsPageDialog";
import { DeleteCmsPageDialog } from "@/features/admin/cms/DeleteCmsPageDialog";
import { useCmsPageEditor } from "@/features/admin/cms/useCmsPageEditor";

export const Route = createFileRoute("/admin/cms")({
  component: CmsContentPage,
  head: () => ({ meta: [{ title: "Content Management — Admin" }] }),
});

function CmsContentPage() {
  const editor = useCmsPageEditor();
  const [preview, setPreview] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const pageToDelete = editor.pages.find((p) => p.route === deleteTarget) ?? null;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Content management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit any page's raw content JSON — every field is generic, so new keys, arrays and
            nested objects just work without a code change.
          </p>
        </div>
      </div>

      {editor.isLoading && editor.pages.length === 0 ? (
        <PageBuilderSkeleton />
      ) : editor.isError ? (
        <Card className="grid place-items-center gap-2 p-16 text-center shadow-soft">
          <FileWarning className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm font-medium">Couldn't load CMS pages.</p>
          <p className="text-xs text-muted-foreground">Check your connection and try again.</p>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
          <CmsPageSidebar
            pages={editor.filteredPages}
            search={editor.search}
            onSearchChange={editor.setSearch}
            selectedRoute={editor.selectedRoute}
            onSelect={(route) => {
              setPreview(false);
              editor.setSelectedRoute(route);
            }}
            dirtyRoutes={Object.keys(editor.drafts)}
            onCreate={() => setCreateOpen(true)}
          />

          {editor.pages.length === 0 ? (
            <Card className="grid place-items-center gap-3 p-16 text-center shadow-soft">
              <p className="text-sm text-muted-foreground">No CMS pages yet.</p>
              <Button size="sm" onClick={() => setCreateOpen(true)}>
                Create your first page
              </Button>
            </Card>
          ) : editor.isContentLoading ? (
            <Card className="p-5 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-8 w-28" />
              </div>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            </Card>
          ) : editor.isDetailError ? (
            <Card className="grid place-items-center gap-2 p-16 text-center shadow-soft">
              <FileWarning className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm font-medium">Couldn't load this page's content.</p>
              <p className="text-xs text-muted-foreground">Check your connection and try again.</p>
            </Card>
          ) : editor.current ? (
            <Card className="p-5 shadow-soft">
              <CmsPageToolbar
                page={editor.current}
                dirty={editor.dirty}
                errors={editor.errors}
                canSave={editor.canSave}
                saving={editor.saving}
                preview={preview}
                onTogglePreview={() => setPreview((v) => !v)}
                onTitleChange={editor.setTitle}
                onDiscard={editor.discard}
                onSave={editor.save}
                onDeleteClick={() => setDeleteTarget(editor.current!.route)}
              />

              {preview ? (
                <CmsJsonPreview page={editor.current} />
              ) : (
                <CmsJsonEditor value={editor.current.content} onChange={editor.setContent} />
              )}
            </Card>
          ) : (
            <Card className="grid place-items-center p-16 text-sm text-muted-foreground shadow-soft">
              Select a page to start editing.
            </Card>
          )}
        </div>
      )}

      <CreateCmsPageDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={editor.createPage}
      />

      <DeleteCmsPageDialog
        page={pageToDelete}
        deleting={editor.deleting}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={async () => {
          if (deleteTarget) await editor.deletePage(deleteTarget);
          setDeleteTarget(null);
        }}
      />
    </>
  );
}