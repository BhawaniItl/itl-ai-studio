import { mockResponse } from "./api/api";
import { legalDocs } from "@/mock/legal";

export const legalService = {
  getDoc: (slug: string) => mockResponse(legalDocs[slug] ?? null),
};
