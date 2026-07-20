/* eslint-disable prettier/prettier */
import type {
  HeroData,
  FeatureItem,
  Testimonial,
  PainPoint,
  ProductShowcase,
  ComparisonRow,
  TrustSource,
  LogoItem,
} from "@/types";

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
  typewriter: [
    "Draft a reply to a s.148 reassessment notice…",
    "Summarize the Ashish Agarwal SC judgment…",
    "Is ITC available on CSR expenditure under GST?",
    "Compute capital gains on unlisted share sale…",
    "Find case law on s.56(2)(x) HUF gifts…",
  ],
};

export const logos: LogoItem[] = [
  { name: "Deloitte", kind: "firm" },
  { name: "KPMG", kind: "firm" },
  { name: "BDO", kind: "firm" },
  { name: "Grant Thornton", kind: "firm" },
  { name: "PwC", kind: "firm" },
  { name: "EY", kind: "firm" },
  { name: "Nangia", kind: "firm" },
  { name: "Lakshmikumaran", kind: "firm" },
];

export const trustSources: TrustSource[] = [
  { icon: "Scale", name: "Income Tax Act, 1961", count: "Fully indexed" },
  { icon: "Landmark", name: "CGST / SGST / IGST Acts", count: "Fully indexed" },
  { icon: "FileText", name: "CBDT Circulars", count: "18K+" },
  { icon: "FileText", name: "CBIC Notifications", count: "22K+" },
  { icon: "Gavel", name: "Supreme Court", count: "12K+ judgments" },
  { icon: "Gavel", name: "High Courts", count: "84K+ judgments" },
  { icon: "Building2", name: "ITAT & CESTAT", count: "62K+ orders" },
  { icon: "BookOpen", name: "Rules & Forms", count: "Current" },
];

export const painPoints: PainPoint[] = [
  {
    icon: "Clock",
    title: "Hours lost in retrieval",
    body: "Skimming Manupatra, Taxmann and PDFs to find a single citation kills an entire afternoon.",
  },
  {
    icon: "AlertTriangle",
    title: "Missed precedents",
    body: "Even senior researchers miss the latest jurisdictional ruling that would have decided the matter.",
  },
  {
    icon: "FileWarning",
    title: "Notice reply drudgery",
    body: "Every reply is retyped from scratch — same reasoning, same case law, new client.",
  },
  {
    icon: "Layers",
    title: "Fragmented tooling",
    body: "One tool for statute, another for judgments, a third for drafting. Nothing talks to each other.",
  },
];

export const solutionSteps: { icon: string; title: string; body: string }[] = [
  { icon: "MessagesSquare", title: "Ask", body: "Natural-language questions with follow-ups, tables and computations." },
  { icon: "Search", title: "Research", body: "Grounded retrieval across Acts, rules, circulars and case law." },
  { icon: "PenLine", title: "Draft", body: "Notice replies, opinions and memos with editable sections and reasoning." },
  { icon: "Sparkles", title: "Summarize", body: "60-page orders reduced to issue, holding and ratio in seconds." },
  { icon: "Send", title: "Reply", body: "Export a client-ready deliverable to PDF, Word or markdown." },
];

export const features: FeatureItem[] = [
  { icon: "Scale", title: "Grounded case law research", description: "Every answer is anchored to verified citations from the Income Tax Act, GST Act, rules, circulars, and case law." },
  { icon: "FileText", title: "Notice reply drafting", description: "Upload a notice, get a structured draft reply with legal reasoning, precedents, and editable sections." },
  { icon: "Sparkles", title: "Order & judgment summarizer", description: "Turn 60-page tribunal orders into 60-second executive briefings with issue, holding, and ratio." },
  { icon: "MessagesSquare", title: "Ask Bot", description: "Conversational answers with follow-ups, tables, computations and export-ready formatting." },
  { icon: "ShieldCheck", title: "Enterprise-grade privacy", description: "SOC 2 aligned controls, encryption at rest and in transit, and strict data segregation for firms." },
  { icon: "Users", title: "Team workspaces", description: "Shared folders, prompt libraries, and role-based access designed for multi-partner firms." },
];

