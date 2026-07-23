/* eslint-disable prettier/prettier */
import { Link } from "@tanstack/react-router";
import {
  Plus,
  Search,
  Pin,
  Star,
  MoreHorizontal,
  Folder,
  Settings,
  LogOut,
  ChevronsLeft,
} from "lucide-react";
import { useState } from "react";
import dayjs from "dayjs";
import { Logo } from "@/components/common/Logo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useChatFolders, useWorkspaceModules } from "@/hooks";
import { useWorkspaceStore, useSidebarStore, useChatStore } from "@/store";

export function WorkspaceSidebar() {
  const [query, setQuery] = useState("");
  const threads = useChatStore((s) => s.threads);
  const { data: folders } = useChatFolders();
  const { data: modules } = useWorkspaceModules();
  const activeModuleId = useWorkspaceStore((s) => s.activeModuleId);
  const setModule = useWorkspaceStore((s) => s.setModule);
  const activeThreadId = useWorkspaceStore((s) => s.activeThreadId);
  const setThread = useWorkspaceStore((s) => s.setThread);
  const toggleLeft = useSidebarStore((s) => s.toggleLeft);

  const filtered = (threads ?? []).filter(
    (t) =>
      t.moduleId === activeModuleId &&
      (query ? t.title.toLowerCase().includes(query.toLowerCase()) : true),
  );

  const pinned = filtered.filter((t) => t.pinned);
  const recent = filtered.filter((t) => !t.pinned);

  return (
    <aside className="flex h-full flex-col border-r border-border/60 bg-sidebar/70">
      <div className="flex items-center justify-between px-4 pt-4">
        <Link to="/">
          <Logo />
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleLeft} className="h-8 w-8">
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Module switcher */}
      <div className="mx-3 mt-4 grid grid-cols-2 gap-1 rounded-xl border border-border/60 bg-card/60 p-1">
        {(modules ?? []).map((m) => (
          <button
            key={m.id}
            onClick={() => setModule(m.id)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors",
              activeModuleId === m.id
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon name={m.icon} className="h-3.5 w-3.5" />
            {m.name}
          </button>
        ))}
      </div>

      <div className="p-3">
        <Button className="w-full gap-2 gradient-primary text-primary-foreground shadow-soft">
          <Plus className="h-4 w-4" /> New chat
        </Button>
      </div>

      <div className="px-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats…"
            className="h-9 pl-8 text-sm"
          />
        </div>
      </div>

      <nav className="scrollbar-thin mt-3 flex-1 space-y-4 overflow-y-auto px-2 pb-2">
        {pinned.length > 0 && (
          <ThreadGroup title="Pinned" items={pinned} activeId={activeThreadId} onSelect={setThread} />
        )}
        {folders && folders.length > 0 && (
          <div>
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Folders
            </p>
            <ul>
              {folders.map((f) => (
                <li key={f.id}>
                  <button className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">
                    <span className="flex items-center gap-2">
                      <Folder className="h-3.5 w-3.5" />
                      {f.name}
                    </span>
                    <span className="text-[10px]">{f.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <ThreadGroup title="Recent" items={recent} activeId={activeThreadId} onSelect={setThread} />
      </nav>

      <div className="border-t border-border/60 p-3">
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 p-2">
          <div className="grid h-8 w-8 place-items-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
            DU
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">CA Demo User</p>
            <p className="truncate text-[11px] text-muted-foreground">Professional · Pro plan</p>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Settings className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </aside>
  );
}

function ThreadGroup({
  title,
  items,
  activeId,
  onSelect,
}: {
  title: string;
  items: { id: string; title: string; updatedAt: string; pinned?: boolean; favorite?: boolean }[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      <ul className="space-y-0.5">
        {items.map((t) => (
          <li key={t.id}>
            <button
              onClick={() => onSelect(t.id)}
              className={cn(
                "group flex w-full items-center justify-between gap-1 rounded-lg px-2 py-2 text-left transition-colors",
                activeId === t.id
                  ? "bg-primary/8 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium">{t.title}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {dayjs(t.updatedAt).format("MMM D, HH:mm")}
                </p>
              </div>
              <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                {t.pinned && <Pin className="h-3 w-3" />}
                {t.favorite && <Star className="h-3 w-3" />}
                <MoreHorizontal className="h-3.5 w-3.5" />
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
