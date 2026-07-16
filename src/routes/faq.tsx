import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, HelpCircle, MessageSquare } from "lucide-react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFAQ } from "@/hooks";
import { faqCategories } from "@/mock/faq";
import { cn } from "@/lib/utils";
import { CtaBanner } from "@/features/landing/sections";

export const Route = createFileRoute("/faq")({
  component: FAQ,
  head: () => ({
    meta: [
      { title: "FAQ — ITL AI" },
      { name: "description", content: "Answers to common questions about ITL AI: product, pricing, privacy and enterprise." },
      { property: "og:title", content: "ITL AI — FAQ" },
      { property: "og:description", content: "Everything you need to know before adopting ITL AI." },
    ],
  }),
});

function FAQ() {
  const { data } = useFAQ();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const items = data ?? [];

  const filtered = useMemo(() => {
    return items.filter((f: any) => {
      const matchCat = cat === "All" || f.category === cat;
      const needle = q.trim().toLowerCase();
      const matchQ = !needle || f.q.toLowerCase().includes(needle) || f.a.toLowerCase().includes(needle);
      return matchCat && matchQ;
    });
  }, [items, q, cat]);

  const popular = items.slice(0, 4);

  return (
    <PublicLayout>
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 gradient-hero opacity-60" />
        <div className="relative mx-auto max-w-3xl px-6 pt-24 pb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Help center</p>
          <h1 className="mt-3 font-display text-5xl font-bold tracking-tight md:text-6xl">
            Frequently asked questions.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Search, browse by topic, or jump to the popular ones below.
          </p>
          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search questions…"
                className="h-12 rounded-xl border-border/60 bg-card pl-10 shadow-soft"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {faqCategories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                cat === c
                  ? "border-primary bg-primary text-primary-foreground shadow-soft"
                  : "border-border/60 bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {!q && cat === "All" && (
        <section className="mx-auto max-w-5xl px-6 pb-6">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Popular questions</p>
          <div className="grid gap-3 md:grid-cols-2">
            {popular.map((f: any, i: number) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
                <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/8 text-primary">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{f.q}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <div className="rounded-3xl border border-border/60 bg-card p-2 shadow-soft">
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">No questions match your search.</div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {filtered.map((f: any, i: number) => (
                <AccordionItem key={i} value={`i-${i}`} className="border-border/50 px-4 last:border-b-0">
                  <AccordionTrigger className="text-left text-base font-semibold">
                    <div className="flex items-start gap-3">
                      {f.category && (
                        <span className="mt-0.5 rounded-md bg-primary/8 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary">
                          {f.category}
                        </span>
                      )}
                      <span>{f.q}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6 text-center shadow-soft">
          <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-xl bg-primary/8 text-primary">
            <MessageSquare className="h-5 w-5" />
          </div>
          <p className="font-display text-lg font-semibold">Still have questions?</p>
          <p className="mt-1 text-sm text-muted-foreground">Our team usually replies within a few hours.</p>
          <Button asChild className="mt-4 rounded-xl gradient-primary text-primary-foreground shadow-soft">
            <Link to="/contact">Contact us</Link>
          </Button>
        </div>
      </section>

      <CtaBanner />
    </PublicLayout>
  );
}
