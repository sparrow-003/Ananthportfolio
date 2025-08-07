"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" },
  ]

  const handleHireMe = () => {
    const subject = "Job Opportunity"
    const body = `Hi Ananth,

I've been captivated by your portfolio and would like to discuss a potential collaboration that could redefine digital excellence.

Let's create something extraordinary together.

Best regards,`

    const mailtoLink = `mailto:thanan757@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "py-3 bg-black/30 backdrop-blur-lg border-b border-white/10" : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <a href="#" className="text-2xl font-bold text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-amber-300 to-purple-600">
                ANANTH.N
              </span>
            </a>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <a
                  href={item.href}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-amber-300 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Button
                onClick={handleHireMe}
                className="ml-4 bg-gradient-to-r from-purple-600 to-amber-500 text-white hover:from-purple-700 hover:to-amber-600 transition-all"
              >
                Hire Me
              </Button>
            </motion.div>
          </nav>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)} className="text-white">
              <Menu size={24} />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <div className="text-2xl font-bold text-white">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-amber-300 to-purple-600">
                    ANANTH.N
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="text-white">
                  <X size={24} />
                </Button>
              </div>

              <div className="flex flex-col items-center justify-center flex-1 space-y-8 p-8">
                {navItems.map((item, i) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl text-white hover:text-amber-300 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                  >
                    {item.name}
                  </motion.a>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <Button
                    onClick={() => {
                      handleHireMe()
                      setMobileMenuOpen(false)
                    }}
                    className="mt-4 bg-gradient-to-r from-purple-600 to-amber-500 text-white hover:from-purple-700 hover:to-amber-600 transition-all px-8 py-6"
                  >
                    Hire Me
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
