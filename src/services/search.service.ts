import { mockResponse } from "./api/api";
import { seedSearchIndex } from "@/mock/search";
import type { SearchResult } from "@/types/cms";

export const searchService = {
  index: () => mockResponse<SearchResult[]>(seedSearchIndex),
  query: (q: string) =>
    mockResponse<SearchResult[]>(
      !q
        ? seedSearchIndex
        : seedSearchIndex.filter((r) =>
            (r.title + " " + (r.subtitle ?? "")).toLowerCase().includes(q.toLowerCase()),
          ),
    ),
};
