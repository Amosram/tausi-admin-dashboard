import { useEffect, useState } from "react"
import { ThemeProviderContext, ThemeProviderProps } from "./themeContext"
import { Theme } from "@/constants/types"


export const ThemeProvider = ({
  children,
  defaultTheme = "light",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  // useEffect(() => {
  //   const root = window.document.documentElement

  //   root.classList.remove("light", "dark")

  //   if (theme === "system") {
  //     const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
  //       .matches
  //       ? "dark"
  //       : "light"

  //     root.classList.add(systemTheme)
  //     return
  //   }

  //   root.classList.add(theme)
  // }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

