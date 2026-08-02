import { Bell } from "lucide-react";

interface NotificationBellProps {
  count?: number;
}

export function NotificationBell({ count = 3 }: NotificationBellProps) {
  // TODO: Fetch notification count from FastAPI
  return (
    <button
      type="button"
      aria-label={`Notifications${count ? `, ${count} unread` : ""}`}
      className="text-primary relative grid size-11 shrink-0 place-items-center rounded-full border border-border bg-card text-muted-foreground shadow-card transition-colors hover:text-foreground"
    >
      <Bell className="size-[18px]" aria-hidden="true" />
      {count > 0 ? (
        <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-primary ring-2 ring-card" />
      ) : null}
    </button>
  );
}

export default NotificationBell;
