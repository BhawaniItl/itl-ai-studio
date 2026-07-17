import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/layouts/AdminLayout";
import { useFeatureFlags } from "@/hooks";
import { useFeatureFlagStore } from "@/store/featureFlagStore";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/admin/features")({
  component: FeatureFlagsPage,
});

function FeatureFlagsPage() {
  const { data } = useFeatureFlags();
  const flags = useFeatureFlagStore((s) => s.flags);
  const setEnabled = useFeatureFlagStore((s) => s.setEnabled);
  const list = flags.length ? flags : (data ?? []);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight">Feature flags</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Toggle capabilities across the platform. Changes apply instantly and gate matching UI, hooks and services.
        </p>
      </div>
      <Card className="divide-y divide-border/50 shadow-soft">
        {list.map((f) => (
          <div key={f.key} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-semibold">{f.label}</p>
              <p className="text-xs text-muted-foreground">{f.key}</p>
            </div>
            <Switch checked={f.enabled} onCheckedChange={(v) => setEnabled(f.key, v)} />
          </div>
        ))}
      </Card>
    </AdminLayout>
  );
}
