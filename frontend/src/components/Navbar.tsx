import { Menu } from "lucide-react";

import { NotificationBell } from "../components/NotificationBell";
import { ProfileMenu } from "../components/ProfileMenu";
import { SearchBar } from "../components/SearchBar";
import { ThemeToggle } from "../components/ThemeToggle";

interface NavbarProps {
  userName?: string;
  onOpenSidebar?: () => void;
}

export function Navbar({onOpenSidebar}: NavbarProps) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.name || "Guest";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <header className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 xl:flex xl:flex-wrap xl:justify-between">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open navigation"
        className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-card text-muted-foreground shadow-card lg:hidden dark:text-white"
      >
        <Menu className="size-5" aria-hidden="true" /> y
      </button>

      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl dark:text-white">
          {greeting}, {userName} 👋
        </h1>
        <p className="truncate text-sm text-muted-foreground dark:text-white">
          Let&apos;s make today&apos;s study session productive.
        </p>
      </div>

      <div className="col-span-2 flex min-w-0 flex-wrap items-center justify-end gap-3 xl:col-span-1 dark:text-white">
        <SearchBar />
        <NotificationBell />
        <ProfileMenu />
        <ThemeToggle />
      </div>
    </header>
  );
}

export default Navbar;
