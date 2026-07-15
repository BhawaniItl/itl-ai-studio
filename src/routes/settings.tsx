import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useThemeStore } from "@/store";

export const Route = createFileRoute("/settings")({
  component: Settings,
  head: () => ({ meta: [{ title: "Settings — ITL AI" }] }),
});

function Settings() {
  const mode = useThemeStore((s) => s.theme.mode);
  const setMode = useThemeStore((s) => s.setMode);
  return (
    <PublicLayout>
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Preferences for how ITL AI works for you.</p>
        <div className="mt-8 space-y-4">
          <Card className="flex items-center justify-between p-6 shadow-soft">
            <div>
              <Label className="text-sm font-semibold">Dark mode</Label>
              <p className="text-xs text-muted-foreground">Enable a low-light theme for long research sessions.</p>
            </div>
            <Switch checked={mode === "dark"} onCheckedChange={(v) => setMode(v ? "dark" : "light")} />
          </Card>
          <Card className="flex items-center justify-between p-6 shadow-soft">
            <div>
              <Label className="text-sm font-semibold">Weekly digest</Label>
              <p className="text-xs text-muted-foreground">Get a summary of new case law and circulars every Monday.</p>
            </div>
            <Switch defaultChecked />
          </Card>
          <Card className="flex items-center justify-between p-6 shadow-soft">
            <div>
              <Label className="text-sm font-semibold">Beta features</Label>
              <p className="text-xs text-muted-foreground">Opt into early access to new AI capabilities.</p>
            </div>
            <Switch />
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}
