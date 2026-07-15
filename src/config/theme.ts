/**
 * Runtime theme configuration.
 * All values map to CSS custom properties in src/styles.css and can be
 * overridden by the admin at runtime (see store/themeStore.ts).
 */
export interface ThemeConfig {
  mode: "light" | "dark" | "system";
  primary: string;
  primaryHover: string;
  accent: string;
  background: string;
  surface: string;
  sidebar: string;
  fontSans: string;
  fontDisplay: string;
  radius: string;
  compact: boolean;
  sidebarStyle: "expanded" | "compact" | "floating";
  animationSpeed: "slow" | "normal" | "fast";
  logo: string;
  favicon: string;
}

export const defaultTheme: ThemeConfig = {
  mode: "light",
  primary: "#7A1025",
  primaryHover: "#64101E",
  accent: "#FF5C7A",
  background: "#FFF8F3",
  surface: "#FFFDFB",
  sidebar: "#FCF7F5",
  fontSans: "Plus Jakarta Sans",
  fontDisplay: "Plus Jakarta Sans",
  radius: "0.875rem",
  compact: false,
  sidebarStyle: "expanded",
  animationSpeed: "normal",
  logo: "/favicon.ico",
  favicon: "/favicon.ico",
};
