import { mockResponse } from "./api/api";
import { heroData, features, testimonials, workflow } from "@/mock/home";

export const homeService = {
  async getHome() {
    return mockResponse({ hero: heroData, features, testimonials, workflow });
  },
};
