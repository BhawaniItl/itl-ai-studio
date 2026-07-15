import { mockResponse } from "./api/api";
import { aboutData } from "@/mock/about";
export const aboutService = { getAbout: () => mockResponse(aboutData) };
