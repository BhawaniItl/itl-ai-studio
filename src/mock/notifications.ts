import type { AppNotification } from "@/types/cms";

export const seedNotifications: AppNotification[] = [
  {
    id: "n1",
    title: "Welcome to ITL AI",
    body: "Your workspace is ready. Try asking about Section 44AB.",
    kind: "success",
    read: false,
    createdAt: "2026-07-15T09:22:00.000Z",
  },
  {
    id: "n2",
    title: "New circular indexed",
    body: "CBDT Circular 12/2026 is now searchable.",
    kind: "info",
    read: false,
    createdAt: "2026-07-14T14:10:00.000Z",
  },
  {
    id: "n3",
    title: "Trial ending in 5 days",
    body: "Upgrade to keep unlimited queries and citations.",
    kind: "warning",
    read: true,
    createdAt: "2026-07-12T08:00:00.000Z",
    href: "/pricing",
  },
];
