import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const THEME_KEY = "app_theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get initial theme from localStorage or system preference
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    let initialTheme: Theme;
    
    if (stored) {
      initialTheme = stored;
    } else {
      // Use system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      initialTheme = prefersDark ? "dark" : "light";
    }
    
    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const html = document.documentElement;
    
    if (newTheme === "dark") {
      html.classList.add("dark");
      document.body.style.colorScheme = "dark";
    } else {
      html.classList.remove("dark");
      document.body.style.colorScheme = "light";
    }
    
    localStorage.setItem(THEME_KEY, newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return { theme, toggleTheme, mounted };
}
