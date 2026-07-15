import { useEffect, type ReactNode } from "react";
import { useThemeStore } from "@/store/themeStore";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const mode = useThemeStore((s) => s.theme.mode);
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const resolved =
      mode === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : mode;
    root.classList.toggle("dark", resolved === "dark");
  }, [mode]);
  return <>{children}</>;
}
