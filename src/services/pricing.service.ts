import { mockResponse } from "./api/api";
import { pricingPlans } from "@/mock/pricing";
export const pricingService = { getPlans: () => mockResponse(pricingPlans) };
