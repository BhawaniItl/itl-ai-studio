import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { usePricing } from "@/hooks";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  component: Pricing,
  head: () => ({ meta: [{ title: "Pricing — ITL AI" }, { name: "description", content: "Simple, transparent plans for professionals and firms." }] }),
});

function Pricing() {
  const { data: plans } = usePricing();
  return (
    <PublicLayout>
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Pricing</p>
        <h1 className="mt-3 font-display text-5xl font-bold tracking-tight md:text-6xl">
          Simple, transparent, professional.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          Start free. Upgrade when your team is ready. Firm-wide licences available.
        </p>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-5 md:grid-cols-3">
          {(plans ?? []).map((p) => (
            <div
              key={p.id}
              className={cn(
                "relative rounded-3xl border p-8 shadow-soft transition-shadow hover:shadow-elevated",
                p.featured
                  ? "border-primary/40 bg-card shadow-float ring-1 ring-primary/20"
                  : "border-border/60 bg-card",
              )}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary-foreground">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold tracking-tight">
                  {p.currency}
                  {p.price.toLocaleString("en-IN")}
                </span>
                <span className="text-sm text-muted-foreground">/ {p.period}</span>
              </div>
              <Button
                asChild
                className={cn(
                  "mt-6 w-full h-11 rounded-xl",
                  p.featured ? "gradient-primary text-primary-foreground shadow-soft" : "",
                )}
                variant={p.featured ? "default" : "outline"}
              >
                <Link to="/register">{p.cta}</Link>
              </Button>
              <ul className="mt-6 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
