import { createFileRoute } from "@tanstack/react-router";
import { AdminStub } from "@/features/admin/AdminStub";
export const Route = createFileRoute("/admin/knowledge")({
  component: () => <AdminStub title="Knowledge Base" description="Curate the corpus of Acts, rules, circulars and case law." />,
  head: () => ({ meta: [{ title: "Knowledge Base — Admin" }] }),
});
