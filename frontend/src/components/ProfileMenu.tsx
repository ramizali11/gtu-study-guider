import { useState } from "react";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileMenuProps {
  name?: string;
  email?: string;
  avatarUrl?: string;
}

export function ProfileMenu({ avatarUrl }: ProfileMenuProps) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const name = user.name || "Guest";
  const email = user.email || "";
  const [open, setOpen] = useState(false);
  // TODO: Fetch the authenticated user profile from FastAPI

  const initials = name
    .split(" ")
    .map((part: string) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full border border-border bg-card p-1 pr-2 shadow-card transition-colors hover:bg-accent text-primary  "
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="size-9 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="grid size-9 place-items-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground ">
            {initials}
          </span>
        )}
        <ChevronDown
          className="size-4 text-muted-foreground"
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            role="menu"
            className="absolute right-0 z-30 mt-2 w-56 rounded-2xl border border-border bg-popover p-2 shadow-float "
          >
            <div className="border-b border-border px-3 py-2 " >
              <p className="truncate text-sm font-semibold text-popover-foreground">
                {name}
              </p>
              <p className="truncate text-xs text-muted-foreground ">{email}</p>
            </div>
            <ul className="pt-1 ">
              {[
                { label: "My profile", icon: User },
                { label: "Settings", icon: Settings },
                { label: "Logout", icon: LogOut },
              ].map(({ label, icon: Icon }) => (
                <li key={label}>
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default ProfileMenu;
