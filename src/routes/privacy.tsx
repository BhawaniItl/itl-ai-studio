/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/features/legal/LegalPage";
export const Route = createFileRoute("/privacy")({ component: () => <LegalPage slug="privacy" />, head: () => ({ meta: [{ title: "Privacy Policy — ITL AI" }] }) });
