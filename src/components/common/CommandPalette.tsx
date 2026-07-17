import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useCommandStore } from "@/store/commandStore";
import { useSearchIndex } from "@/hooks";
import { useThemeStore } from "@/store/themeStore";
import { Icon } from "./Icon";

/**
 * Global Ctrl/Cmd+K palette.
 * Search pages, chats, users, settings, commands via search service.
 */
export function CommandPalette() {
  const open = useCommandStore((s) => s.open);
  const setOpen = useCommandStore((s) => s.setOpen);
  const pushRecent = useCommandStore((s) => s.pushRecent);
  const recent = useCommandStore((s) => s.recent);
  const { data } = useSearchIndex();
  const navigate = useNavigate();
  const themeMode = useThemeStore((s) => s.theme.mode);
  const setThemeMode = useThemeStore((s) => s.setMode);
  const toggleTheme = () => setThemeMode(themeMode === "dark" ? "light" : "dark");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  function run(href: string | undefined, title: string) {
    pushRecent(title);
    setOpen(false);
    if (href) navigate({ to: href });
  }

  const groups = new Map<string, typeof data>();
  (data ?? []).forEach((r) => {
    if (!groups.has(r.kind)) groups.set(r.kind, [] as any);
    (groups.get(r.kind) as any).push(r);
  });

  const kindLabel: Record<string, string> = {
    page: "Pages",
    chat: "Chats",
    user: "Users",
    document: "Documents",
    case: "Case laws",
    command: "Commands",
    setting: "Settings",
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, chats, commands…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        {recent.length > 0 && (
          <>
            <CommandGroup heading="Recent">
              {recent.map((r) => (
                <CommandItem key={r} value={r}>
                  <Icon name="History" className="h-4 w-4" />
                  {r}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}
        {Array.from(groups.entries()).map(([kind, items]) => (
          <CommandGroup key={kind} heading={kindLabel[kind] ?? kind}>
            {(items ?? []).map((r) => (
              <CommandItem
                key={r.id}
                value={r.title}
                onSelect={() => {
                  if (r.id === "cmd-toggle-theme") {
                    toggleTheme();
                    setOpen(false);
                    return;
                  }
                  run(r.href, r.title);
                }}
              >
                <Icon name={r.icon ?? "ChevronRight"} className="h-4 w-4" />
                {r.title}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
