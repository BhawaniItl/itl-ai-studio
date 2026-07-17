import { create } from "zustand";
import type { RoleId } from "@/types/cms";
import { roles } from "@/config/permissions";

interface PermissionStore {
  role: RoleId;
  setRole: (r: RoleId) => void;
  can: (permission: string) => boolean;
}

function matches(pattern: string, needed: string): boolean {
  if (pattern === "*" || pattern === needed) return true;
  if (pattern.endsWith(".*")) return needed.startsWith(pattern.slice(0, -1));
  if (pattern.startsWith("*.")) return needed.endsWith(pattern.slice(1));
  return false;
}

export const usePermissionStore = create<PermissionStore>((set, get) => ({
  role: "customer",
  setRole: (role) => set({ role }),
  can: (permission) => {
    const role = roles.find((r) => r.id === get().role);
    if (!role) return false;
    return role.permissions.some((p) => matches(p, permission));
  },
}));
