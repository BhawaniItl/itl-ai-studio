import type { ComponentId, SectionConfig } from "@/types/cms";
import type { ReactNode } from "react";

export type SectionRenderer = (props: {
  section: SectionConfig;
}) => ReactNode;

const registry = new Map<ComponentId, SectionRenderer>();

export function registerComponent(id: ComponentId, renderer: SectionRenderer) {
  registry.set(id, renderer);
}

export function getComponent(id: ComponentId): SectionRenderer | undefined {
  return registry.get(id);
}

export function listRegisteredComponents(): ComponentId[] {
  return Array.from(registry.keys());
}

/**
 * Register a default placeholder renderer for a component ID.
 * Real implementations can be registered later or on-demand.
 */
export function registerPlaceholder(id: ComponentId) {
  if (!registry.has(id)) {
    registry.set(id, ({ section }) => (
      <div className="rounded-xl border border-dashed border-border/60 bg-secondary/20 p-8 text-center text-sm text-muted-foreground">
        <p className="font-medium text-foreground">{id}</p>
        <p className="mt-1 text-xs">Section “{section.id}” — component registered as placeholder.</p>
      </div>
    ));
  }
}

const defaults: ComponentId[] = [
  "Hero",
  "CTA",
  "Pricing",
  "Timeline",
  "FAQ",
  "Testimonials",
  "Stats",
  "Comparison",
  "FeatureGrid",
  "Cards",
  "Markdown",
  "TableBlock",
  "ImageBanner",
  "VideoBanner",
  "WorkspacePreview",
  "InteractiveDemo",
  "Carousel",
  "RichText",
  "Spacer",
];

defaults.forEach(registerPlaceholder);
