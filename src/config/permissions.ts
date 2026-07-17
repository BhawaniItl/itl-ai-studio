import type { Role } from "@/types/cms";

export const roles: Role[] = [
  {
    id: "super_admin",
    label: "Super Admin",
    description: "Unrestricted access to every module and setting.",
    permissions: ["*"],
  },
  {
    id: "admin",
    label: "Admin",
    description: "Full access except billing owner actions.",
    permissions: [
      "cms.*",
      "users.*",
      "roles.read",
      "features.*",
      "navigation.*",
      "workspace.*",
      "settings.*",
      "audit.read",
    ],
  },
  {
    id: "manager",
    label: "Manager",
    description: "Team-level admin for content and workspace.",
    permissions: ["cms.read", "cms.write", "users.read", "workspace.*"],
  },
  {
    id: "editor",
    label: "Editor",
    description: "Edit CMS content and knowledge base.",
    permissions: ["cms.read", "cms.write", "media.*"],
  },
  {
    id: "support",
    label: "Support",
    description: "Read-only access with impersonation for tickets.",
    permissions: ["users.read", "chats.read", "notifications.read"],
  },
  {
    id: "finance",
    label: "Finance",
    description: "Billing, subscriptions, invoices.",
    permissions: ["billing.*", "subscriptions.*", "users.read"],
  },
  {
    id: "sales",
    label: "Sales",
    description: "Leads, quotes and enterprise deals.",
    permissions: ["leads.*", "users.read", "cms.read"],
  },
  {
    id: "viewer",
    label: "Viewer",
    description: "Read-only dashboard access.",
    permissions: ["*.read"],
  },
  {
    id: "customer",
    label: "Customer",
    description: "End user of the ITL AI workspace.",
    permissions: ["workspace.self", "profile.self", "billing.self"],
  },
];
