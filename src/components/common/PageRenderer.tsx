import { motion } from "framer-motion";
import { getComponent } from "@/registry/components";
import { useFeatureFlagStore } from "@/store/featureFlagStore";
import { usePermissionStore } from "@/store/permissionStore";
import type { PageConfig, SectionConfig } from "@/types/cms";

interface Props {
  page: PageConfig;
}

export function PageRenderer({ page }: Props) {
  const isFlag = useFeatureFlagStore((s) => s.isEnabled);
  const can = usePermissionStore((s) => s.can);

  const sections = [...page.sections]
    .filter((s) => s.visible !== false)
    .filter((s) => !s.featureFlag || isFlag(s.featureFlag))
    .filter((s) => !s.permission || can(s.permission))
    .sort((a, b) => a.order - b.order);

  return (
    <>
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </>
  );
}

export function SectionRenderer({ section }: { section: SectionConfig }) {
  const Comp = getComponent(section.component);
  if (!Comp) return null;

  if (section.animate) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Comp section={section} />
      </motion.section>
    );
  }
  return <section>{Comp({ section })}</section>;
}
