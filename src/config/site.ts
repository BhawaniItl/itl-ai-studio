import logoAsset from "@/assets/itl-logo.png.asset.json";

export const siteConfig = {
  name: "ITL AI",
  fullName: "Income Tax Library AI",
  tagline: "The AI copilot for Indian tax professionals",
  description:
    "ITL AI is the enterprise AI workspace for Chartered Accountants, Advocates and tax professionals — research Income Tax and GST law, draft notices, summarize case law, and reply in minutes.",
  url: "https://itl.ai",
  logo: logoAsset.url,
  email: "hello@itl.ai",
  phone: "+91 90000 00000",
  social: {
    twitter: "https://twitter.com/itlai",
    linkedin: "https://linkedin.com/company/itlai",
    youtube: "https://youtube.com/@itlai",
  },
};

export type SiteConfig = typeof siteConfig;
