import { createFileRoute } from "@tanstack/react-router";
import { AdminStub } from "@/features/admin/AdminStub";

export const Route = createFileRoute("/admin/prompt-templates")({
  component: () => (
    <AdminStub
      title="Prompt templates"
      description="Curate reusable AI prompts, few-shot examples and system instructions per workspace tool."
    />
  ),
});
