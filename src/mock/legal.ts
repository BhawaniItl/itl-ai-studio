import type { LegalDoc } from "@/types";

const boilerplate = (title: string): LegalDoc["sections"] => [
  { heading: "Overview", body: `This ${title} governs your use of ITL AI ("we", "us"). By accessing the platform you agree to be bound by these terms. Replace this placeholder copy with your final legal text before launch.` },
  { heading: "Scope", body: "These terms apply to all users of the ITL AI web application, mobile applications, APIs and any related services provided by ITL AI Technologies Pvt. Ltd." },
  { heading: "Your account", body: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account." },
  { heading: "Acceptable use", body: "You agree to use the service in compliance with applicable law and not to misuse, disrupt or attempt to reverse engineer any part of the platform." },
  { heading: "Data & privacy", body: "We process personal and matter data in accordance with our Privacy Policy. Client data is never used to train models outside your workspace." },
  { heading: "Intellectual property", body: "All software, models, brand and content, other than user-generated content, are the intellectual property of ITL AI Technologies Pvt. Ltd." },
  { heading: "Limitations", body: "ITL AI is a research assistant. Responses must be independently verified by a qualified professional before being relied upon in any advisory or contentious matter." },
  { heading: "Termination", body: "We may suspend or terminate access for material breach of these terms. You may cancel your subscription at any time from the billing settings." },
  { heading: "Governing law", body: "These terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of the courts at Mumbai." },
  { heading: "Contact", body: "For questions about this document, contact us at hello@itl.ai." },
];

export const legalDocs: Record<string, LegalDoc> = {
  privacy: { slug: "privacy", title: "Privacy Policy", updatedAt: "2026-06-01", readingTime: "6 min read", sections: boilerplate("Privacy Policy") },
  terms: { slug: "terms", title: "Terms of Service", updatedAt: "2026-06-01", readingTime: "8 min read", sections: boilerplate("Terms of Service") },
  disclaimer: { slug: "disclaimer", title: "Disclaimer", updatedAt: "2026-06-01", readingTime: "3 min read", sections: boilerplate("Disclaimer") },
  refund: { slug: "refund", title: "Refund Policy", updatedAt: "2026-06-01", readingTime: "3 min read", sections: boilerplate("Refund Policy") },
  "intellectual-property": { slug: "intellectual-property", title: "Intellectual Property Policy", updatedAt: "2026-06-01", readingTime: "5 min read", sections: boilerplate("IP Policy") },
  cancellation: { slug: "cancellation", title: "Cancellation Policy", updatedAt: "2026-06-01", readingTime: "3 min read", sections: boilerplate("Cancellation Policy") },
};
