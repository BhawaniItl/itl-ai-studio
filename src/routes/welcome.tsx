/* eslint-disable prettier/prettier */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/welcome")({
  component: Welcome,
  head: () => ({ meta: [{ title: "Welcome to ITL AI" }] }),
});

function Welcome() {
  return (
    <AuthLayout title="Welcome to ITL AI." subtitle="Your workspace is ready. Here's a quick starting point.">
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
        <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl gradient-primary text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold">Try your first query</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Ask about reassessment, ITC eligibility, or drop a notice PDF into the workspace.
        </p>
      </div>
      <Button asChild className="mt-4 h-11 w-full rounded-xl gradient-primary text-primary-foreground shadow-soft">
        <Link to="/workspace">Open workspace</Link>
      </Button>
    </AuthLayout>
  );
}
