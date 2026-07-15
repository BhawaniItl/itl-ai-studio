import { mockResponse } from "./api/api";
import { contactInfo, contactReasons } from "@/mock/contact";
export const contactService = {
  getInfo: () => mockResponse({ info: contactInfo, reasons: contactReasons }),
  submit: (payload: Record<string, unknown>) => mockResponse({ ok: true, payload }, 600),
};
