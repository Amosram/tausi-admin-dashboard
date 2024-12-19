import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
type Font = "Inter" | "Roboto" | "Open Sans" | "Lato" | "Lexend" | "Nunito";

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    defaultFont?: Font;
    themeStorageKey?: string;
    fontStorageKey?: string;
    // storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    font: Font;
    setFont: (font: Font) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  font: "Inter",
  setFont: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultFont = "Inter",
  themeStorageKey = "vite-ui-theme",
  fontStorageKey = "vite-ui-font",
  // storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(themeStorageKey) as Theme) || defaultTheme
  );

  const [font, setFont] = useState<Font>(
    () => (localStorage.getItem(fontStorageKey) as Font) || defaultFont
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    // Apply system theme if 'system' is selected
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme); // Apply light or dark theme
    }
    localStorage.setItem(themeStorageKey, theme);
  }, [theme, themeStorageKey]);

  // sync font with localStorage
  useEffect(() => {
    document.body.style.fontFamily = font;
    localStorage.setItem(fontStorageKey, font);
  }, [font, fontStorageKey]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      // Store theme preference in localStorage
      localStorage.setItem(themeStorageKey, newTheme);
      setTheme(newTheme);
    },
    font,
    setFont: (newFont: Font) => {
      // Store font preference in localStorage
      localStorage.setItem(fontStorageKey, newFont);
      setFont(newFont);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
