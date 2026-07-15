import type { LegalDoc } from "@/types";

const boilerplate = (title: string): LegalDoc["sections"] => [
  { heading: "Overview", body: `This ${title} governs your use of ITL AI ("we", "us"). By accessing the platform you agree to be bound by these terms. This is a placeholder document — replace with your final legal copy before launch.` },
  { heading: "Scope", body: "The terms apply to all users of the ITL AI web application, mobile applications, and any related services." },
  { heading: "Your obligations", body: "You agree to use the service in compliance with applicable law and not to misuse or attempt to reverse engineer any part of the platform." },
  { heading: "Limitations", body: "ITL AI is a research assistant. Responses must be independently verified by a qualified professional before being relied upon in any advisory or contentious matter." },
  { heading: "Contact", body: "For questions about this document, contact us at hello@itl.ai." },
];

export const legalDocs: Record<string, LegalDoc> = {
  privacy: { slug: "privacy", title: "Privacy Policy", updatedAt: "2026-06-01", sections: boilerplate("Privacy Policy") },
  terms: { slug: "terms", title: "Terms of Service", updatedAt: "2026-06-01", sections: boilerplate("Terms of Service") },
  disclaimer: { slug: "disclaimer", title: "Disclaimer", updatedAt: "2026-06-01", sections: boilerplate("Disclaimer") },
  refund: { slug: "refund", title: "Refund Policy", updatedAt: "2026-06-01", sections: boilerplate("Refund Policy") },
  "intellectual-property": { slug: "intellectual-property", title: "Intellectual Property Policy", updatedAt: "2026-06-01", sections: boilerplate("IP Policy") },
  cancellation: { slug: "cancellation", title: "Cancellation Policy", updatedAt: "2026-06-01", sections: boilerplate("Cancellation Policy") },
};
