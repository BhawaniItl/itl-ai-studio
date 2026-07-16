import type { PricingPlan } from "@/types";

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    yearlyPrice: 0,
    period: "monthly",
    currency: "₹",
    description: "For students & individual practitioners exploring ITL AI.",
    cta: "Start free",
    features: [
      "50 queries / month",
      "Income Tax Ask Bot",
      "Basic citations",
      "Community support",
    ],
  },
  {
    id: "pro",
    name: "Professional",
    price: 1499,
    yearlyPrice: 14990,
    period: "monthly",
    currency: "₹",
    description: "For active CAs and advocates.",
    featured: true,
    badge: "Most popular",
    cta: "Start 14-day trial",
    features: [
      "Unlimited queries",
      "Income Tax + GST modules",
      "Notice reply & summarizer",
      "Prompt library & folders",
      "Priority email support",
    ],
  },
  {
    id: "firm",
    name: "Firm",
    price: 4999,
    yearlyPrice: 49990,
    period: "monthly",
    currency: "₹",
    description: "For multi-partner firms and in-house teams.",
    cta: "Book a demo",
    features: [
      "Everything in Professional",
      "Team workspaces & roles",
      "Shared prompt libraries",
      "SSO & audit logs",
      "Dedicated success manager",
    ],
  },
];

export const pricingComparison = {
  groups: [
    {
      name: "Research & drafting",
      rows: [
        { label: "Monthly queries", values: ["50", "Unlimited", "Unlimited"] },
        { label: "Income Tax module", values: [true, true, true] },
        { label: "GST module", values: [false, true, true] },
        { label: "Notice reply drafting", values: [false, true, true] },
        { label: "Judgment summarizer", values: [false, true, true] },
        { label: "Draft assistant", values: [false, true, true] },
      ],
    },
    {
      name: "Collaboration",
      rows: [
        { label: "Prompt library & folders", values: [false, true, true] },
        { label: "Team workspaces", values: [false, false, true] },
        { label: "Role-based access", values: [false, false, true] },
        { label: "Shared matter folders", values: [false, false, true] },
      ],
    },
    {
      name: "Security & support",
      rows: [
        { label: "Encryption in transit & at rest", values: [true, true, true] },
        { label: "SSO (SAML / OIDC)", values: [false, false, true] },
        { label: "Audit logs", values: [false, false, true] },
        { label: "Support", values: ["Community", "Priority email", "Dedicated CSM"] },
      ],
    },
  ] as {
    name: string;
    rows: { label: string; values: (string | boolean)[] }[];
  }[],
};

export const enterpriseData = {
  eyebrow: "Enterprise",
  title: "For Big-4, in-house teams and large firms.",
  body: "Volume licensing, single sign-on, private deployments, custom data corpora and white-glove onboarding.",
  bullets: [
    "SSO with SAML 2.0 / OIDC",
    "Private cloud & VPC options",
    "Custom knowledge ingestion",
    "Named security review",
    "SLA-backed uptime",
    "24×7 dedicated support",
  ],
  cta: { label: "Talk to sales", to: "/contact" },
};

export const pricingFaqs = [
  { q: "Can I change plans anytime?", a: "Yes, upgrades take effect immediately and downgrades at the end of the billing cycle." },
  { q: "Do you offer annual billing?", a: "Yes. Annual billing saves ~17% versus monthly and is available on Professional and Firm." },
  { q: "Is there a free trial?", a: "Professional includes a 14-day trial with the full feature set. No credit card required." },
  { q: "What about GST invoicing?", a: "All plans invoice with GST. Firm plan supports company billing address and PO workflow." },
];
