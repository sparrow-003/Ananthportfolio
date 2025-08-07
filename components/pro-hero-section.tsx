"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Star, Zap, Code, Brain } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

export function ProHeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
  const isMobile = useIsMobile()

  const handleScrollDown = () => {
    const aboutSection = document.getElementById("about")
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleHireMe = () => {
    const subject = "Professional Collaboration Opportunity"
    const body = `Hi Ananth,

I'm impressed by your professional portfolio and would like to discuss a collaboration opportunity.

Your expertise in AI and development would be valuable for our project.

Looking forward to connecting,`

    const mailtoLink = `mailto:thanan757@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  }

  const handleWatchDemo = () => {
    const projectsSection = document.getElementById("projects")
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="home" ref={ref} className="pro-hero">
      <motion.div style={{ y, opacity, scale }} className="pro-hero-content">
        {/* Left Side - Text Content */}
        <div className="pro-hero-text">
          <motion.div
            className="pro-hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Star size={16} />
            <span>Available for Premium Projects</span>
          </motion.div>

          <motion.h1
            className="pro-display"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            AI Expert &<br />
            Elite Developer
          </motion.h1>

          <motion.p
            className="pro-body max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            I craft exceptional digital experiences using cutting-edge AI technology and modern development practices.
            Specializing in prompt engineering, full-stack development, and innovative solutions.
          </motion.p>

          {/* Key Skills */}
          <motion.div
            className="flex gap-4 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-full border border-white/10">
              <Brain size={16} className="text-blue-400" />
              <span className="text-sm font-medium">AI & Prompt Engineering</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-full border border-white/10">
              <Code size={16} className="text-blue-400" />
              <span className="text-sm font-medium">Full-Stack Development</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-full border border-white/10">
              <Zap size={16} className="text-blue-400" />
              <span className="text-sm font-medium">Modern Tech Stack</span>
            </div>
          </motion.div>

          <motion.div
            className="pro-hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <button onClick={handleHireMe} className="pro-button">
              <Zap size={18} />
              Start Project
              <ArrowRight size={16} />
            </button>

            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm"
              onClick={handleWatchDemo}
            >
              <Play size={16} />
              View Work
            </Button>
          </motion.div>
        </div>

        {/* Right Side - Visual Content */}
        <div className="pro-hero-visual">
          <motion.div
            className="pro-avatar"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="pro-avatar-ring"></div>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1740320840665.jpg-VKDMFI4IGCGNUXiKNfHjD5HVdlnfyx.jpeg"
              alt="Ananth N."
              width={320}
              height={320}
              className="pro-avatar-image"
              priority
            />
          </motion.div>

          {/* Professional Stats */}
          <motion.div
            className="pro-stats"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="pro-stat">
              <div className="pro-stat-number">50+</div>
              <div className="pro-stat-label">Projects Completed</div>
            </div>
            <div className="pro-stat">
              <div className="pro-stat-number">100%</div>
              <div className="pro-stat-label">Client Satisfaction</div>
            </div>
            <div className="pro-stat">
              <div className="pro-stat-number">3+</div>
              <div className="pro-stat-label">Years Experience</div>
            </div>
          </motion.div>

          {/* Tech Stack Preview */}
          <motion.div
            className="flex gap-3 justify-center flex-wrap max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            {["Python", "JavaScript", "TypeScript", "React", "Next.js", "AI Tools"].map((tech, index) => (
              <motion.div
                key={tech}
                className="px-3 py-1 bg-white/5 rounded-md border border-white/10 text-xs font-medium text-gray-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 122, 255, 0.1)" }}
              >
                {tech}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white cursor-pointer z-20"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
        onClick={handleScrollDown}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <div className="flex-center flex-col gap-2">
          <span className="text-sm text-gray-400">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
