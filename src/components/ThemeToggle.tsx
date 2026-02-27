 import { Moon, Sun } from "lucide-react"
 import { Button } from "@/components/ui/button"
 import { useTheme } from "@/components/theme-provider"
 
 export function ThemeToggle() {
   const { theme, setTheme, resolvedTheme } = useTheme()
   
   const toggleTheme = () => {
     // Toggle between light and dark
     setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
   }
 
   return (
     <Button 
       variant="ghost" 
       size="icon" 
       onClick={toggleTheme}
       className="h-9 w-9 rounded-full border border-primary/20 bg-background/50 hover:bg-primary/10 hover:text-primary transition-all duration-300"
       aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
     >
       <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-primary" />
       <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-primary" />
     </Button>
   )
 }
