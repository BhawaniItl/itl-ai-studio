/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { Activity, AlertCircle, CheckCircle2, Clock, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricCardsSkeleton } from "@/features/admin/AdminSkeletons";
import { useAiAnalytics, useAiHealth } from "@/hooks";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/analytics")({
  component: AdminAnalyticsPage,
  head: () => ({ meta: [{ title: "Analytics — Admin" }] }),
});

const PROVIDER_LABELS: Record<string, string> = {
  main: "Ask Bot",
  premium: "Case Law Research",
  free: "Free Search",
  notice: "Notice Reply",
  summarizer: "Document Summarizer",
};

interface ProviderHealth {
  status: "healthy" | "unhealthy";
  response_time_ms: number;
  last_checked: string;
  error: string | null;
}

function AdminAnalyticsPage() {
  const { data: analytics, isLoading: analyticsLoading, isError: analyticsError } = useAiAnalytics();
  const { data: health, isLoading: healthLoading, refetch: refetchHealth, isFetching: healthRefetching } =
    useAiHealth();

  return (
    <>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI usage analytics and live provider health, in one place.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => refetchHealth()}
          disabled={healthRefetching}
        >
          <RefreshCw className={cn("h-3.5 w-3.5", healthRefetching && "animate-spin")} />
          Refresh health
        </Button>
      </div>

      {/* ---------------- Usage Analytics ---------------- */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Usage</h2>
        {analyticsLoading ? (
          <MetricCardsSkeleton count={4} />
        ) : analyticsError ? (
          <Card className="p-5 text-sm text-muted-foreground shadow-soft">
            Couldn't load analytics right now — the vendor's /api/v2/analytics/summary may be unavailable.
          </Card>
        ) : (
          <AnalyticsSummary data={analytics} />
        )}
      </section>

      {/* ---------------- Provider Health ---------------- */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Provider Health</h2>
        {healthLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Object.entries(health ?? {}).map(([provider, info]) => (
              <ProviderHealthCard key={provider} provider={provider} health={info as ProviderHealth} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

/**
 * The exact shape of /api/v2/analytics/summary isn't fully specified in any
 * doc shared so far — this renders defensively: known primitive top-level
 * fields become metric cards, anything else (nested objects/arrays) falls
 * back to a readable JSON block rather than assuming a schema and breaking.
 */
function AnalyticsSummary({ data }: { data: unknown }) {
  if (!data || typeof data !== "object") {
    return (
      <Card className="p-5 text-sm text-muted-foreground shadow-soft">No analytics data returned.</Card>
    );
  }

  const entries = Object.entries(data as Record<string, unknown>);
  const primitives = entries.filter(([, v]) => typeof v === "number" || typeof v === "string");
  const complex = entries.filter(([, v]) => typeof v === "object" && v !== null);

  return (
    <div className="space-y-4">
      {primitives.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {primitives.map(([key, value]) => (
            <Card key={key} className="p-5 shadow-soft">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {key.replace(/_/g, " ")}
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight">{String(value)}</p>
            </Card>
          ))}
        </div>
      )}
      {complex.map(([key, value]) => (
        <Card key={key} className="p-4 shadow-soft">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {key.replace(/_/g, " ")}
          </p>
          <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-[12px] leading-relaxed">
            {JSON.stringify(value, null, 2)}
          </pre>
        </Card>
      ))}
      {entries.length === 0 && (
        <Card className="p-5 text-sm text-muted-foreground shadow-soft">Analytics response was empty.</Card>
      )}
    </div>
  );
}

function ProviderHealthCard({ provider, health }: { provider: string; health: ProviderHealth }) {
  const healthy = health?.status === "healthy";

  return (
    <Card className="p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold">{PROVIDER_LABELS[provider] ?? provider}</p>
          <p className="text-[11px] text-muted-foreground">{provider}</p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 border-none",
            healthy ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive",
          )}
        >
          {healthy ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
          {healthy ? "Healthy" : "Unhealthy"}
        </Badge>
      </div>
      <div className="mt-3 space-y-1.5 text-[12px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Activity className="h-3 w-3" />
          {health?.response_time_ms != null ? `${health.response_time_ms} ms` : "—"}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          {health?.last_checked ? new Date(health.last_checked).toLocaleTimeString() : "—"}
        </div>
        {health?.error && (
          <p className="mt-1.5 rounded-md bg-destructive/8 px-2 py-1 text-destructive">{health.error}</p>
        )}
      </div>
    </Card>
  );
}