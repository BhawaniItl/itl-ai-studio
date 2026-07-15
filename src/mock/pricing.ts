import type { PricingPlan } from "@/types";

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
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
    period: "monthly",
    currency: "₹",
    description: "For active CAs and advocates.",
    featured: true,
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
