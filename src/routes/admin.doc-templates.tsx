import { createFileRoute } from "@tanstack/react-router";
import { AdminStub } from "@/features/admin/AdminStub";

export const Route = createFileRoute("/admin/doc-templates")({
  component: () => (
    <AdminStub
      title="Document templates"
      description="Standardized templates for notice replies, drafts and letters — used by the workspace."
    />
  ),
});
