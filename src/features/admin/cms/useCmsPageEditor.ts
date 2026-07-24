/* eslint-disable prettier/prettier */
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useCmsContentPage, useCmsContentPages } from "@/hooks";
import { cmsContentService } from "@/services/cms.service";
import { isValidRoute } from "./cms-json-utils";
import type { CmsContentPage, CmsJsonObject } from "@/types/cms";

/**
 * GET /cms/pages only returns list rows (id/route/title/status) — the full
 * `content` blob comes from GET /cms/pages/{route}. So the sidebar is driven
 * by the list query, while the editor is driven by a per-route detail query
 * that's fetched lazily as pages are selected (and cached by TanStack Query
 * per route, so revisiting a page you've already opened is instant).
 */
export function useCmsPageEditor() {
  const queryClient = useQueryClient();
  const { data: listData, isLoading, isError, isFetching } = useCmsContentPages();
  const pages = useMemo(() => listData ?? [], [listData]);

  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, CmsContentPage>>({});
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    data: detail,
    isLoading: isDetailLoading,
    isFetching: isDetailFetching,
    isError: isDetailError,
  } = useCmsContentPage(selectedRoute);

  useEffect(() => {
    if (!selectedRoute && pages.length) setSelectedRoute(pages[0].route);
  }, [pages, selectedRoute]);

  const filteredPages = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pages;
    return pages.filter(
      (p) => p.title.toLowerCase().includes(q) || p.route.toLowerCase().includes(q),
    );
  }, [pages, search]);

  // detail is keyed by selectedRoute via its query key, so it's always in
  // sync with the current selection (never a stale route's content).
  const current: CmsContentPage | undefined = (selectedRoute && drafts[selectedRoute]) || detail;

  const dirty = selectedRoute ? Boolean(drafts[selectedRoute]) : false;
  const isContentLoading =
    Boolean(selectedRoute) && !current && (isDetailLoading || isDetailFetching);

  const updateDraft = (mutator: (p: CmsContentPage) => CmsContentPage) => {
    if (!current || !selectedRoute) return;
    setDrafts((d) => ({ ...d, [selectedRoute]: mutator(structuredClone(current)) }));
  };

  const setTitle = (title: string) => updateDraft((p) => ({ ...p, title }));
  const setContent = (content: CmsJsonObject) => updateDraft((p) => ({ ...p, content }));

  const discard = () => {
    if (!selectedRoute) return;
    setDrafts((d) => {
      const { [selectedRoute]: _discarded, ...rest } = d;
      return rest;
    });
  };

  const titleError = current && !current.title.trim() ? "Title is required." : null;
  const errors = [titleError].filter((e): e is string => Boolean(e));
  const canSave = dirty && errors.length === 0;

  const invalidatePages = async (route: string) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["cms", "content-pages"] }),
      queryClient.invalidateQueries({ queryKey: ["cms", "content-page", route] }),
    ]);
  };

  const save = async () => {
    if (!selectedRoute || !current || errors.length > 0) return;
    setSaving(true);
    try {
      await cmsContentService.updatePage(selectedRoute, {
        title: current.title,
        content: current.content,
      });
      toast.success(`Saved “${current.title}”`);
      discard();
      await invalidatePages(selectedRoute);
    } catch (err) {
      toast.error("Couldn't save this page. Please try again.");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const createPage = async (input: { route: string; title: string }) => {
    const route = input.route.trim();
    const title = input.title.trim();
    if (!isValidRoute(route)) {
      toast.error("Route must be lowercase letters, numbers and hyphens only.");
      return false;
    }
    if (!title) {
      toast.error("Title is required.");
      return false;
    }
    if (pages.some((p) => p.route === route)) {
      toast.error(`A page with route “${route}” already exists.`);
      return false;
    }
    try {
      await cmsContentService.createPage({ route, title, content: {} });
      toast.success(`Created “${title}”`);
      await queryClient.invalidateQueries({ queryKey: ["cms", "content-pages"] });
      setSelectedRoute(route);
      return true;
    } catch {
      toast.error("Couldn't create the page. Please try again.");
      return false;
    }
  };

  const deletePage = async (route: string) => {
    setDeleting(true);
    try {
      await cmsContentService.deletePage(route);
      toast.success(`Deleted “${route}”`);
      setDrafts((d) => {
        const { [route]: _removed, ...rest } = d;
        return rest;
      });
      if (selectedRoute === route) setSelectedRoute(null);
      queryClient.removeQueries({ queryKey: ["cms", "content-page", route] });
      await queryClient.invalidateQueries({ queryKey: ["cms", "content-pages"] });
    } catch {
      toast.error("Couldn't delete this page. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return {
    pages,
    filteredPages,
    isLoading,
    isFetching,
    isError,
    isContentLoading,
    isDetailError,
    search,
    setSearch,
    selectedRoute,
    setSelectedRoute,
    current,
    dirty,
    drafts,
    errors,
    canSave,
    saving,
    deleting,
    setTitle,
    setContent,
    discard,
    save,
    createPage,
    deletePage,
  };
}