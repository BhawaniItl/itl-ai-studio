import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { useAbout } from "@/hooks";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({ meta: [{ title: "About — ITL AI" }, { name: "description", content: "Meet the team building the operating system for Indian tax professionals." }] }),
});

function About() {
  const { data } = useAbout();
  if (!data) return null;
  return (
    <PublicLayout>
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">About ITL AI</p>
        <h1 className="mt-3 font-display text-5xl font-bold tracking-tight md:text-6xl">{data.hero.title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">{data.hero.subtitle}</p>
      </section>
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Our mission</p>
          <p className="mt-3 font-display text-2xl leading-snug tracking-tight text-foreground md:text-3xl">
            {data.mission}
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-8 font-display text-3xl font-bold tracking-tight">Values</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {data.values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
              <h3 className="text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="mb-8 font-display text-3xl font-bold tracking-tight">Timeline</h2>
        <div className="space-y-3">
          {data.timeline.map((t) => (
            <div key={t.year} className="flex gap-6 rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
              <p className="w-16 shrink-0 font-mono text-sm font-semibold text-primary">{t.year}</p>
              <div>
                <p className="font-semibold">{t.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
