import { useFeatureFlag } from "@/hooks";
import type { ReactNode } from "react";

/** Renders children only if the feature flag is enabled. */
export function FeatureGate({
  flag,
  fallback = null,
  children,
}: {
  flag: string;
  fallback?: ReactNode;
  children: ReactNode;
}) {
  const enabled = useFeatureFlag(flag);
  if (!enabled) return <>{fallback}</>;
  return <>{children}</>;
}
