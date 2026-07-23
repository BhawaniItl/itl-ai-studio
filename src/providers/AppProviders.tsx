import type { ReactNode } from "react";
import { ModalManager } from "@/components/common/ModalManager";
import { CommandPalette } from "@/components/common/CommandPalette";
import { NotificationDrawer } from "@/components/common/NotificationDrawer";
import { AuthProvider } from "./AuthProvider";

/**
 * Global overlays / systems that must be mounted once for the entire app.
 * Renders alongside <Outlet /> in the root shell — never gates route content.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}

      <ModalManager />
      <CommandPalette />
      <NotificationDrawer />
    </AuthProvider>
  );
}
