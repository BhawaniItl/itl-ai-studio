/* eslint-disable prettier/prettier */
import { UserListParams } from "@/types/admin";
import { api, endpoints, mockResponse } from "./api/api";
import { adminMetrics, adminNav } from "@/mock/admin";


export const adminService = {
  getMetrics: () => mockResponse(adminMetrics),
  getNav: () => mockResponse(adminNav),
  async getUsers(params: UserListParams) {

    const { data } = await api.get(
        endpoints.adminUsers.list,
        {
            params,
        },
    );

    return data;
},
  async getUser(id: number) {
    const { data } = await api.get(endpoints.adminUsers.detail(id));
    return data;
  },
  async updateUser(id: number, patch: Record<string, unknown>) {
    const { data } = await api.put(endpoints.adminUsers.update(id), patch);
    return data;
  },
  async approveUser(id: number) {
    const { data } = await api.patch(endpoints.adminUsers.approve(id));
    return data;
  },
  async suspendUser(id: number) {
    const { data } = await api.patch(endpoints.adminUsers.suspend(id));
    return data;
  },
  async deleteUser(id: number) {
    const { data } = await api.patch(endpoints.adminUsers.delete(id));
    return data;
  },
  async getUserHistory(id: number) {
    const { data } = await api.get(endpoints.adminUsers.history(id));
    return data;
  },
};

export const analyticsService = {
  getOverview: () => mockResponse(adminMetrics),
  // GET /ai/analytics — mirrors the vendor's GET /api/v2/analytics/summary,
  // admin-only on the backend (require_admin dependency).
  async getAiAnalytics(params?: { start_date?: string; end_date?: string }) {
    const { data } = await api.get(endpoints.ai.analytics, { params });
    return data.data;
  },
  // GET /ai/health — per-provider status, response time, last-checked,
  // and any error, for every configured AI provider.
  async getAiHealth() {
    const { data } = await api.get(endpoints.ai.health);
    return data.data;
  },
};

export const userService = {
  async me() {
    const { data } = await api.get(endpoints.auth.me);
    return data;
  },
};

export const settingsService = {
  get: () => mockResponse({ notifications: true, weeklyDigest: false, betaFeatures: true }),
  update: (patch: Record<string, unknown>) => mockResponse({ ok: true, patch }),
};