import { mockResponse } from "./api/api";
import { defaultFeatureFlags } from "@/config/features";

export const featureService = {
  list: () => mockResponse(defaultFeatureFlags),
  update: (key: string, enabled: boolean) => mockResponse({ ok: true, key, enabled }),
};
