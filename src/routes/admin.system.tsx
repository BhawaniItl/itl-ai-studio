import { createFileRoute } from "@tanstack/react-router";
import { AdminStub } from "@/features/admin/AdminStub";
export const Route = createFileRoute("/admin/system")({
  component: () => <AdminStub title="System Settings" description="Environment, integrations and platform preferences." />,
  head: () => ({ meta: [{ title: "System Settings — Admin" }] }),
});
