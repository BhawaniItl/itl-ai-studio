export interface NavItem {
  label: string;
  to: string;
  external?: boolean;
}

export const publicNav: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Workspace", to: "/workspace" },
  { label: "Pricing", to: "/pricing" },
  { label: "About", to: "/about" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

export const footerNav = {
  Product: [
    { label: "Workspace", to: "/workspace" },
    { label: "Pricing", to: "/pricing" },
    { label: "Admin Demo", to: "/admin" },
  ],
  Company: [
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "FAQ", to: "/faq" },
  ],
  Legal: [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms", to: "/terms" },
    { label: "Disclaimer", to: "/disclaimer" },
    { label: "Refund Policy", to: "/refund" },
    { label: "Cancellation Policy", to: "/cancellation" },
    { label: "Intellectual Property", to: "/intellectual-property" },
  ],
};
