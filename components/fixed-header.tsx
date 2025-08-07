"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

export function FixedHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const isMobile = useIsMobile()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    const handleSectionChange = () => {
      const sections = ["home", "about", "projects", "skills", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("scroll", handleSectionChange)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("scroll", handleSectionChange)
    }
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
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-2xl" : "bg-transparent"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo with NovaIgnite effect */}
          <motion.div
            className="nova-ignite-trigger"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <a href="#home" className="text-2xl font-bold text-white nova-ignite">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-amber-300 to-purple-600">
                ANANTH.N
              </span>
            </a>
          </motion.div>

          {/* Desktop Navigation with MetaPulse effects */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, i) => (
              <motion.div
                key={item.name}
                className="meta-pulse-trigger"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 + 0.3 }}
              >
                <a
                  href={item.href}
                  className={`px-4 py-2 text-sm transition-all duration-300 relative group meta-pulse ${
                    activeSection === item.href.slice(1) ? "text-purple-400" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.name}
                  <motion.span
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-amber-300"
                    initial={{ width: 0 }}
                    animate={{
                      width: activeSection === item.href.slice(1) ? "100%" : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </a>
              </motion.div>
            ))}

            {/* Hire Me Button with CoreBloom effect */}
            <motion.div
              className="ml-6 core-bloom-trigger"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Button
                onClick={handleHireMe}
                className="core-bloom bg-gradient-to-r from-purple-600 to-amber-500 text-white hover:from-purple-700 hover:to-amber-600 transition-all duration-300 px-6 py-2 rounded-full"
              >
                Hire Me
              </Button>
            </motion.div>
          </nav>

          {/* Mobile Menu Button with QuantumPhase effect */}
          <div className="md:hidden">
            <motion.div className="quantum-phase-trigger" whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                className="text-white quantum-phase"
              >
                <Menu size={24} />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Menu with HyperSlideX effect */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg md:hidden hyper-slide-x"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <div className="text-2xl font-bold text-white nova-ignite">
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
                    className="text-2xl text-white hover:text-amber-300 transition-colors neuro-sync"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                  >
                    {item.name}
                  </motion.a>
                ))}

                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <Button
                    onClick={() => {
                      handleHireMe()
                      setMobileMenuOpen(false)
                    }}
                    className="core-bloom bg-gradient-to-r from-purple-600 to-amber-500 text-white hover:from-purple-700 hover:to-amber-600 transition-all px-8 py-6 text-lg rounded-full"
                  >
                    Hire Me
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
