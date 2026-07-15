export interface HeroData {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  primaryCta: { label: string; to: string };
  secondaryCta: { label: string; to: string };
  stats: { label: string; value: string }[];
  logos: string[];
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
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: "monthly" | "yearly";
  currency: string;
  description: string;
  featured?: boolean;
  cta: string;
  features: string[];
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
  sections: { heading: string; body: string }[];
}
