import { createFileRoute } from "@tanstack/react-router";
import { AdminStub } from "@/features/admin/AdminStub";
export const Route = createFileRoute("/admin/subscriptions")({
  component: () => <AdminStub title="Subscriptions" description="Manage plans, invoices and billing across workspaces." />,
  head: () => ({ meta: [{ title: "Subscriptions — Admin" }] }),
});
