/* eslint-disable prettier/prettier */
import { api, endpoints } from "./api/api";
import type { PageConfig } from "@/types/cms";

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