import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/common/Icon";
import type { HeroData, FeatureItem, Testimonial } from "@/types";

export function Hero({ data }: { data: HeroData }) {
  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-32 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {data.eyebrow}
          </div>
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground md:text-7xl">
            {data.title}{" "}
            <span className="text-gradient">{data.highlight}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {data.subtitle}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="h-12 gap-2 rounded-xl px-6 gradient-primary text-primary-foreground shadow-float">
              <Link to={data.primaryCta.to}>
                {data.primaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-xl px-6">
              <Link to={data.secondaryCta.to}>{data.secondaryCta.label}</Link>
            </Button>
          </div>
        </motion.div>

        {/* Product mock card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-16 max-w-5xl"
        >
          <div className="glass-strong rounded-3xl p-2 shadow-float">
            <div className="rounded-2xl border border-border/60 bg-card">
              <div className="flex items-center gap-1.5 border-b border-border/60 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
                <span className="ml-3 text-[11px] font-mono text-muted-foreground">itl.ai / workspace / income-tax</span>
              </div>
              <div className="grid grid-cols-[200px_1fr] text-left">
                <div className="border-r border-border/60 p-3 text-xs">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Recent</p>
                  {["Reassessment u/s 148", "ITC on credit notes", "s.56(2)(x) HUF gift"].map((t, i) => (
                    <div
                      key={t}
                      className={`mb-1 truncate rounded-md px-2 py-1.5 ${i === 0 ? "bg-primary/8 text-primary" : "text-muted-foreground"}`}
                    >
                      {t}
                    </div>
                  ))}
                </div>
                <div className="space-y-3 p-4">
                  <div className="ml-auto max-w-xs rounded-xl bg-primary px-3 py-2 text-xs text-primary-foreground">
                    What's the limitation for reopening under s.148?
                  </div>
                  <div className="max-w-md rounded-xl border border-border/60 bg-surface p-3 text-xs leading-relaxed">
                    Under the amended regime effective 1 April 2021, notice under s.148 may be issued within{" "}
                    <span className="font-semibold">3 years</span> (or 10 years where escaped income ≥ ₹50 lakh)…
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px]">s.147 IT Act</span>
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px]">Ashish Agarwal, SC</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
          {data.stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-bold text-gradient md:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturesGrid({ items }: { items: FeatureItem[] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Platform</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Everything a tax professional needs.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Purpose-built modules that replace hours of retrieval with minutes of judgment.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="group relative rounded-2xl border border-border/60 bg-card p-6 shadow-soft transition-shadow hover:shadow-elevated"
          >
            <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-primary/8 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon name={f.icon} className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function WorkflowSection({ steps }: { steps: { step: string; title: string; body: string }[] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">How it works</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
          From question to citation in seconds.
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {steps.map((s) => (
          <div key={s.step} className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
            <p className="font-mono text-xs font-semibold text-primary">{s.step}</p>
            <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Loved by professionals</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Trusted by leading firms.
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((t) => (
          <figure key={t.name} className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
            <blockquote className="text-[15px] leading-relaxed text-foreground">"{t.quote}"</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
                {t.name.split(" ").slice(-1)[0][0]}
              </div>
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">
                  {t.role} · {t.firm}
                </p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <div className="glass-strong overflow-hidden rounded-3xl p-10 shadow-float md:p-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Ready to research at the speed of thought?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start free. Upgrade when your team is ready. No credit card required.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="h-12 rounded-xl px-6 gradient-primary text-primary-foreground shadow-soft">
              <Link to="/workspace">Open Workspace</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-xl px-6">
              <Link to="/pricing">See pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
