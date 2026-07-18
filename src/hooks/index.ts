import { useQuery } from "@tanstack/react-query";
import { homeService } from "@/services/home.service";
import { aboutService } from "@/services/about.service";
import { pricingService } from "@/services/pricing.service";
import { faqService } from "@/services/faq.service";
import { contactService } from "@/services/contact.service";
import { workspaceService, chatService } from "@/services/workspace.service";
import { adminService, analyticsService, userService } from "@/services/admin.service";
import { legalService } from "@/services/legal.service";
import { cmsService, navigationService } from "@/services/cms.service";
import { featureService } from "@/services/features.service";
import { permissionService } from "@/services/permissions.service";
import { notificationService } from "@/services/notifications.service";
import { searchService } from "@/services/search.service";
import { globalSettingsService } from "@/services/settings.service";
import { widgetService } from "@/services/widgets.service";
import { formService } from "@/services/forms.service";

/* Existing (preserved) */
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

const ADMIN_STALE = 5 * 60_000;
export const useAdminMetrics = () => useQuery({ queryKey: ["admin", "metrics"], queryFn: () => adminService.getMetrics(), staleTime: ADMIN_STALE });
export const useAdminUsers = () => useQuery({ queryKey: ["admin", "users"], queryFn: () => adminService.getUsers(), staleTime: ADMIN_STALE });
export const useAdminNav = () => useQuery({ queryKey: ["admin", "nav"], queryFn: () => adminService.getNav(), staleTime: Infinity });
export const useAnalytics = () => useQuery({ queryKey: ["analytics"], queryFn: () => analyticsService.getOverview(), staleTime: ADMIN_STALE });
export const useMe = () => useQuery({ queryKey: ["me"], queryFn: () => userService.me(), staleTime: ADMIN_STALE });

export const useLegal = (slug: string) =>
  useQuery({ queryKey: ["legal", slug], queryFn: () => legalService.getDoc(slug) });

/* Phase 1.5 additions */
export const useCmsPage = (slug: string) =>
  useQuery({ queryKey: ["cms", "page", slug], queryFn: () => cmsService.getPage(slug) });
export const useCmsPages = () =>
  useQuery({ queryKey: ["cms", "pages"], queryFn: () => cmsService.listPages() });
export const useNavigation = () =>
  useQuery({ queryKey: ["navigation"], queryFn: () => navigationService.getNavigation() });

export const useFeatureFlags = () =>
  useQuery({ queryKey: ["features"], queryFn: () => featureService.list() });
export const useRoles = () =>
  useQuery({ queryKey: ["roles"], queryFn: () => permissionService.listRoles() });

export const useNotifications = () =>
  useQuery({ queryKey: ["notifications"], queryFn: () => notificationService.list() });

export const useSearchIndex = () =>
  useQuery({ queryKey: ["search", "index"], queryFn: () => searchService.index() });

export const useGlobalSettings = () =>
  useQuery({ queryKey: ["settings", "global"], queryFn: () => globalSettingsService.get() });

export const useDashboardWidgets = () =>
  useQuery({ queryKey: ["dashboard", "widgets"], queryFn: () => widgetService.list() });

export const useForms = () =>
  useQuery({ queryKey: ["forms"], queryFn: () => formService.list() });

/* Convenience hooks */
export { useFeatureFlagStore } from "@/store/featureFlagStore";
export { usePermissionStore } from "@/store/permissionStore";
export { useNotificationStore } from "@/store/notificationStore";
export { useModalStore, modal } from "@/store/modalStore";
export { useCommandStore } from "@/store/commandStore";

import { useFeatureFlagStore } from "@/store/featureFlagStore";
import { usePermissionStore } from "@/store/permissionStore";

export const useFeatureFlag = (key: string) =>
  useFeatureFlagStore((s) => s.isEnabled(key));

export const usePermission = (permission: string) =>
  usePermissionStore((s) => s.can(permission));
