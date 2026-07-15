import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/features/legal/LegalPage";
export const Route = createFileRoute("/cancellation")({ component: () => <LegalPage slug="cancellation" />, head: () => ({ meta: [{ title: "Cancellation Policy — ITL AI" }] }) });
