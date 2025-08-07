"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, Code, Mail, User, Award } from "lucide-react"

export function ProfessionalHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "About", href: "#about", icon: User },
    { name: "Projects", href: "#projects", icon: Code },
    { name: "Skills", href: "#skills", icon: Award },
    { name: "Contact", href: "#contact", icon: Mail },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => scrollToSection("#home")}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="text-xl font-bold text-slate-800">Ananth N.</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-slate-700 hover:text-blue-600 transition-colors font-medium"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              onClick={() => {
                const subject = "Professional Collaboration"
                const body = "Hi Ananth, I'd like to discuss a project opportunity."
                window.location.href = `mailto:thanan757@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all"
            >
              Hire Me
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-t border-slate-200 py-4"
          >
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors px-4 py-2"
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </button>
              ))}
              <div className="px-4 pt-2">
                <Button
                  onClick={() => {
                    const subject = "Professional Collaboration"
                    const body = "Hi Ananth, I'd like to discuss a project opportunity."
                    window.location.href = `mailto:thanan757@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Hire Me
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
