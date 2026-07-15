import { mockResponse } from "./api/api";
import { faqData } from "@/mock/faq";
export const faqService = { getFaqs: () => mockResponse(faqData) };
