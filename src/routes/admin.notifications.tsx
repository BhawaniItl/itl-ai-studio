import { createFileRoute } from "@tanstack/react-router";
import { AdminStub } from "@/features/admin/AdminStub";

export const Route = createFileRoute("/admin/notifications")({
  component: () => (
    <AdminStub
      title="Notifications"
      description="Announcements, digest scheduling, and system-wide messages to users."
    />
  ),
});
