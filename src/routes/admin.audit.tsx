import { createFileRoute } from "@tanstack/react-router";
import { AdminStub } from "@/features/admin/AdminStub";

export const Route = createFileRoute("/admin/audit")({
  component: () => (
    <AdminStub
      title="Audit logs"
      description="Track every admin action, permission change, and CMS edit."
    />
  ),
});
