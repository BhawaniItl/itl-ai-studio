import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PageHeaderSkeleton() {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-9 w-32" />
    </div>
  );
}

export function MetricCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-5 shadow-soft">
          <Skeleton className="h-3 w-20" />
          <div className="mt-3 flex items-baseline justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-10" />
          </div>
          <Skeleton className="mt-3 h-8 w-full" />
        </Card>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <Card className="p-5 shadow-soft">
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="space-y-2.5">
        <div className="flex gap-4 border-b border-border/50 pb-2">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-3 flex-1" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 py-2">
            <div className="flex flex-1 items-center gap-2.5">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-2.5 w-24" />
              </div>
            </div>
            {Array.from({ length: Math.max(0, cols - 1) }).map((_, c) => (
              <Skeleton key={c} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-5 shadow-soft">
          <div className="mb-2 flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-14" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="mt-2 h-3 w-4/5" />
          <div className="mt-4 flex flex-wrap gap-1.5">
            {Array.from({ length: 5 }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-16 rounded-md" />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

export function FeatureListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <Card className="divide-y divide-border/50 shadow-soft">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between px-5 py-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-5 w-9 rounded-full" />
        </div>
      ))}
    </Card>
  );
}

export function PageBuilderSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
      <Card className="h-fit space-y-1 p-3 shadow-soft">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-1.5 px-1.5 py-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        ))}
      </Card>
      <Card className="p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-8 w-28" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-3">
              <Skeleton className="h-7 w-7 rounded-md" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-2.5 w-24" />
              </div>
              <Skeleton className="h-6 w-10" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function SidebarNavSkeleton() {
  return (
    <div className="mt-6 space-y-6">
      {Array.from({ length: 3 }).map((_, s) => (
        <div key={s}>
          <Skeleton className="mx-2 mb-2 h-2.5 w-16" />
          <ul className="space-y-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="flex items-center gap-2.5 px-2.5 py-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-3.5 w-28" />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
