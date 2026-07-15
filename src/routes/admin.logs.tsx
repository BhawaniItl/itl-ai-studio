import { createFileRoute } from "@tanstack/react-router";
import { AdminStub } from "@/features/admin/AdminStub";
export const Route = createFileRoute("/admin/logs")({
  component: () => <AdminStub title="Logs" description="Audit trail, error logs and system events." />,
  head: () => ({ meta: [{ title: "Logs — Admin" }] }),
});
