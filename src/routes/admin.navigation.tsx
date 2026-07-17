import { createFileRoute } from "@tanstack/react-router";
import { AdminStub } from "@/features/admin/AdminStub";

export const Route = createFileRoute("/admin/navigation")({
  component: () => (
    <AdminStub
      title="Navigation Builder"
      description="Configure header, footer, workspace, and admin navigation without redeploying."
    />
  ),
});
