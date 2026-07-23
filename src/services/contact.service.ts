/* eslint-disable prettier/prettier */
import { cmsService } from "./cms.service";

export const contactService = {
  async getInfo() {
    const data = await cmsService.getPage("contact");

    return {
      info: data.contactInfo,
      reasons: data.contactReasons,
    };
  },
};