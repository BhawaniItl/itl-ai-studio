import { mockResponse } from "./api/api";
import { roles } from "@/config/permissions";
import type { RoleId } from "@/types/cms";

export const permissionService = {
  listRoles: () => mockResponse(roles),
  getRole: (id: RoleId) => mockResponse(roles.find((r) => r.id === id) ?? null),
  update: (id: RoleId, permissions: string[]) => mockResponse({ ok: true, id, permissions }),
};
