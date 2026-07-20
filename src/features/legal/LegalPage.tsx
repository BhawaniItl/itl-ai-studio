/* eslint-disable prettier/prettier */
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { Printer, Share2, Search, Clock, Calendar } from "lucide-react";
import dayjs from "dayjs";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLegal } from "@/hooks";
import { cn } from "@/lib/utils";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function LegalPage({ slug }: { slug: string }) {
  const { data } = useLegal(slug);
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string>("");
  const articleRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: articleRef, offset: ["start start", "end end"] });

  const sections = data?.sections ?? [];
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return sections;
    return sections.filter((s) => s.heading.toLowerCase().includes(needle) || s.body.toLowerCase().includes(needle));
  }, [sections, q]);

  useEffect(() => {
    if (!articleRef.current) return;
    const headings = articleRef.current.querySelectorAll("h2[data-toc-id]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.tocId || "");
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    headings.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, [filtered.length]);

  if (!data) return null;
  const readingTime = (data as any).readingTime ?? "5 min read";

  return (
    <PublicLayout>
      {/* Progress bar */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed left-0 right-0 top-0 z-50 h-0.5 origin-left gradient-primary"
      />

      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 gradient-hero opacity-60" />
        <div className="relative mx-auto max-w-4xl px-6 pt-24 pb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Legal</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">{data.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Last updated {dayjs(data.updatedAt).format("D MMM YYYY")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {readingTime}
            </span>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search this document…"
                className="h-10 rounded-xl border-border/60 bg-card pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => typeof window !== "undefined" && window.print()}
            >
              <Printer className="mr-1.5 h-4 w-4" /> Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={async () => {
                if (typeof window === "undefined") return;
                if (navigator.share) {
                  try {
                    await navigator.share({ title: data.title, url: window.location.href });
                  } catch {}
                } else {
                  await navigator.clipboard.writeText(window.location.href);
                }
              }}
            >
              <Share2 className="mr-1.5 h-4 w-4" /> Share
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-6 pb-24 lg:grid-cols-[220px_1fr]">
        {/* TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              On this page
            </p>
            <nav className="space-y-1 border-l border-border pl-3">
              {sections.map((s) => {
                const id = slugify(s.heading);
                const isActive = active === id;
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={cn(
                      "block text-sm transition-colors",
                      isActive ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {s.heading}
                  </a>
                );
              })}
            </nav>
          </div>
        </aside>

        <article ref={articleRef} className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft md:p-10">
          <div className="prose-lg space-y-8">
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sections match your search.</p>
            ) : (
              filtered.map((s) => {
                const id = slugify(s.heading);
                return (
                  <section key={id} id={id}>
                    <h2
                      data-toc-id={id}
                      className="font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl"
                    >
                      {s.heading}
                    </h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{s.body}</p>
                  </section>
                );
              })
            )}
          </div>
        </article>
      </div>
    </PublicLayout>
  );
}
