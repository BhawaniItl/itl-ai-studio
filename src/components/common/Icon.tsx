/* eslint-disable prettier/prettier */
import { Suspense, lazy, useMemo } from "react";
import type { LucideProps } from "lucide-react";
import {
  AlertTriangle, AlignLeft, BarChart3, Bell, BookOpen, Boxes, Building2, Circle, Clock,
  CreditCard, Download, FileCode, FileText, FileWarning, Flag, Gavel, HelpCircle, Home,
  Image, Info, KeyRound, Landmark, Layers, LayoutDashboard, LayoutTemplate, Mail, Menu,
  MessageSquare, MessagesSquare, Palette, PenLine, Pencil, Plus, Receipt, Scale, ScanLine,
  ScrollText, Search, Send, Settings, Shield, ShieldCheck, Sparkles, Sun, Upload, User,
  Users, Wallet,
} from "lucide-react";

/**
 * PERF: this component used to do `import * as Icons from "lucide-react"`, which
 * pulled the entire icon set (~590KB minified) into whichever bundle imported it
 * — including the landing page. Icon names come from CMS/API data, so we keep the
 * dynamic-by-name API but resolve it against an explicit map of the icons the app
 * actually ships. Anything not in the map (e.g. a new name added in the CMS) falls
 * back to lucide's lazily-loaded DynamicIcon, so it still renders without dragging
 * the full set into the initial payload.
 */
const ICONS: Record<string, React.ComponentType<LucideProps>> = {
  AlertTriangle, AlignLeft, BarChart3, Bell, BookOpen, Boxes, Building2, Circle, Clock,
  CreditCard, Download, FileCode, FileText, FileWarning, Flag, Gavel, HelpCircle, Home,
  Image, Info, KeyRound, Landmark, Layers, LayoutDashboard, LayoutTemplate, Mail, Menu,
  MessageSquare, MessagesSquare, Palette, PenLine, Pencil, Plus, Receipt, Scale, ScanLine,
  ScrollText, Search, Send, Settings, Shield, ShieldCheck, Sparkles, Sun, Upload, User,
  Users, Wallet,
};

const LazyDynamicIcon = lazy(async () => {
  const mod = await import("lucide-react/dynamic");
  return { default: mod.DynamicIcon as unknown as React.ComponentType<LucideProps & { name: string }> };
});

const toKebab = (name: string) =>
  name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase();

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Known = ICONS[name];
  const kebab = useMemo(() => toKebab(name), [name]);

  if (Known) return <Known {...props} />;

  return (
    <Suspense fallback={<Circle {...props} />}>
      <LazyDynamicIcon name={kebab} {...props} />
    </Suspense>
  );
}
