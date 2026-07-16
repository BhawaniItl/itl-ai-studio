import { mockResponse } from "./api/api";
import {
  heroData,
  features,
  testimonials,
  workflow,
  logos,
  trustSources,
  painPoints,
  solutionSteps,
  showcases,
  comparison,
  noticeReplyFlow,
} from "@/mock/home";

export const homeService = {
  async getHome() {
    return mockResponse({
      hero: heroData,
      features,
      testimonials,
      workflow,
      logos,
      trustSources,
      painPoints,
      solutionSteps,
      showcases,
      comparison,
      noticeReplyFlow,
    });
  },
};
