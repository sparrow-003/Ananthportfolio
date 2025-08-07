"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronDown, ArrowRight, Crown, Zap, Star } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { AnimatedRoles } from "@/components/animated-roles"

export function RichHeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
  const isMobile = useIsMobile()

  // Create luxury particles
  useEffect(() => {
    const createParticles = () => {
      const particlesContainer = document.createElement("div")
      particlesContainer.className = "luxury-particles"

      const particleCount = isMobile ? 15 : 30

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div")
        particle.className = "particle"
        particle.style.left = Math.random() * 100 + "%"
        particle.style.width = Math.random() * 4 + 2 + "px"
        particle.style.height = particle.style.width
        particle.style.animationDelay = Math.random() * 15 + "s"
        particlesContainer.appendChild(particle)
      }

      if (ref.current) {
        ref.current.appendChild(particlesContainer)
      }
    }

    createParticles()

    return () => {
      const particles = document.querySelector(".luxury-particles")
      if (particles) {
        particles.remove()
      }
    }
  }, [isMobile])

  const handleScrollDown = () => {
    const aboutSection = document.getElementById("about")
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleHireMe = () => {
    const subject = "Elite Collaboration Opportunity"
    const body = `Dear Ananth,

Your exceptional portfolio has caught my attention. I'm interested in discussing a premium collaboration opportunity that matches your elite expertise.

Let's create something extraordinary together.

Best regards,`

    const mailtoLink = `mailto:thanan757@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  }

  return (
    <section id="home" ref={ref} className="elite-hero">
      {/* Rich Background Elements */}
      <div className="rich-bg-element rich-orb-1"></div>
      <div className="rich-bg-element rich-orb-2"></div>
      <div className="rich-bg-element rich-orb-3"></div>

      <motion.div style={{ y, opacity, scale }} className="elite-container z-20 relative">
        <div className="elite-grid elite-grid-2 items-center gap-16">
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Elite Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mb-8 inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 border-blue-500/40 backdrop-blur-sm electric-pulse"
            >
              <Crown size={20} className="text-blue-400" />
              <span className="elite-body text-sm font-semibold text-blue-300 uppercase tracking-wider">
                Elite Digital Architect
              </span>
              <Star size={16} className="text-blue-400" />
            </motion.div>

            {/* Main Title */}
            <h1 className="elite-display mb-8 sapphire-glow">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                I'm
              </motion.span>
              <motion.span
                className="block mt-4 chrome-reflection"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
              >
                Ananth N.
              </motion.span>
            </h1>

            {/* Rich Description */}
            <motion.p
              className="elite-body text-xl mb-10 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              Crafting <span className="text-blue-400 font-semibold">premium digital experiences</span> with
              unparalleled precision and innovation. Where luxury meets technology, and{" "}
              <span className="text-blue-300 font-semibold">excellence becomes standard</span>.
            </motion.p>

            {/* Elite Stats */}
            <motion.div
              className="elite-flex gap-8 justify-center md:justify-start mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.4 }}
            >
              <div className="text-center">
                <div className="elite-title text-blue-400 diamond-pulse">50+</div>
                <div className="elite-body text-sm opacity-70">Elite Projects</div>
              </div>
              <div className="text-center">
                <div className="elite-title text-blue-400 diamond-pulse">100%</div>
                <div className="elite-body text-sm opacity-70">Client Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="elite-title text-blue-400 diamond-pulse">24/7</div>
                <div className="elite-body text-sm opacity-70">Premium Support</div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="elite-flex gap-6 justify-center md:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <button onClick={handleHireMe} className="luxury-button elite-flex items-center gap-3">
                  <Zap size={18} />
                  Hire Me Now
                  <ArrowRight size={18} />
                </button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="border-2 border-blue-500/50 text-blue-300 hover:bg-blue-500/20 px-8 py-4 rounded-xl phantom-motion bg-transparent backdrop-blur-sm text-lg font-semibold"
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
            transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Elite Badge */}
            <motion.h2
              className="elite-subtitle mb-8 text-center phantom-motion"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              PREMIUM DEVELOPER
            </motion.h2>

            {/* Profile Image with Rich Effects */}
            <div className="relative w-80 h-80 md:w-96 md:h-96 mb-10">
              <motion.div
                className="absolute inset-0 rounded-full overflow-hidden border-4 border-blue-500/40 backdrop-blur-sm z-10 elite-card"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
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

              {/* Electric Aura */}
              <div className="absolute -inset-8 z-0">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-600/30 to-blue-400/20 diamond-pulse liquid-motion"></div>
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-12 -right-12 w-20 h-20 bg-blue-500/20 rounded-full blur-lg midnight-drift"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              <motion.div
                className="absolute -bottom-8 -left-12 w-24 h-24 bg-blue-400/15 rounded-full blur-lg midnight-drift"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />

              {/* Electric Orbs */}
              <div className="absolute top-1/4 -left-6 electric-orb w-12 h-12"></div>
              <div className="absolute bottom-1/4 -right-6 electric-orb w-16 h-16"></div>
            </div>

            {/* Animated Roles */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              <div className="electric-pulse">
                <AnimatedRoles />
              </div>
            </motion.div>

            {/* Elite Features */}
            <motion.div
              className="mt-8 elite-flex gap-6 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
            >
              <div className="text-center phantom-motion">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full elite-flex-center mb-2 mx-auto">
                  <Zap size={20} className="text-blue-400" />
                </div>
                <div className="elite-body text-xs opacity-70">AI Expert</div>
              </div>
              <div className="text-center phantom-motion">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full elite-flex-center mb-2 mx-auto">
                  <Crown size={20} className="text-blue-400" />
                </div>
                <div className="elite-body text-xs opacity-70">Premium Quality</div>
              </div>
              <div className="text-center phantom-motion">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full elite-flex-center mb-2 mx-auto">
                  <Star size={20} className="text-blue-400" />
                </div>
                <div className="elite-body text-xs opacity-70">Elite Service</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white cursor-pointer z-20 phantom-motion"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.5, ease: "easeInOut" }}
        onClick={handleScrollDown}
      >
        <div className="elite-flex-center flex-col">
          <span className="elite-body text-sm mb-3 opacity-80">Discover Excellence</span>
          <div className="w-8 h-8 border-2 border-blue-400 rounded-full elite-flex-center diamond-pulse">
            <ChevronDown size={16} className="text-blue-400" />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
