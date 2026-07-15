import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/features/legal/LegalPage";
export const Route = createFileRoute("/disclaimer")({ component: () => <LegalPage slug="disclaimer" />, head: () => ({ meta: [{ title: "Disclaimer — ITL AI" }] }) });
