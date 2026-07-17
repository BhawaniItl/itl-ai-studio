import { mockResponse } from "./api/api";
import { seedNotifications } from "@/mock/notifications";
import type { AppNotification } from "@/types/cms";

export const notificationService = {
  list: () => mockResponse<AppNotification[]>(seedNotifications),
  markRead: (id: string) => mockResponse({ ok: true, id }),
  markAllRead: () => mockResponse({ ok: true }),
};
