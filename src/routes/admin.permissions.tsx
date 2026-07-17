import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/layouts/AdminLayout";
import { useRoles } from "@/hooks";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/permissions")({
  component: PermissionsPage,
});

function PermissionsPage() {
  const { data } = useRoles();
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight">Roles & permissions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure role scopes. Permissions are matched with wildcard globs (<code>cms.*</code>, <code>*.read</code>).
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {(data ?? []).map((r) => (
          <Card key={r.id} className="p-5 shadow-soft">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold">{r.label}</h3>
              <Badge variant="secondary">{r.id}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{r.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {r.permissions.map((p) => (
                <span key={p} className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[10px]">
                  {p}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
