import { createFileRoute } from "@tanstack/react-router";
import { AdminStub } from "@/features/admin/AdminStub";

export const Route = createFileRoute("/admin/cms")({
  component: () => (
    <AdminStub
      title="Content Management"
      description="Draft, edit and publish website content — landing sections, about page, testimonials, and marketing copy."
    />
  ),
});
