import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import {
  Hero,
  FeaturesGrid,
  WorkflowSection,
  Testimonials,
  CtaBanner,
} from "@/features/landing/sections";
import { useHome } from "@/hooks";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "ITL AI — Income Tax & GST research, drafting and case law" },
      {
        name: "description",
        content:
          "Purpose-built AI workspace for Chartered Accountants, advocates and tax teams. Grounded citations, notice drafting, case law summaries.",
      },
      { property: "og:title", content: "ITL AI — The AI copilot for Indian tax professionals" },
      {
        property: "og:description",
        content: "Research Income Tax & GST, draft replies, summarize orders — with verifiable citations.",
      },
    ],
  }),
});

function Home() {
  const { data, isLoading } = useHome();
  if (isLoading || !data) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="h-96 animate-pulse rounded-2xl bg-secondary/60" />
        </div>
      </PublicLayout>
    );
  }
  return (
    <PublicLayout>
      <Hero data={data.hero} />
      <FeaturesGrid items={data.features} />
      <WorkflowSection steps={data.workflow} />
      <Testimonials items={data.testimonials} />
      <CtaBanner />
    </PublicLayout>
  );
}
