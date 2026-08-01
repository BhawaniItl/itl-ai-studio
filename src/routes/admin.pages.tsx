/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useCmsPages } from "@/hooks";
import { cmsService } from "@/services/cms.service";
import { PageRenderer } from "@/components/common/PageRenderer";
import { listRegisteredComponents } from "@/registry/components";
import { PageBuilderSkeleton } from "@/features/admin/AdminSkeletons";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Save,
  Sparkles,
  Trash2,
  RotateCcw,
} from "lucide-react";
import type { ComponentId, PageConfig, SectionConfig } from "@/types/cms";

export const Route = createFileRoute("/admin/pages")({
  component: PagesPage,
  head: () => ({ meta: [{ title: "Page Builder — Admin" }] }),
});

function PagesPage() {
  const { data, isLoading, refetch } = useCmsPages();
  const pages = data ?? [];
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, PageConfig>>({});
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (!selectedSlug && pages.length) setSelectedSlug(pages[0].slug);
  }, [pages, selectedSlug]);

  const originals = useMemo(
    () => Object.fromEntries(pages.map((p: any) => [p.slug, p])),
    [pages],
  );

  const current: PageConfig | undefined =
    (selectedSlug && drafts[selectedSlug]) ||
    (selectedSlug ? originals[selectedSlug] : undefined);

  const dirty = selectedSlug ? Boolean(drafts[selectedSlug]) : false;

  const updateDraft = (mutator: (p: PageConfig) => PageConfig) => {
    if (!current || !selectedSlug) return;
    setDrafts((d) => ({ ...d, [selectedSlug]: mutator(structuredClone(current)) }));
  };

  const reorder = (sections: SectionConfig[]) =>
    sections
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((s, i) => ({ ...s, order: i + 1 }));

  const move = (id: string, dir: -1 | 1) =>
    updateDraft((p) => {
      const sorted = reorder(p.sections);
      const idx = sorted.findIndex((s) => s.id === id);
      const swap = idx + dir;
      if (idx < 0 || swap < 0 || swap >= sorted.length) return p;
      [sorted[idx], sorted[swap]] = [sorted[swap], sorted[idx]];
      p.sections = sorted.map((s, i) => ({ ...s, order: i + 1 }));
      return p;
    });

  const toggleVisible = (id: string) =>
    updateDraft((p) => {
      p.sections = p.sections.map((s) =>
        s.id === id ? { ...s, visible: !s.visible } : s,
      );
      return p;
    });

  const toggleAnimate = (id: string) =>
    updateDraft((p) => {
      p.sections = p.sections.map((s) =>
        s.id === id ? { ...s, animate: !s.animate } : s,
      );
      return p;
    });

  const duplicate = (id: string) =>
    updateDraft((p) => {
      const sorted = reorder(p.sections);
      const idx = sorted.findIndex((s) => s.id === id);
      if (idx < 0) return p;
      const src = sorted[idx];
      const copy: SectionConfig = {
        ...src,
        id: `${src.id}-copy-${Date.now().toString(36)}`,
      };
      sorted.splice(idx + 1, 0, copy);
      p.sections = sorted.map((s, i) => ({ ...s, order: i + 1 }));
      return p;
    });

  const remove = (id: string) =>
    updateDraft((p) => {
      p.sections = reorder(p.sections.filter((s) => s.id !== id));
      return p;
    });

  const addSection = (component: ComponentId) =>
    updateDraft((p) => {
      const next: SectionConfig = {
        id: `${component.toLowerCase()}-${Date.now().toString(36)}`,
        component,
        visible: true,
        order: p.sections.length + 1,
        animate: true,
      };
      p.sections = [...p.sections, next];
      return p;
    });

  const discard = () => {
    if (!selectedSlug) return;
    setDrafts((d) => {
      const { [selectedSlug]: _, ...rest } = d;
      return rest;
    });
  };

  const save = async () => {
    if (!selectedSlug || !current) return;
    await cmsService.updatePage(selectedSlug, current);
    toast.success(`Saved ${current.title}`);
    discard();
    refetch();
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Page builder</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Reorder, hide, duplicate, or animate any section — all driven by the runtime PageRenderer config.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPreview((v) => !v)}>
            {preview ? "Editor" : "Preview"}
          </Button>
          <Button variant="outline" size="sm" onClick={discard} disabled={!dirty}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Discard
          </Button>
          <Button size="sm" onClick={save} disabled={!dirty}>
            <Save className="mr-1.5 h-3.5 w-3.5" /> Save changes
          </Button>
        </div>
      </div>

      {isLoading && pages.length === 0 ? <PageBuilderSkeleton /> : (
      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <Card className="h-fit p-2 shadow-soft">
          <p className="px-2 pt-1 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Pages
          </p>
          <div className="space-y-1">
            {pages.map((p: any) => {
              const isActive = p.slug === selectedSlug;
              const isDirty = Boolean(drafts[p.slug]);
              return (
                <button
                  key={p.slug}
                  onClick={() => setSelectedSlug(p.slug)}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-secondary/60 text-foreground"
                  }`}
                >
                  <span className="truncate">
                    <span className="block truncate text-xs font-semibold">{p.title}</span>
                    <span className="block truncate text-[10px] text-muted-foreground">/{p.slug}</span>
                  </span>
                  {isDirty && <span className="ml-2 h-1.5 w-1.5 rounded-full bg-primary" />}
                </button>
              );
            })}
          </div>
        </Card>

        {current ? (
          preview ? (
            <Card className="overflow-hidden p-6 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Live preview
                </p>
                <Badge variant="outline" className="text-[10px]">/{current.slug}</Badge>
              </div>
              <div className="space-y-4 rounded-xl bg-secondary/20 p-4">
                <PageRenderer page={current} />
              </div>
            </Card>
          ) : (
            <Card className="p-5 shadow-soft">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold">{current.title}</h2>
                  <p className="text-xs text-muted-foreground">
                    {current.sections.length} section{current.sections.length === 1 ? "" : "s"} — updates route <code>/{current.slug}</code>
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="mr-1.5 h-3.5 w-3.5" /> Add section
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
                    <DropdownMenuLabel>Component</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {listRegisteredComponents().map((c) => (
                      <DropdownMenuItem key={c} onClick={() => addSection(c)}>
                        {c}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                {reorder(current.sections).map((s, i, arr) => (
                  <div
                    key={s.id}
                    className={`group flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5 transition ${
                      s.visible ? "border-border" : "border-dashed border-border/60 opacity-60"
                    }`}
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-secondary text-[11px] font-semibold text-muted-foreground">
                      {s.order}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold">{s.component}</span>
                        <Badge variant="outline" className="text-[10px]">{s.id}</Badge>
                        {s.featureFlag && (
                          <Badge variant="outline" className="text-[10px]">flag: {s.featureFlag}</Badge>
                        )}
                        {s.permission && (
                          <Badge variant="outline" className="text-[10px]">perm: {s.permission}</Badge>
                        )}
                      </div>
                    </div>

                    <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5" />
                      <Switch checked={!!s.animate} onCheckedChange={() => toggleAnimate(s.id)} />
                    </label>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title={s.visible ? "Hide" : "Show"}
                      onClick={() => toggleVisible(s.id)}
                    >
                      {s.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Move up"
                      disabled={i === 0}
                      onClick={() => move(s.id, -1)}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Move down"
                      disabled={i === arr.length - 1}
                      onClick={() => move(s.id, 1)}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Duplicate"
                      onClick={() => duplicate(s.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      title="Delete"
                      onClick={() => remove(s.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {current.sections.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border/60 bg-secondary/20 p-10 text-center text-sm text-muted-foreground">
                    No sections yet — use “Add section” to build this page.
                  </div>
                )}
              </div>
            </Card>
          )
        ) : (
          <Card className="grid place-items-center p-16 text-sm text-muted-foreground shadow-soft">
            Select a page to start editing.
          </Card>
        )}
      </div>
      )}
    </>
  );
}
