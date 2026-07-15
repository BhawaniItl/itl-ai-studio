import { createFileRoute } from "@tanstack/react-router";
import { AdminStub } from "@/features/admin/AdminStub";
export const Route = createFileRoute("/admin/media")({
  component: () => <AdminStub title="Media Library" description="Upload, tag and organize images and documents." />,
  head: () => ({ meta: [{ title: "Media Library — Admin" }] }),
});
