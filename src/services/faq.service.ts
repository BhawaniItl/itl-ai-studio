/* eslint-disable prettier/prettier */
import { cmsService } from "./cms.service";

export const faqService = {
  async getFaqs() {
    const data = await cmsService.getPage("faq");

    return data.faqData;
  },
};