export const showcases: ProductShowcase[] = [
  {
    id: "ask",
    eyebrow: "Ask Bot",
    title: "Conversational research, grounded in law.",
    body: "Ask a question the way you'd ask a senior partner. ITL AI reasons over statute, rules, circulars and case law — and shows its work.",
    bullets: [
      "Follow-up questions retain full context",
      "Inline tables, computations and formulas",
      "One-click export to PDF, Word or markdown",
    ],
    icon: "MessagesSquare",
    cta: { label: "Try Ask Bot", to: "/workspace" },
    demo: "chat",
  },
  {
    id: "research",
    eyebrow: "Case Law Research",
    title: "Find the ruling you'd have missed.",
    body: "Semantic search across 180K+ judgments and 42K+ circulars. Jurisdiction-aware, section-aware, and always cited.",
    bullets: [
      "Filter by court, bench, section, year",
      "Auto-linked to statute and related orders",
      "Save to matter folders for team access",
    ],
    icon: "Scale",
    cta: { label: "Explore research", to: "/workspace" },
    demo: "research",
  },
  {
    id: "notice",
    eyebrow: "Notice Reply",
    title: "From notice to reply in minutes.",
    body: "Drop the notice PDF. ITL AI extracts the demand, identifies the grounds, and drafts a structured reply with reasoning and precedents.",
    bullets: [
      "Grounds-wise, section-wise structured reply",
      "Precedents attached to each contention",
      "Editable in-place, exported client-ready",
    ],
    icon: "FileText",
    cta: { label: "See Notice Reply", to: "/workspace" },
    demo: "notice",
  },
  {
    id: "draft",
    eyebrow: "Draft Assistant",
    title: "Rewrite, tighten and elevate every draft.",
    body: "Paste an old draft. Get a professional rewrite with clearer reasoning, cleaner structure and stronger citations.",
    bullets: [
      "Tone controls: formal, concise, persuasive",
      "Track suggestions like a senior reviewer",
      "Section-level regeneration",
    ],
    icon: "PenLine",
    cta: { label: "Draft with AI", to: "/workspace" },
    demo: "draft",
  },
  {
    id: "summarize",
    eyebrow: "Summarizer",
    title: "60 pages into 60 seconds.",
    body: "Upload a judgment or order. ITL AI returns the facts, issue, holding, ratio and referenced sections — with page anchors.",
    bullets: [
      "Issue → Holding → Ratio structure",
      "Sectional page anchors to the source",
      "Comparable rulings surfaced automatically",
    ],
    icon: "Sparkles",
    cta: { label: "Summarize an order", to: "/workspace" },
    demo: "summarize",
  },
];

export const comparison: ComparisonRow[] = [
  { capability: "Grounded Indian tax citations", manual: true, google: false, chatgpt: false, itl: true },
  { capability: "Case law with jurisdiction filters", manual: "Partial", google: false, chatgpt: false, itl: true },
  { capability: "Notice reply drafting", manual: "Manual", google: false, chatgpt: "Generic", itl: true },
  { capability: "Judgment summarization with ratio", manual: "Manual", google: false, chatgpt: "Approx.", itl: true },
  { capability: "Verifiable source links", manual: true, google: "Partial", chatgpt: false, itl: true },
  { capability: "Team workspaces & audit logs", manual: false, google: false, chatgpt: false, itl: true },
  { capability: "Data privacy for client matters", manual: true, google: false, chatgpt: "Shared", itl: true },
];

export const workflow = [
  { step: "01", title: "Ask or upload", body: "Ask a question, paste a query, or drop a notice PDF." },
  { step: "02", title: "AI researches", body: "The model retrieves and reasons over Acts, rules, circulars and judgments." },
  { step: "03", title: "Verify with citations", body: "Every claim is anchored to a verifiable source you can open inline." },
  { step: "04", title: "Draft & export", body: "Turn the answer into a memo, reply or client-ready note in seconds." },
];

export const noticeReplyFlow = [
  { icon: "Upload", title: "Upload notice", body: "Drop a s.148 / s.143(2) / GST DRC-01 PDF." },
  { icon: "ScanLine", title: "AI reads", body: "Extracts demand, grounds and referenced sections." },
  { icon: "Search", title: "Retrieves precedents", body: "Finds matching case law and circulars." },
  { icon: "PenLine", title: "Drafts reply", body: "Structured, grounds-wise, editable in-place." },
  { icon: "Download", title: "Download", body: "Client-ready PDF or Word, ready to file." },
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
