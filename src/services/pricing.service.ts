import { mockResponse } from "./api/api";
import { pricingPlans, pricingComparison, enterpriseData, pricingFaqs } from "@/mock/pricing";
export const pricingService = {
  getPlans: () =>
    mockResponse({
      plans: pricingPlans,
      comparison: pricingComparison,
      enterprise: enterpriseData,
      faqs: pricingFaqs,
    }),
};
