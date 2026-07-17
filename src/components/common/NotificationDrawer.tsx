import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CheckCheck, Info, AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";
import { useNotificationStore } from "@/store/notificationStore";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/types/cms";

const iconFor = (k: AppNotification["kind"]) => {
  switch (k) {
    case "success":
      return <CheckCircle2 className="h-4 w-4 text-success" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    case "error":
      return <XCircle className="h-4 w-4 text-destructive" />;
    default:
      return <Info className="h-4 w-4 text-primary" />;
  }
};

export function NotificationDrawer() {
  const open = useNotificationStore((s) => s.drawerOpen);
  const setOpen = useNotificationStore((s) => s.setDrawerOpen);
  const items = useNotificationStore((s) => s.items);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="flex-row items-center justify-between space-y-0">
          <SheetTitle>Notifications</SheetTitle>
          <Button variant="ghost" size="sm" onClick={markAllRead} className="gap-1.5 text-xs">
            <CheckCheck className="h-4 w-4" /> Mark all read
          </Button>
        </SheetHeader>
        <ul className="mt-4 space-y-2">
          {items.length === 0 && (
            <li className="rounded-xl border border-border/60 bg-card p-6 text-center text-sm text-muted-foreground">
              You're all caught up.
            </li>
          )}
          {items.map((n) => (
            <li
              key={n.id}
              onClick={() => markRead(n.id)}
              className={cn(
                "cursor-pointer rounded-xl border border-border/60 bg-card p-3 transition-colors hover:bg-secondary/40",
                !n.read && "border-l-4 border-l-primary",
              )}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5">{iconFor(n.kind)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{n.title}</p>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  {n.body && <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
