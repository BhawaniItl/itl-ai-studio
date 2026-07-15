import { createFileRoute } from "@tanstack/react-router";
import { AdminStub } from "@/features/admin/AdminStub";
export const Route = createFileRoute("/admin/seo")({
  component: () => <AdminStub title="SEO" description="Manage titles, descriptions, sitemap and structured data." />,
  head: () => ({ meta: [{ title: "SEO — Admin" }] }),
});
