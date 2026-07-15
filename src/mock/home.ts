import type { HeroData, FeatureItem, Testimonial } from "@/types";

export const heroData: HeroData = {
  eyebrow: "Purpose-built for Indian tax professionals",
  title: "The AI copilot for",
  highlight: "Income Tax & GST",
  subtitle:
    "Research statute, case law and circulars, draft notice replies, and summarize orders — all grounded in verifiable citations. Built for CAs, advocates and tax teams.",
  primaryCta: { label: "Open Workspace", to: "/workspace" },
  secondaryCta: { label: "See pricing", to: "/pricing" },
  stats: [
    { label: "Case laws indexed", value: "180K+" },
    { label: "Circulars & notifications", value: "42K+" },
    { label: "Avg. research time saved", value: "83%" },
    { label: "Firms onboarded", value: "1,200+" },
  ],
  logos: ["Deloitte", "KPMG", "BDO", "Grant Thornton", "PwC", "EY"],
};

export const features: FeatureItem[] = [
  {
    icon: "Scale",
    title: "Grounded case law research",
    description:
      "Every answer is anchored to verified citations from the Income Tax Act, GST Act, rules, circulars, and case law.",
  },
  {
    icon: "FileText",
    title: "Notice reply drafting",
    description:
      "Upload a notice, get a structured draft reply with legal reasoning, precedents, and editable sections.",
  },
  {
    icon: "Sparkles",
    title: "Order & judgment summarizer",
    description:
      "Turn 60-page tribunal orders into 60-second executive briefings with issue, holding, and ratio.",
  },
  {
    icon: "MessagesSquare",
    title: "Ask Bot",
    description:
      "Conversational answers with follow-ups, tables, computations and export-ready formatting.",
  },
  {
    icon: "ShieldCheck",
    title: "Enterprise-grade privacy",
    description:
      "SOC 2 aligned controls, encryption at rest and in transit, and strict data segregation for firms.",
  },
  {
    icon: "Users",
    title: "Team workspaces",
    description:
      "Shared folders, prompt libraries, and role-based access designed for multi-partner firms.",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "CA Arvind Menon",
    role: "Partner",
    firm: "Menon & Associates",
    quote:
      "ITL AI has become our first stop for research. What used to take an associate a full afternoon we now complete before the second coffee.",
  },
  {
    name: "Adv. Priya Ranganathan",
    role: "Senior Advocate",
    firm: "Tribunal Practice",
    quote:
      "The citations are grounded and traceable. That's the bar for legal AI, and ITL clears it.",
  },
  {
    name: "CA Rohan Shah",
    role: "Tax Head",
    firm: "Mid-market listed group",
    quote:
      "Notice replies with verifiable precedents and clean formatting. This is what enterprise legal AI should feel like.",
  },
];

export const workflow = [
  { step: "01", title: "Ask or upload", body: "Ask a question, paste a query, or drop a notice PDF." },
  { step: "02", title: "AI researches", body: "The model retrieves and reasons over Acts, rules, circulars and judgments." },
  { step: "03", title: "Verify with citations", body: "Every claim is anchored to a verifiable source you can open inline." },
  { step: "04", title: "Draft & export", body: "Turn the answer into a memo, reply or client-ready note in seconds." },
];
