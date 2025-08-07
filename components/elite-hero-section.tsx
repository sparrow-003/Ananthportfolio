"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronDown, ArrowRight, Sparkles } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { AnimatedRoles } from "@/components/animated-roles"

export function EliteHeroSection() {
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
    const subject = "Exclusive Collaboration Opportunity"
    const body = `Dear Ananth,

I've been thoroughly impressed by your exceptional portfolio and would like to discuss an exclusive collaboration opportunity.

Your expertise in AI and development aligns perfectly with our vision for innovation.

Looking forward to connecting,`

    const mailtoLink = `mailto:thanan757@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  }

  return (
    <section id="home" ref={ref} className="elite-hero">
      {/* Elite Background Elements */}
      <div className="elite-bg-element elite-bg-element-1"></div>
      <div className="elite-bg-element elite-bg-element-2"></div>
      <div className="elite-bg-element elite-bg-element-3"></div>

      <motion.div style={{ y, opacity, scale }} className="elite-container z-20 relative">
        <div className="elite-grid elite-grid-2 items-center gap-12">
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 backdrop-blur-sm silk-transition"
            >
              <Sparkles size={16} className="text-yellow-400" />
              <span className="elite-body text-sm">Elite Digital Craftsman</span>
            </motion.div>

            <h1 className="elite-title mb-6 platinum-glow">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                I'm
              </motion.span>
              <motion.span
                className="block mt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                Ananth N.
              </motion.span>
            </h1>

            <motion.p
              className="elite-body text-xl mb-8 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              Crafting premium digital experiences with precision, elegance, and innovation. Where artistry meets
              technology.
            </motion.p>

            <motion.div
              className="elite-flex gap-4 justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <button onClick={handleHireMe} className="premium-button elite-flex items-center gap-2">
                  Hire Me
                  <ArrowRight size={16} />
                </button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-lg silk-transition bg-transparent backdrop-blur-sm"
                  onClick={() => {
                    const projectsSection = document.getElementById("projects")
                    if (projectsSection) {
                      projectsSection.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                >
                  View Portfolio
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="elite-flex-center flex-col relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.h2
              className="elite-subtitle mb-6 text-center whisper-motion"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              ANANTH.N
            </motion.h2>

            <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8">
              <motion.div
                className="absolute inset-0 rounded-full overflow-hidden border-2 border-white/20 backdrop-blur-sm z-10 luxury-card"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1740320840665.jpg-VKDMFI4IGCGNUXiKNfHjD5HVdlnfyx.jpeg"
                  alt="Ananth N."
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                  className="z-10"
                />
              </motion.div>

              <div className="absolute -inset-4 z-0">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 breathe"></div>
              </div>

              {/* Decorative elements */}
              <motion.div
                className="absolute -top-8 -right-8 w-16 h-16 bg-yellow-400/10 rounded-full blur-md float"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              <motion.div
                className="absolute -bottom-4 -left-8 w-20 h-20 bg-yellow-500/10 rounded-full blur-md float"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            </div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="silk-transition">
                <AnimatedRoles />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white cursor-pointer z-20 velvet-touch"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
        onClick={handleScrollDown}
      >
        <div className="elite-flex-center flex-col">
          <span className="elite-body text-sm mb-2 opacity-70">Discover More</span>
          <ChevronDown size={20} className="text-yellow-400" />
        </div>
      </motion.div>
    </section>
  )
}
