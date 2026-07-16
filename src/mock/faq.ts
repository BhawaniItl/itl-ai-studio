import type { FAQItem } from "@/types";

export const faqData: FAQItem[] = [
  { category: "Product", q: "What is ITL AI?", a: "ITL AI (Income Tax Library AI) is an AI workspace built for Indian tax professionals — CAs, advocates and tax teams — to research Income Tax and GST law, draft notice replies, and summarize orders." },
  { category: "Product", q: "How is ITL AI different from ChatGPT?", a: "ITL is grounded in verified Indian tax statute, rules, circulars and case law. Every answer surfaces citations you can open and verify. It is not a general-purpose chatbot." },
  { category: "Product", q: "Which modules are available today?", a: "Income Tax and GST. Each module ships with Ask Bot, Case Law Research, Notice Reply, Draft Assistant, and Summarizer." },
  { category: "Product", q: "How accurate are the answers?", a: "Answers are grounded in retrieval from indexed sources. We recommend professionals always verify citations before advising a client — the citations panel makes this a single click." },
  { category: "Product", q: "Can I export answers?", a: "Yes. Any answer can be copied as markdown, downloaded as PDF, or exported to Word for further editing." },
  { category: "Pricing", q: "Can I try before paying?", a: "Yes — the Starter plan is free, and Professional includes a 14-day trial." },
  { category: "Pricing", q: "Do you offer firm-wide licences?", a: "Yes. The Firm plan supports team workspaces, roles, SSO and audit logs. Book a demo from the pricing page." },
  { category: "Pricing", q: "Is annual billing available?", a: "Yes, annual billing saves roughly 17% vs monthly on Professional and Firm." },
  { category: "Privacy", q: "Do you store my client data?", a: "Your matters remain private to your workspace. Data is encrypted at rest and in transit, and never used to train models outside your account." },
  { category: "Privacy", q: "Where is data hosted?", a: "Data is hosted in Indian regions of our cloud providers. Enterprise customers can opt for private VPC deployments." },
  { category: "Privacy", q: "Are you SOC 2 compliant?", a: "We follow SOC 2 aligned controls with a formal audit in progress. A summary is available under NDA." },
  { category: "Enterprise", q: "Do you support SSO?", a: "Yes — SAML 2.0 and OIDC providers are supported on the Firm plan." },
  { category: "Enterprise", q: "Can we ingest our own knowledge?", a: "On enterprise plans we ingest a firm's opinions, precedents and internal handbooks into a private corpus." },
];

export const faqCategories = ["All", "Product", "Pricing", "Privacy", "Enterprise"];
