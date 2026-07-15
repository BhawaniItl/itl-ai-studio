import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useFAQ } from "@/hooks";

export const Route = createFileRoute("/faq")({
  component: FAQ,
  head: () => ({ meta: [{ title: "FAQ — ITL AI" }, { name: "description", content: "Common questions about ITL AI, pricing, data privacy and modules." }] }),
});

function FAQ() {
  const { data } = useFAQ();
  return (
    <PublicLayout>
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-24">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">FAQ</p>
        <h1 className="mt-3 font-display text-5xl font-bold tracking-tight md:text-6xl">
          Frequently asked questions.
        </h1>
        <div className="mt-10 rounded-3xl border border-border/60 bg-card p-2 shadow-soft">
          <Accordion type="single" collapsible className="w-full">
            {(data ?? []).map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border/50 px-4 last:border-b-0">
                <AccordionTrigger className="text-left text-base font-semibold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </PublicLayout>
  );
}
