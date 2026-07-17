import { mockResponse } from "./api/api";
import { dashboardWidgets } from "@/mock/widgets";

export const widgetService = {
  list: () => mockResponse(dashboardWidgets),
  update: (id: string, patch: Record<string, unknown>) => mockResponse({ ok: true, id, patch }),
};
