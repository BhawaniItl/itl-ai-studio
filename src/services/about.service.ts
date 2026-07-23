/* eslint-disable prettier/prettier */
import { cmsService } from "./cms.service";
export const aboutService = {
  async getAbout() {
    return cmsService.getPage("about");
  },
};