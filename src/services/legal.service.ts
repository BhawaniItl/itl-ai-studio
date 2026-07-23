/* eslint-disable prettier/prettier */
import { cmsService } from "./cms.service";

export const legalService = {
  getDoc: (slug: string) => cmsService.getPage(slug),
};