import { motion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  FileText,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  LogOut,
  MessageSquare,
  Mic2,
  Settings,
  X,
  type LucideIcon,
} from "lucide-react";

import { cn } from "../lib/utils";

type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const primaryNav: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "ai-chat", label: "AI Chat", icon: MessageSquare },
  { id: "study-assistant", label: "Study Assistant", icon: BookOpen },
  { id: "mock-exams", label: "Mock Exams", icon: FileText },
  { id: "mcq-generator", label: "MCQ Generator", icon: ListChecks },
  { id: "viva-practice", label: "Viva Practice", icon: Mic2 },
  { id: "pdf-notes", label: "PDF Notes", icon: FileText },
  { id: "study-planner", label: "Study Planner", icon: CalendarDays },
  { id: "progress", label: "Progress", icon: BarChart3 },
];

const secondaryNav: NavItem[] = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "logout", label: "Logout", icon: LogOut },
];

interface SidebarProps {
  activeItem?: string;
  onNavigate?: (id: string) => void;
  onClose?: () => void;
}

export function Sidebar({ activeItem = "dashboard", onNavigate, onClose }: SidebarProps) {
  const renderItem = (item: NavItem) => {
    const isActive = item.id === activeItem;
    return (
      <li key={item.id}>
        <button
          type="button"
          onClick={() => onNavigate?.(item.id)}
          aria-current={isActive ? "page" : undefined}
          className={cn(
            "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-card"
              : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
          )}
        >
          <item.icon
            className={cn(
              "size-4.5 shrink-0 transition-transform group-hover:scale-110",
              isActive && "text-sidebar-primary",
            )}
            aria-hidden="true"
          />
          <span className="truncate">{item.label}</span>
        </button>
      </li>
    );
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex h-full w-66 flex-col rounded-3xl border border-sidebar-border bg-sidebar p-4 shadow-float"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <div className="flex min-w-0 items-center gap-3 px-1 py-2">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
            <GraduationCap className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-bold text-foreground">GTU AI</span>
            <span className="block truncate text-xs text-muted-foreground">Study Assistant</span>
          </span>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="grid size-9 shrink-0 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-accent lg:hidden"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <nav aria-label="Main" className="mt-4 flex-1 overflow-y-auto">
        <ul className="space-y-1">{primaryNav.map(renderItem)}</ul>
      </nav>

      <nav aria-label="Account" className="mt-4 border-t border-sidebar-border pt-4">
        <ul className="space-y-1">{secondaryNav.map(renderItem)}</ul>
      </nav>
    </motion.aside>
  );
}

export default Sidebar;
