import { useQuery } from "@tanstack/react-query";
import { homeService } from "@/services/home.service";
import { aboutService } from "@/services/about.service";
import { pricingService } from "@/services/pricing.service";
import { faqService } from "@/services/faq.service";
import { contactService } from "@/services/contact.service";
import { workspaceService, chatService } from "@/services/workspace.service";
import { adminService, analyticsService, userService } from "@/services/admin.service";
import { legalService } from "@/services/legal.service";

export const useHome = () => useQuery({ queryKey: ["home"], queryFn: () => homeService.getHome() });
export const useAbout = () => useQuery({ queryKey: ["about"], queryFn: () => aboutService.getAbout() });
export const usePricing = () => useQuery({ queryKey: ["pricing"], queryFn: () => pricingService.getPlans() });
export const useFAQ = () => useQuery({ queryKey: ["faq"], queryFn: () => faqService.getFaqs() });
export const useContact = () => useQuery({ queryKey: ["contact"], queryFn: () => contactService.getInfo() });

export const useWorkspaceModules = () =>
  useQuery({ queryKey: ["workspace", "modules"], queryFn: () => workspaceService.getModules() });
export const usePromptSuggestions = (moduleId?: string) =>
  useQuery({ queryKey: ["workspace", "suggestions", moduleId], queryFn: () => workspaceService.getSuggestions(moduleId) });
export const useChatThreads = () =>
  useQuery({ queryKey: ["chat", "threads"], queryFn: () => chatService.listThreads() });
export const useChatFolders = () =>
  useQuery({ queryKey: ["chat", "folders"], queryFn: () => workspaceService.getFolders() });

export const useAdminMetrics = () => useQuery({ queryKey: ["admin", "metrics"], queryFn: () => adminService.getMetrics() });
export const useAdminUsers = () => useQuery({ queryKey: ["admin", "users"], queryFn: () => adminService.getUsers() });
export const useAdminNav = () => useQuery({ queryKey: ["admin", "nav"], queryFn: () => adminService.getNav() });
export const useAnalytics = () => useQuery({ queryKey: ["analytics"], queryFn: () => analyticsService.getOverview() });
export const useMe = () => useQuery({ queryKey: ["me"], queryFn: () => userService.me() });

export const useLegal = (slug: string) =>
  useQuery({ queryKey: ["legal", slug], queryFn: () => legalService.getDoc(slug) });
