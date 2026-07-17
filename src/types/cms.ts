/**
 * Dynamic CMS + page-config types.
 * These describe pages/sections/components that the Admin can later drive
 * remotely — keeping the frontend fully "config-driven".
 */

export type ComponentId =
  | "Hero"
  | "CTA"
  | "Pricing"
  | "Timeline"
  | "FAQ"
  | "Testimonials"
  | "Stats"
  | "Comparison"
  | "FeatureGrid"
  | "Cards"
  | "Markdown"
  | "TableBlock"
  | "ImageBanner"
  | "VideoBanner"
  | "WorkspacePreview"
  | "InteractiveDemo"
  | "Carousel"
  | "RichText"
  | "Spacer";

export interface SectionConfig {
  id: string;
  component: ComponentId;
  visible: boolean;
  order: number;
  animate?: boolean;
  permission?: string;
  featureFlag?: string;
  props?: Record<string, unknown>;
}

export interface PageConfig {
  slug: string;
  title: string;
  description?: string;
  updatedAt: string;
  sections: SectionConfig[];
  meta?: Record<string, unknown>;
}

export interface CmsBlock {
  id: string;
  type: "text" | "html" | "markdown" | "image" | "list";
  title?: string;
  body?: string;
  items?: string[];
  imageUrl?: string;
}

export interface NavigationNode {
  id: string;
  label: string;
  to?: string;
  icon?: string;
  badge?: string;
  external?: boolean;
  visible?: boolean;
  permission?: string;
  featureFlag?: string;
  children?: NavigationNode[];
}

export interface NavigationConfig {
  header: NavigationNode[];
  footer: Record<string, NavigationNode[]>;
  workspace: NavigationNode[];
  admin: { section: string; items: NavigationNode[] }[];
}

export interface FeatureFlag {
  key: string;
  label: string;
  description?: string;
  enabled: boolean;
  rollout?: number;
}

export type RoleId =
  | "super_admin"
  | "admin"
  | "manager"
  | "editor"
  | "support"
  | "finance"
  | "sales"
  | "viewer"
  | "customer";

export interface Role {
  id: RoleId;
  label: string;
  description: string;
  permissions: string[];
}

export interface AppNotification {
  id: string;
  title: string;
  body?: string;
  kind: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
  href?: string;
  persistent?: boolean;
}

export interface FormFieldSchema {
  name: string;
  label: string;
  kind:
    | "text"
    | "textarea"
    | "number"
    | "email"
    | "password"
    | "select"
    | "autocomplete"
    | "date"
    | "checkbox"
    | "radio"
    | "toggle"
    | "file"
    | "richtext"
    | "phone"
    | "pincode";
  required?: boolean;
  placeholder?: string;
  helper?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  pattern?: string;
  defaultValue?: unknown;
  grid?: 1 | 2 | 3 | 4;
}

export interface FormSchema {
  id: string;
  title: string;
  fields: FormFieldSchema[];
  submitLabel?: string;
}

export interface DashboardWidget {
  id: string;
  title: string;
  component: string;
  size: "sm" | "md" | "lg" | "xl";
  x?: number;
  y?: number;
  visible: boolean;
  permission?: string;
  refreshInterval?: number;
  props?: Record<string, unknown>;
}

export interface SearchResult {
  id: string;
  kind: "page" | "chat" | "user" | "document" | "case" | "command" | "setting";
  title: string;
  subtitle?: string;
  href?: string;
  icon?: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  progress: number;
  status: "queued" | "uploading" | "done" | "error";
  error?: string;
}
