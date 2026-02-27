import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { AnimationProvider } from "@/contexts/AnimationContext"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <AnimationProvider>
        {children}
      </AnimationProvider>
    </NextThemesProvider>
  )
}

export { useTheme }
