import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

export function AdminStub({ title, description }: { title: string; description: string }) {
  return (
    <>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <Card className="flex flex-col items-center justify-center gap-3 p-16 shadow-soft">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/8 text-primary">
          <Construction className="h-6 w-6" />
        </div>
        <p className="text-sm font-semibold">Coming soon</p>
        <p className="max-w-sm text-center text-xs text-muted-foreground">
          This module is scaffolded for future admin work — hooks, services and API endpoints are wired.
        </p>
      </Card>
    </>
  );
}
