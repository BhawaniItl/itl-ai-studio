import { createFileRoute } from "@tanstack/react-router";
import { AdminStub } from "@/features/admin/AdminStub";
export const Route = createFileRoute("/admin/roles")({
  component: () => <AdminStub title="Roles & Permissions" description="Define roles and fine-grained permissions." />,
  head: () => ({ meta: [{ title: "Roles & Permissions — Admin" }] }),
});
