import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "gtu-ai-theme";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored === "dark" || stored === "light") {
    return stored;
  }

  return "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  // IMPORTANT:
  // Apply the saved theme whenever the app starts.
  useEffect(() => {
    const savedTheme = getStoredTheme();

    setTheme(savedTheme);

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(savedTheme);

    document.documentElement.style.colorScheme = savedTheme;

    console.log("THEME INITIALIZED:", savedTheme);
    console.log(
      "HTML CLASS:",
      document.documentElement.className
    );
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => {
      const nextTheme =
        currentTheme === "dark" ? "light" : "dark";

      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(nextTheme);

      document.documentElement.style.colorScheme = nextTheme;

      localStorage.setItem(STORAGE_KEY, nextTheme);

      console.log("THEME CHANGED:", nextTheme);
      console.log(
        "HTML CLASS:",
        document.documentElement.className
      );

      return nextTheme;
    });
  }, []);

  return {
    theme,
    toggleTheme,
  };
}