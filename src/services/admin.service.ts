import { mockResponse } from "./api/api";
import { adminMetrics, adminUsers, adminNav } from "@/mock/admin";

export const adminService = {
  getMetrics: () => mockResponse(adminMetrics),
  getUsers: () => mockResponse(adminUsers),
  getNav: () => mockResponse(adminNav),
};

export const analyticsService = {
  getOverview: () => mockResponse(adminMetrics),
};

export const userService = {
  me: () =>
    mockResponse({
      id: "me",
      name: "CA Demo User",
      email: "demo@itl.ai",
      role: "user" as const,
      plan: "pro" as const,
    }),
};

export const settingsService = {
  get: () => mockResponse({ notifications: true, weeklyDigest: false, betaFeatures: true }),
  update: (patch: Record<string, unknown>) => mockResponse({ ok: true, patch }),
};
