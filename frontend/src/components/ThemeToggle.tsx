import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "../hooks/useTheme";
import { cn } from "../lib/utils";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
      className={cn(
        "flex h-9 w-16 shrink-0 items-center rounded-full border border-border p-1 shadow-card transition-colors",
        isDark ? "justify-end bg-primary/20" : "justify-start bg-card",
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 34 }}
        className="grid size-7 place-items-center rounded-full bg-gradient-primary text-primary-foreground"
      >
        {isDark ? (
          <Moon className="size-3.5" aria-hidden="true" />
        ) : (
          <Sun className="size-3.5" aria-hidden="true" />
        )}
      </motion.span>
    </button>
  );
}

export default ThemeToggle;
