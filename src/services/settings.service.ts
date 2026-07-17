import { mockResponse } from "./api/api";

export interface GlobalSettings {
  general: { appName: string; supportEmail: string; timezone: string };
  branding: { logoUrl?: string; primary: string; accent: string };
  theme: { defaultMode: "light" | "dark" | "system" };
  workspace: { defaultModule: string; streamingEnabled: boolean };
  notifications: { email: boolean; inApp: boolean; digest: "off" | "daily" | "weekly" };
  security: { mfaRequired: boolean; sessionMinutes: number };
  billing: { currency: string; taxIncluded: boolean };
  email: { fromName: string; fromEmail: string };
  ai: { defaultModel: string; temperature: number; maxTokens: number };
  legal: { companyName: string; address: string; gstin?: string };
  integrations: { slack: boolean; ms365: boolean; drive: boolean };
}

const defaults: GlobalSettings = {
  general: { appName: "ITL AI", supportEmail: "support@itl.ai", timezone: "Asia/Kolkata" },
  branding: { primary: "oklch(0.42 0.15 15)", accent: "oklch(0.62 0.16 30)" },
  theme: { defaultMode: "system" },
  workspace: { defaultModule: "income-tax", streamingEnabled: true },
  notifications: { email: true, inApp: true, digest: "weekly" },
  security: { mfaRequired: false, sessionMinutes: 60 },
  billing: { currency: "INR", taxIncluded: true },
  email: { fromName: "ITL AI", fromEmail: "no-reply@itl.ai" },
  ai: { defaultModel: "gpt-4o-mini", temperature: 0.3, maxTokens: 2048 },
  legal: { companyName: "ITL AI Technologies Pvt Ltd", address: "Mumbai, India" },
  integrations: { slack: false, ms365: false, drive: false },
};

export const globalSettingsService = {
  get: () => mockResponse(defaults),
  update: (patch: Partial<GlobalSettings>) => mockResponse({ ok: true, patch }),
};
