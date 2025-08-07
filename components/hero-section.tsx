"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronDown, ArrowRight } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { AnimatedRoles } from "@/components/animated-roles"

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])
  const isMobile = useIsMobile()

  const handleScrollDown = () => {
    const aboutSection = document.getElementById("about")
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" })
    }
  }

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
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-black/90 z-0"></div>

      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-5 z-0"></div>

      <motion.div style={{ y, opacity, scale }} className="container mx-auto px-4 z-20 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div
            className="md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mb-4 inline-block"
            >
              <span className="px-4 py-1 border border-purple-500/30 rounded-full text-sm text-purple-300 backdrop-blur-sm">
                Digital Visionary
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="block">I'm</span>
              <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-amber-300 to-purple-600">
                Ananth N.
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              Where technical expertise meets creative innovation. I craft digital experiences that captivate, engage,
              and deliver exceptional results.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button
                onClick={handleHireMe}
                className="bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white font-bold px-8 py-6 rounded-md transition-all transform hover:scale-105 shadow-lg group"
              >
                Hire Me
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 rounded-md transition-all backdrop-blur-sm"
                onClick={() => {
                  const projectsSection = document.getElementById("projects")
                  if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                View Projects
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="md:w-1/2 flex flex-col items-center justify-center relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.h2
              className="text-2xl md:text-3xl font-bold text-white mb-6 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-amber-400">
                ANANTH.N
              </span>
            </motion.h2>

            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-purple-500/30 backdrop-blur-sm z-10">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1740320840665.jpg-VKDMFI4IGCGNUXiKNfHjD5HVdlnfyx.jpeg"
                  alt="Ananth N."
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                  className="z-10"
                />
              </div>

              <div className="absolute -inset-4 z-0">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-600/30 to-amber-500/30 animate-pulse"></div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-purple-500/20 rounded-full blur-md animate-pulse"></div>
              <div className="absolute -bottom-4 -left-8 w-20 h-20 bg-amber-500/20 rounded-full blur-md animate-pulse animation-delay-2000"></div>
            </div>

            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <AnimatedRoles />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll down indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white cursor-pointer z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
        onClick={handleScrollDown}
      >
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2 text-gray-400">Discover More</span>
          <ChevronDown size={24} className="text-purple-400" />
        </div>
      </motion.div>
    </section>
  )
}
