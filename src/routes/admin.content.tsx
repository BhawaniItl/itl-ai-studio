import { createFileRoute } from "@tanstack/react-router";
import { AdminStub } from "@/features/admin/AdminStub";
export const Route = createFileRoute("/admin/content")({
  component: () => <AdminStub title="Content Management" description="Manage marketing pages, blog posts and knowledge articles." />,
  head: () => ({ meta: [{ title: "Content Management — Admin" }] }),
});
