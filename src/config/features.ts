import type { FeatureFlag } from "@/types/cms";

export const defaultFeatureFlags: FeatureFlag[] = [
  { key: "income_tax", label: "Income Tax", enabled: true },
  { key: "gst", label: "GST", enabled: true },
  { key: "notice_reply", label: "Notice Reply", enabled: true },
  { key: "draft_assistant", label: "Draft Assistant", enabled: true },
  { key: "summarizer", label: "Summarizer", enabled: true },
  { key: "case_research", label: "Case Research", enabled: true },
  { key: "billing", label: "Billing", enabled: true },
  { key: "admin", label: "Admin Portal", enabled: true },
  { key: "api_keys", label: "API Keys", enabled: false },
  { key: "enterprise", label: "Enterprise", enabled: true },
  { key: "command_palette", label: "Command Palette", enabled: true },
  { key: "notifications", label: "Notification Center", enabled: true },
];
