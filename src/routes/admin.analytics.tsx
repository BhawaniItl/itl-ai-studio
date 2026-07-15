import { createFileRoute } from "@tanstack/react-router";
import { AdminStub } from "@/features/admin/AdminStub";
export const Route = createFileRoute("/admin/analytics")({
  component: () => <AdminStub title="Analytics" description="Platform usage, engagement, retention and cohort analytics." />,
  head: () => ({ meta: [{ title: "Analytics — Admin" }] }),
});
