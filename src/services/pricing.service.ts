/* eslint-disable prettier/prettier */
import { cmsService } from "./cms.service";

export const pricingService = {
  async getPlans() {
    const data = await cmsService.getPage("pricing");

    return {
      plans: data.pricingPlans,
      comparison: data.pricingComparison,
      enterprise: data.enterpriseData,
      faqs: data.pricingFaqs,
    };
  },
};