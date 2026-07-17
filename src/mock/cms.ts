import type { PageConfig, NavigationConfig } from "@/types/cms";

/**
 * Page configuration — the runtime configurable page system.
 * Every marketing page can be described here and rendered by <PageRenderer />.
 * Existing routes continue to work; this data is exposed for future admin UIs.
 */
export const pageConfigs: PageConfig[] = [
  {
    slug: "home",
    title: "ITL AI — Home",
    updatedAt: "2026-07-10T00:00:00.000Z",
    sections: [
      { id: "hero", component: "Hero", visible: true, order: 1, animate: true },
      { id: "stats", component: "Stats", visible: true, order: 2, animate: true },
      { id: "features", component: "FeatureGrid", visible: true, order: 3, animate: true },
      { id: "showcase", component: "InteractiveDemo", visible: true, order: 4, animate: true },
      { id: "comparison", component: "Comparison", visible: true, order: 5, animate: true },
      { id: "testimonials", component: "Testimonials", visible: true, order: 6, animate: true },
      { id: "faq", component: "FAQ", visible: true, order: 7 },
      { id: "cta", component: "CTA", visible: true, order: 8 },
    ],
  },
  {
    slug: "about",
    title: "About ITL AI",
    updatedAt: "2026-07-10T00:00:00.000Z",
    sections: [
      { id: "hero", component: "Hero", visible: true, order: 1 },
      { id: "timeline", component: "Timeline", visible: true, order: 2 },
      { id: "team", component: "Cards", visible: true, order: 3 },
      { id: "cta", component: "CTA", visible: true, order: 4 },
    ],
  },
  {
    slug: "pricing",
    title: "Pricing",
    updatedAt: "2026-07-10T00:00:00.000Z",
    sections: [
      { id: "hero", component: "Hero", visible: true, order: 1 },
      { id: "pricing", component: "Pricing", visible: true, order: 2 },
      { id: "comparison", component: "Comparison", visible: true, order: 3 },
      { id: "faq", component: "FAQ", visible: true, order: 4 },
      { id: "cta", component: "CTA", visible: true, order: 5 },
    ],
  },
];

export const navigationConfig: NavigationConfig = {
  header: [
    { id: "product", label: "Product", to: "/#product", visible: true },
    { id: "workspace", label: "Workspace", to: "/workspace", visible: true },
    { id: "pricing", label: "Pricing", to: "/pricing", visible: true },
    { id: "about", label: "About", to: "/about", visible: true },
    { id: "faq", label: "FAQ", to: "/faq", visible: true },
    { id: "contact", label: "Contact", to: "/contact", visible: true },
  ],
  footer: {
    Product: [
      { id: "workspace", label: "Workspace", to: "/workspace", visible: true },
      { id: "pricing", label: "Pricing", to: "/pricing", visible: true },
    ],
    Resources: [
      { id: "faq", label: "FAQ", to: "/faq", visible: true },
      { id: "about", label: "About", to: "/about", visible: true },
      { id: "contact", label: "Contact", to: "/contact", visible: true },
    ],
    Legal: [
      { id: "privacy", label: "Privacy Policy", to: "/privacy", visible: true },
      { id: "terms", label: "Terms", to: "/terms", visible: true },
      { id: "disclaimer", label: "Disclaimer", to: "/disclaimer", visible: true },
      { id: "refund", label: "Refund Policy", to: "/refund", visible: true },
    ],
  },
  workspace: [
    { id: "chat", label: "Ask AI", to: "/workspace", icon: "MessageSquare", visible: true },
    { id: "research", label: "Case Research", icon: "Scale", visible: true, featureFlag: "case_research" },
    { id: "notice", label: "Notice Reply", icon: "FileWarning", visible: true, featureFlag: "notice_reply" },
    { id: "draft", label: "Draft Assistant", icon: "Pencil", visible: true, featureFlag: "draft_assistant" },
    { id: "summarize", label: "Summarize", icon: "AlignLeft", visible: true, featureFlag: "summarizer" },
  ],
  admin: [
    {
      section: "Overview",
      items: [
        { id: "dashboard", label: "Dashboard", to: "/admin", icon: "LayoutDashboard", visible: true },
        { id: "analytics", label: "Analytics", to: "/admin/analytics", icon: "BarChart3", visible: true },
      ],
    },
    {
      section: "Management",
      items: [
        { id: "users", label: "Users", to: "/admin/users", icon: "Users", visible: true },
        { id: "roles", label: "Roles & Permissions", to: "/admin/roles", icon: "ShieldCheck", visible: true },
        { id: "subscriptions", label: "Subscriptions", to: "/admin/subscriptions", icon: "CreditCard", visible: true },
      ],
    },
    {
      section: "Content",
      items: [
        { id: "cms", label: "CMS", to: "/admin/cms", icon: "FileText", visible: true },
        { id: "pages", label: "Page Builder", to: "/admin/pages", icon: "LayoutTemplate", visible: true },
        { id: "media", label: "Media Library", to: "/admin/media", icon: "Image", visible: true },
        { id: "knowledge", label: "Knowledge Base", to: "/admin/knowledge", icon: "BookOpen", visible: true },
        { id: "docTemplates", label: "Document Templates", to: "/admin/doc-templates", icon: "FileCode", visible: true },
        { id: "emailTemplates", label: "Email Templates", to: "/admin/email-templates", icon: "Mail", visible: true },
        { id: "promptTemplates", label: "Prompt Templates", to: "/admin/prompt-templates", icon: "Sparkles", visible: true },
      ],
    },
    {
      section: "Platform",
      items: [
        { id: "navigation", label: "Navigation Builder", to: "/admin/navigation", icon: "Menu", visible: true },
        { id: "features", label: "Feature Flags", to: "/admin/features", icon: "Flag", visible: true },
        { id: "workspaceSettings", label: "Workspace Settings", to: "/admin/workspace-settings", icon: "Boxes", visible: true },
        { id: "notifications", label: "Notifications", to: "/admin/notifications", icon: "Bell", visible: true },
        { id: "ai", label: "AI Settings", to: "/admin/ai", icon: "Sparkles", visible: true },
        { id: "seo", label: "SEO", to: "/admin/seo", icon: "Search", visible: true },
        { id: "theme", label: "Theme", to: "/admin/theme", icon: "Palette", visible: true },
        { id: "system", label: "System", to: "/admin/system", icon: "Settings", visible: true },
        { id: "audit", label: "Audit Logs", to: "/admin/audit", icon: "ScrollText", visible: true },
      ],
    },
  ],
};
