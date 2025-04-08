import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
type Font = "Inter" | "Roboto" | "Open Sans" | "Lato" | "Lexend" | "Nunito";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultFont?: Font;
  themeStorageKey?: string;
  fontStorageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  font: Font;
  setFont: (font: Font) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  font: "Inter",
  setFont: () => null,
  primaryColor: "#ef3e23",
  setPrimaryColor: () => null,
  secondaryColor: "#f0f4f9",
  setSecondaryColor: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultFont = "Inter",
  themeStorageKey = "vite-ui-theme",
  fontStorageKey = "vite-ui-font",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(themeStorageKey) as Theme) || defaultTheme
  );

  const [font, setFont] = useState<Font>(
    () => (localStorage.getItem(fontStorageKey) as Font) || defaultFont
  );

  const [primaryColor, setPrimaryColor] = useState<string>(
    () => localStorage.getItem("primary-color") || "#ef3e23"
  );

  const [secondaryColor, setSecondaryColor] = useState<string>(
    () => localStorage.getItem("secondary-color") || "#f0f4f9"
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

  useEffect(() => {
    document.body.style.fontFamily = font;
    localStorage.setItem(fontStorageKey, font);
  }, [font, fontStorageKey]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", primaryColor);
    localStorage.setItem("primary-color", primaryColor);
  }, [primaryColor]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--secondary", secondaryColor);
    localStorage.setItem("secondary-color", secondaryColor);
  }, [secondaryColor]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(themeStorageKey, newTheme);
      setTheme(newTheme);
    },
    font,
    setFont: (newFont: Font) => {
      localStorage.setItem(fontStorageKey, newFont);
      setFont(newFont);
    },
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
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
