import { mockResponse } from "./api/api";
import type { FormSchema } from "@/types/cms";

/**
 * Placeholder for dynamic form definitions.
 * Admin can later create form schemas (contact forms, intake forms, etc.).
 */
const forms: FormSchema[] = [
  {
    id: "contact-basic",
    title: "Contact form",
    submitLabel: "Send message",
    fields: [
      { name: "name", label: "Full name", kind: "text", required: true, grid: 2 },
      { name: "email", label: "Email", kind: "email", required: true, grid: 2 },
      { name: "topic", label: "Topic", kind: "select", options: [
        { value: "sales", label: "Sales" },
        { value: "support", label: "Support" },
        { value: "partnership", label: "Partnership" },
      ] },
      { name: "message", label: "Message", kind: "textarea", required: true },
    ],
  },
];

export const formService = {
  list: () => mockResponse(forms),
  get: (id: string) => mockResponse(forms.find((f) => f.id === id) ?? null),
  submit: (id: string, values: Record<string, unknown>) =>
    mockResponse({ ok: true, id, values }),
};
