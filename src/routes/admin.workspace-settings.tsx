import { createFileRoute } from "@tanstack/react-router";
import { AdminStub } from "@/features/admin/AdminStub";

export const Route = createFileRoute("/admin/workspace-settings")({
  component: () => (
    <AdminStub
      title="Workspace settings"
      description="Defaults for modules, streaming, artifacts, sharing, and enterprise data controls."
    />
  ),
});
