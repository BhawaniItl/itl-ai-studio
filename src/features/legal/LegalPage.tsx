import { PublicLayout } from "@/layouts/PublicLayout";
import { useLegal } from "@/hooks";
import dayjs from "dayjs";

export function LegalPage({ slug }: { slug: string }) {
  const { data } = useLegal(slug);
  if (!data) return null;
  return (
    <PublicLayout>
      <article className="mx-auto max-w-3xl px-6 pt-20 pb-24">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">{data.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {dayjs(data.updatedAt).format("D MMMM YYYY")}</p>
        <div className="mt-10 space-y-8">
          {data.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-xl font-semibold tracking-tight">{s.heading}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </div>
      </article>
    </PublicLayout>
  );
}
