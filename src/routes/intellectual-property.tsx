import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/features/legal/LegalPage";
export const Route = createFileRoute("/intellectual-property")({ component: () => <LegalPage slug="intellectual-property" />, head: () => ({ meta: [{ title: "IP Policy — ITL AI" }] }) });
