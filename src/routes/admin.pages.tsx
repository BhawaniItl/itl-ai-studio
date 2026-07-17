import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/layouts/AdminLayout";
import { useCmsPages } from "@/hooks";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/pages")({
  component: PagesPage,
});

function PagesPage() {
  const { data } = useCmsPages();
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight">Page builder</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure sections on every page — reorder, hide, or swap components without deploying.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {(data ?? []).map((p) => (
          <Card key={p.slug} className="p-5 shadow-soft">
            <h3 className="text-sm font-semibold">{p.title}</h3>
            <p className="text-xs text-muted-foreground">/{p.slug}</p>
            <div className="mt-3 space-y-1.5">
              {p.sections.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-lg bg-secondary/40 px-3 py-1.5 text-xs">
                  <span className="font-medium">{s.component}</span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Badge variant="outline" className="text-[10px]">order {s.order}</Badge>
                    {s.visible ? <span className="text-success">visible</span> : <span>hidden</span>}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
