import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/features/legal/LegalPage";
export const Route = createFileRoute("/refund")({ component: () => <LegalPage slug="refund" />, head: () => ({ meta: [{ title: "Refund Policy — ITL AI" }] }) });
