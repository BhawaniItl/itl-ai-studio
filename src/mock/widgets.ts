import type { DashboardWidget } from "@/types/cms";

export const dashboardWidgets: DashboardWidget[] = [
  { id: "w-mrr", title: "MRR", component: "MetricCard", size: "sm", visible: true, refreshInterval: 60_000, props: { metric: "mrr" } },
  { id: "w-users", title: "Active users", component: "MetricCard", size: "sm", visible: true, props: { metric: "users" } },
  { id: "w-queries", title: "Queries / day", component: "MetricCard", size: "sm", visible: true, props: { metric: "queries" } },
  { id: "w-csat", title: "CSAT", component: "MetricCard", size: "sm", visible: true, props: { metric: "csat" } },
  { id: "w-usage", title: "Usage trend", component: "UsageChart", size: "lg", visible: true },
  { id: "w-recent-users", title: "Recent signups", component: "RecentUsersTable", size: "md", visible: true },
];
