/* eslint-disable prettier/prettier */
import { Plus, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CmsContentPage } from "@/types/cms";

interface CmsPageSidebarProps {
  pages: CmsContentPage[];
  search: string;
  onSearchChange: (value: string) => void;
  selectedRoute: string | null;
  onSelect: (route: string) => void;
  dirtyRoutes: string[];
  onCreate: () => void;
}

export function CmsPageSidebar({
  pages,
  search,
  onSearchChange,
  selectedRoute,
  onSelect,
  dirtyRoutes,
  onCreate,
}: CmsPageSidebarProps) {
  return (
    <Card className="flex h-fit flex-col gap-3 p-3 shadow-soft">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search pages..."
            className="h-9 pl-8 text-sm"
          />
        </div>
        <Button
          size="icon"
          variant="outline"
          className="h-9 w-9 shrink-0"
          title="New page"
          onClick={onCreate}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-1">
        {pages.map((p) => {
          const isActive = p.route === selectedRoute;
          const isDirty = dirtyRoutes.includes(p.route);
          return (
            <button
              key={p.route}
              onClick={() => onSelect(p.route)}
              className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
                isActive ? "bg-primary/10 text-primary" : "hover:bg-secondary/60 text-foreground"
              }`}
            >
              <span className="min-w-0 truncate">
                <span className="block truncate text-xs font-semibold">{p.title}</span>
                <span className="block truncate text-[10px] text-muted-foreground">/{p.route}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5">
                {p.status && (
                  <Badge
                    variant="outline"
                    className="h-4 px-1 text-[9px] capitalize text-muted-foreground"
                  >
                    {p.status}
                  </Badge>
                )}
                {isDirty && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
              </span>
            </button>
          );
        })}

        {pages.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            No pages match “{search}”.
          </p>
        )}
      </div>
    </Card>
  );
}