"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronDown, ArrowRight, Code, Zap, Target } from "lucide-react"

export function ProfessionalHeroSection() {
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

  const handleHireMe = () => {
    const subject = "Professional Collaboration Opportunity"
    const body = `Dear Ananth,

I am impressed by your professional portfolio and would like to discuss a potential collaboration opportunity.

I believe your expertise would be valuable for our upcoming projects.

Best regards,`

    const mailtoLink = `mailto:thanan757@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  }

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-gradient-to-br from-slate-50 via-white to-blue-50"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width%3D%2260%22 height%3D%2260%22 viewBox%3D%220 0 60 60%22 xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg fill%3D%22none%22 fillRule%3D%22evenodd%22%3E%3Cg fill%3D%22%23000000%22 fillOpacity%3D%220.1%22%3E%3Ccircle cx%3D%227%22 cy%3D%227%22 r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-100 rounded-full opacity-30"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-cyan-100 rounded-full opacity-40"
          animate={{
            y: [0, 15, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <motion.div style={{ y, opacity }} className="container mx-auto px-4 z-20 relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div
            className="lg:w-1/2 text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mb-6 inline-block"
            >
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Professional Developer
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
              <span className="block">I'm</span>
              <span className="block mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Ananth N.
              </span>
            </h1>

            <p className="text-xl text-slate-600 mb-8 max-w-lg leading-relaxed">
              Delivering exceptional digital solutions with precision, innovation, and professional excellence.
              Transforming ideas into powerful applications.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
              <Button
                onClick={handleHireMe}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-6 rounded-lg transition-all transform hover:scale-105 shadow-lg group"
              >
                Start Project
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-6 rounded-lg transition-all bg-transparent"
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

            {/* Key highlights */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-slate-600">
                <Code className="text-blue-600" size={20} />
                <span className="text-sm font-medium">Full-Stack Developer</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Zap className="text-blue-600" size={20} />
                <span className="text-sm font-medium">AI Specialist</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Target className="text-blue-600" size={20} />
                <span className="text-sm font-medium">Problem Solver</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="lg:w-1/2 flex flex-col items-center justify-center relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-white shadow-2xl z-10">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1740320840665.jpg-VKDMFI4IGCGNUXiKNfHjD5HVdlnfyx.jpeg"
                  alt="Ananth N. - Professional Developer"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                  className="z-10"
                />
              </div>

              {/* Professional glow effect */}
              <div className="absolute -inset-4 z-0">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-200/50 to-cyan-200/50 blur-xl"></div>
              </div>

              {/* Decorative elements */}
              <motion.div
                className="absolute -top-6 -right-6 w-12 h-12 bg-blue-500 rounded-lg shadow-lg"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-8 h-8 bg-cyan-500 rounded-full shadow-lg"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </div>

            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="text-lg font-semibold text-slate-700 mb-2">Available for Professional Projects</div>
              <div className="text-sm text-slate-500">Ready to deliver exceptional results</div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-slate-600 cursor-pointer z-20"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
        onClick={handleScrollDown}
      >
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2 text-slate-500">Explore More</span>
          <ChevronDown size={24} className="text-blue-600" />
        </div>
      </motion.div>
    </section>
  )
}
