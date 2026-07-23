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
}
};

export const analyticsService = {
  getOverview: () => mockResponse(adminMetrics),
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
