import { createFileRoute } from "@tanstack/react-router";
import { AdminStub } from "@/features/admin/AdminStub";
export const Route = createFileRoute("/admin/theme")({
  component: () => <AdminStub title="Theme Settings" description="Customize brand colors, fonts and layout at runtime." />,
  head: () => ({ meta: [{ title: "Theme Settings — Admin" }] }),
});
