import { createFileRoute } from "@tanstack/react-router";
import { AdminStub } from "@/features/admin/AdminStub";

export const Route = createFileRoute("/admin/email-templates")({
  component: () => (
    <AdminStub
      title="Email templates"
      description="Manage transactional email templates — invites, receipts, password resets."
    />
  ),
});
