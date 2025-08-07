"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DarkLoader } from "@/components/dark-loader"
import { DarkHeader } from "@/components/dark-header"
import { DarkHeroSection } from "@/components/dark-hero-section"
import { AboutSection } from "@/components/about-section"
import { ProjectsSection } from "@/components/projects-section"
import { DarkSkillsSection } from "@/components/dark-skills-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { ScrollProgress } from "@/components/scroll-progress"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000) // 3 second loading time

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <DarkLoader />
  }

  return (
    <main className="bg-black min-h-screen">
      <DarkHeader />
      <DarkHeroSection />
      <DarkSkillsSection />

      {/* ProjectsSection and ContactSection can be added here if needed */}
      {/* <ProjectsSection /> */}
      {/* <ContactSection /> */}

      {/* Footer can be added here if needed */}
      {/* <Footer /> */}
    </main>
  )
}
