/* eslint-disable prettier/prettier */
import { api, endpoints } from "./api/api";
import type {
  PageConfig,
  CmsContentPage,
  CmsContentPageCreateInput,
  CmsContentPageUpdateInput,
} from "@/types/cms";

export const cmsService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getPage<T = any>(slug: string): Promise<T> {
    const { data } = await api.get(endpoints.cms.page(slug));

    // Backend response:
    // {
    //   id,
    //   route,
    //   title,
    //   content: { ... },
    //   status
    // }

    return data.content as T;
  },

  async listPages() {
    const { data } = await api.get(endpoints.cms.pages);
    return data;
  },

  async updatePage(slug: string, patch: Partial<PageConfig>) {
    const { data } = await api.put(endpoints.cms.page(slug), patch);
    return data;
  },
};

export const navigationService = {
  async getNavigation() {
    const { data } = await api.get(endpoints.navigation.root);
    return data;
  },
};


/**
 * Generic CMS content pages — talks to the FastAPI `/cms/pages` router.
 * Each record is an arbitrary JSON `content` blob keyed by `route`; this is
 * the data source for the Admin CMS raw JSON editor (see
 * src/features/admin/cms). Kept separate from `cmsService` above, which is
 * scoped to the section-based Page Builder's `PageConfig` shape.
 */
export const cmsContentService = {
  async listPages(): Promise<CmsContentPage[]> {
    const { data } = await api.get(endpoints.cms.pages);
    return data;
  },

  async getPage(route: string): Promise<CmsContentPage> {
    const { data } = await api.get(endpoints.cms.page(route));
    return data;
  },

  async createPage(payload: CmsContentPageCreateInput): Promise<CmsContentPage> {
    const { data } = await api.post(endpoints.cms.pages, payload);
    return data;
  },

  async updatePage(route: string, payload: CmsContentPageUpdateInput): Promise<CmsContentPage> {
    const { data } = await api.put(endpoints.cms.page(route), payload);
    return data;
  },

  async deletePage(route: string): Promise<{ message: string }> {
    const { data } = await api.delete(endpoints.cms.page(route));
    return data;
  },
};