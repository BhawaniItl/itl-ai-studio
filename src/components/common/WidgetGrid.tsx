import { useDashboardWidgets } from "@/hooks";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const sizeClass: Record<string, string> = {
  sm: "col-span-12 sm:col-span-6 lg:col-span-3",
  md: "col-span-12 lg:col-span-6",
  lg: "col-span-12 lg:col-span-8",
  xl: "col-span-12",
};

/**
 * Configurable dashboard grid. Widgets are registered locally by ID —
 * server can later reorder / hide / resize them via widget service.
 */
export function WidgetGrid({
  registry,
}: {
  registry: Record<string, (props: Record<string, unknown>) => ReactNode>;
}) {
  const { data } = useDashboardWidgets();
  return (
    <div className="grid grid-cols-12 gap-4">
      {(data ?? [])
        .filter((w) => w.visible)
        .map((w) => {
          const Comp = registry[w.component];
          return (
            <Card key={w.id} className={cn(sizeClass[w.size] ?? sizeClass.md, "p-4 shadow-soft")}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {w.title}
              </p>
              {Comp ? Comp(w.props ?? {}) : <p className="text-sm text-muted-foreground">No renderer for “{w.component}”.</p>}
            </Card>
          );
        })}
    </div>
  );
}
