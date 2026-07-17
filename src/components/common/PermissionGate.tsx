import { usePermission } from "@/hooks";
import type { ReactNode } from "react";

/** Renders children only if the current role has the permission. */
export function PermissionGate({
  permission,
  fallback = null,
  children,
}: {
  permission: string;
  fallback?: ReactNode;
  children: ReactNode;
}) {
  const allowed = usePermission(permission);
  if (!allowed) return <>{fallback}</>;
  return <>{children}</>;
}
