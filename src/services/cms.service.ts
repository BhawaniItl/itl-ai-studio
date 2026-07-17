import { mockResponse } from "./api/api";
import { pageConfigs, navigationConfig } from "@/mock/cms";
import type { PageConfig } from "@/types/cms";

export const cmsService = {
  getPage: (slug: string) =>
    mockResponse<PageConfig | null>(pageConfigs.find((p) => p.slug === slug) ?? null),
  listPages: () => mockResponse(pageConfigs),
  updatePage: (slug: string, patch: Partial<PageConfig>) =>
    mockResponse({ ok: true, slug, patch }),
};

export const navigationService = {
  getNavigation: () => mockResponse(navigationConfig),
};
