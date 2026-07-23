/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceShell } from "@/features/workspace/WorkspaceShell";

export const Route = createFileRoute("/workspace")({
  component: WorkspaceShell,
  head: () => ({ meta: [{ title: "Workspace — ITL AI" }, { name: "description", content: "Your AI workspace for Income Tax and GST research." }] }),
});
