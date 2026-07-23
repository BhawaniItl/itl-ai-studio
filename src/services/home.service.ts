/* eslint-disable prettier/prettier */
import { cmsService } from "./cms.service";

export const homeService = {
  async getHome() {
    const data = await cmsService.getPage("home");

    return {
      hero: data.hero,
      features: data.features,
      testimonials: data.testimonials,
      workflow: data.workflow,
      trustSources: data.trustSources,
      painPoints: data.painPoints,
      solutionSteps: data.solutionSteps,
      showcases: data.showcases,
      comparison: data.comparison,
      noticeReplyFlow: data.noticeReplyFlow,
    };
  },
};