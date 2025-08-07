"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronDown, ArrowRight, Zap, Brain, Code2, Sparkles } from 'lucide-react'

export function DarkHeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const handleScrollDown = () => {
    const aboutSection = document.getElementById("about")
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleStartProject = () => {
    const subject = "🚀 Elite Project Collaboration - Let's Build Something Extraordinary"
    const body = `Dear Ananth,

I've reviewed your exceptional portfolio and I'm impressed by your elite AI development capabilities.

I have a high-value project that requires:
• Advanced AI/LLM integration
• Custom agent development
• Premium full-stack solutions

Project Budget: $______
Timeline: ______
Priority: High

I'd like to discuss this opportunity immediately. When can we schedule a call?

Best regards,
[Your Name]
[Your Company]
[Your Contact]`

    const mailtoLink = `mailto:thanan757@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  }

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-black"
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width%3D%2260%22 height%3D%2260%22 viewBox%3D%220 0 60 60%22 xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg fill%3D%22none%22 fillRule%3D%22evenodd%22%3E%3Cg fill%3D%22%23ffffff%22 fillOpacity%3D%220.1%22%3E%3Ccircle cx%3D%227%22 cy%3D%227%22 r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"></div>
      </div>

      <motion.div style={{ y, opacity }} className="container mx-auto px-4 z-20 relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <motion.div
            className="lg:w-1/2 text-center lg:text-left"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mb-8 inline-block"
            >
              <span className="px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 text-blue-300 rounded-full text-sm font-medium backdrop-blur-sm">
                <Sparkles className="inline mr-2" size={16} />
                Elite AI Developer Available
              </span>
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
              <span className="block">I'm</span>
              <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                Ananth N.
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-10 max-w-lg leading-relaxed">
              Elite AI Developer specializing in cutting-edge LLM integrations, autonomous agents, and premium
              full-stack solutions. Transforming ambitious visions into revolutionary digital experiences.
            </p>

            <div className="flex flex-wrap gap-6 justify-center lg:justify-start mb-12">
              <Button
                onClick={handleStartProject}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-10 py-6 rounded-xl transition-all transform hover:scale-105 shadow-2xl group text-lg"
              >
                Start Elite Project
                <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>

              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-10 py-6 rounded-xl transition-all bg-transparent text-lg font-semibold"
                onClick={() => {
                  const projectsSection = document.getElementById("projects")
                  if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                View Portfolio
              </Button>
            </div>

            {/* Elite highlights */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col items-center lg:items-start gap-2 text-gray-300">
                <Brain className="text-blue-400" size={24} />
                <span className="text-sm font-medium">LLM Expert</span>
              </div>
              <div className="flex flex-col items-center lg:items-start gap-2 text-gray-300">
                <Zap className="text-purple-400" size={24} />
                <span className="text-sm font-medium">AI Agents</span>
              </div>
              <div className="flex flex-col items-center lg:items-start gap-2 text-gray-300">
                <Code2 className="text-blue-400" size={24} />
                <span className="text-sm font-medium">Full-Stack</span>
              </div>
              <div className="flex flex-col items-center lg:items-start gap-2 text-gray-300">
                <Sparkles className="text-purple-400" size={24} />
                <span className="text-sm font-medium">Premium</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="lg:w-1/2 flex flex-col items-center justify-center relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative w-96 h-96 md:w-[450px] md:h-[450px]">
              {/* Main image */}
              <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-gray-700 shadow-2xl z-10">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1740320840665.jpg-VKDMFI4IGCGNUXiKNfHjD5HVdlnfyx.jpeg"
                  alt="Ananth N. - Elite AI Developer"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                  className="z-10"
                />
              </div>

              {/* Glowing ring effect */}
              <motion.div
                className="absolute -inset-6 z-0"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 blur-2xl"></div>
              </motion.div>

              {/* Floating elements */}
              <motion.div
                className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Brain className="text-white" size={24} />
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl shadow-2xl flex items-center justify-center"
                animate={{
                  y: [0, 15, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <Zap className="text-white" size={16} />
              </motion.div>

              <motion.div
                className="absolute top-1/4 -left-8 w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full shadow-xl flex items-center justify-center"
                animate={{
                  x: [0, -10, 0],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 2,
                }}
              >
                <Code2 className="text-white" size={14} />
              </motion.div>
            </div>

            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="text-2xl font-bold text-white mb-3">Available for Elite Projects</div>
              <div className="text-gray-400 text-lg">Premium AI solutions • Immediate availability</div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 cursor-pointer z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
        onClick={handleScrollDown}
      >
        <div className="flex flex-col items-center">
          <span className="text-sm mb-3 text-gray-500">Discover More</span>
          <ChevronDown size={28} className="text-blue-400" />
        </div>
      </motion.div>
    </section>
  )
}
