import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminLayout } from "@/layouts/AdminLayout";

export const Route = createFileRoute("/admin")({
  component: AdminShell,
  head: () => ({ meta: [{ title: "Admin — ITL AI" }] }),
});

function AdminShell() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
