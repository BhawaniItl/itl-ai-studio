export interface HeroData {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  primaryCta: { label: string; to: string };
  secondaryCta: { label: string; to: string };
  stats: { label: string; value: string }[];
  logos: string[];
  typewriter?: string[];
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  role: string;
  firm: string;
  quote: string;
  avatar?: string;
}

export interface FAQItem {
  q: string;
  a: string;
  category?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  yearlyPrice?: number;
  period: "monthly" | "yearly";
  currency: string;
  description: string;
  featured?: boolean;
  cta: string;
  features: string[];
  badge?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  hours: string;
}

export interface WorkspaceModule {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  tools: WorkspaceTool[];
}

export interface WorkspaceTool {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
  citations?: Citation[];
  attachments?: Attachment[];
}

export interface ChatFolder {
  id: string;
  name: string;
  count: number;
}

export interface Citation {
  id: string;
  title: string;
  type: "act" | "case" | "circular" | "notification";
  ref: string;
  snippet?: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface ChatThread {
  id: string;
  title: string;
  moduleId: string;
  toolId: string;
  updatedAt: string;
  pinned?: boolean;
  favorite?: boolean;
  folder?: string;
  tags?: string[];
  relatedQuestions?: string[];
  messages: ChatMessage[];
}

export interface PromptSuggestion {
  id: string;
  title: string;
  prompt: string;
  moduleId: string;
}

export interface AdminMetric {
  key: string;
  label: string;
  value: string;
  delta: number;
  trend: number[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "user";
  plan: "free" | "pro" | "enterprise";
  status: "active" | "invited" | "suspended";
  joinedAt: string;
}

export interface LegalDoc {
  slug: string;
  title: string;
  updatedAt: string;
  readingTime?: string;
  sections: { heading: string; body: string }[];
}

/* Public marketing extensions */

export interface PainPoint {
  icon: string;
  title: string;
  body: string;
}

export interface ProductShowcase {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  icon: string;
  cta: { label: string; to: string };
  demo: "chat" | "research" | "notice" | "draft" | "summarize";
}

export interface ComparisonRow {
  capability: string;
  manual: string | boolean;
  google: string | boolean;
  chatgpt: string | boolean;
  itl: string | boolean;
}

export interface TrustSource {
  icon: string;
  name: string;
  count: string;
}

export interface LogoItem {
  name: string;
  kind?: "firm" | "government" | "source";
}
