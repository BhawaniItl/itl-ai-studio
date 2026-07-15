import { createFileRoute } from "@tanstack/react-router";
import { AdminStub } from "@/features/admin/AdminStub";
export const Route = createFileRoute("/admin/ai")({
  component: () => <AdminStub title="AI Settings" description="Configure models, temperature, tool routing and safety." />,
  head: () => ({ meta: [{ title: "AI Settings — Admin" }] }),
});
