import type { SearchResult } from "@/types/cms";

export const seedSearchIndex: SearchResult[] = [
  { id: "p-home", kind: "page", title: "Home", href: "/", icon: "Home" },
  { id: "p-pricing", kind: "page", title: "Pricing", href: "/pricing", icon: "Wallet" },
  { id: "p-about", kind: "page", title: "About", href: "/about", icon: "Info" },
  { id: "p-faq", kind: "page", title: "FAQ", href: "/faq", icon: "HelpCircle" },
  { id: "p-contact", kind: "page", title: "Contact", href: "/contact", icon: "Mail" },
  { id: "p-workspace", kind: "page", title: "Workspace", href: "/workspace", icon: "MessageSquare" },
  { id: "p-admin", kind: "page", title: "Admin", href: "/admin", icon: "Shield" },
  { id: "p-settings", kind: "setting", title: "Settings", href: "/settings", icon: "Settings" },
  { id: "p-profile", kind: "setting", title: "Profile", href: "/profile", icon: "User" },
  { id: "cmd-new-chat", kind: "command", title: "Start a new chat", href: "/workspace", icon: "Plus" },
  { id: "cmd-toggle-theme", kind: "command", title: "Toggle theme", icon: "Sun" },
];
