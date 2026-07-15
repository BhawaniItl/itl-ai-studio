import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/features/legal/LegalPage";
export const Route = createFileRoute("/terms")({ component: () => <LegalPage slug="terms" />, head: () => ({ meta: [{ title: "Terms — ITL AI" }] }) });
