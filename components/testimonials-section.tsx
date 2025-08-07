"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const [activeIndex, setActiveIndex] = useState(0)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  }

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CTO, TechVision Inc.",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "Ananth is a true digital visionary. His ability to blend technical expertise with creative problem-solving resulted in a platform that exceeded our expectations. His work transformed our business operations and significantly improved our user engagement metrics.",
    },
    {
      name: "Michael Chen",
      role: "Founder, InnovateLab",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "Working with Ananth was a game-changing experience for our startup. His deep understanding of AI and web development helped us create a product that stands out in a crowded market. His attention to detail and commitment to excellence are truly remarkable.",
    },
    {
      name: "Emily Rodriguez",
      role: "Product Manager, DataFlow",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "Ananth's expertise in AI prompt engineering revolutionized our approach to natural language processing. He delivered a solution that not only met our technical requirements but also provided an intuitive user experience. A rare combination of technical brilliance and design sensibility.",
    },
  ]

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="relative py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black -z-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Client{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-amber-400">
                Testimonials
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-amber-500 mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Hear what clients and collaborators have to say about working with me and the results we've achieved
              together.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 z-20">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevTestimonial}
                className="bg-black/30 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 rounded-full h-12 w-12"
              >
                <ChevronLeft size={24} />
              </Button>
            </div>

            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-20">
              <Button
                variant="ghost"
                size="icon"
                onClick={nextTestimonial}
                className="bg-black/30 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 rounded-full h-12 w-12"
              >
                <ChevronRight size={24} />
              </Button>
            </div>

            <div className="overflow-hidden px-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                >
                  <GlassCard className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="md:w-1/3 flex flex-col items-center text-center">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500/30 mb-4">
                          <Image
                            src={testimonials[activeIndex].image || "/placeholder.svg"}
                            alt={testimonials[activeIndex].name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h3 className="text-xl font-semibold text-white">{testimonials[activeIndex].name}</h3>
                        <p className="text-purple-300">{testimonials[activeIndex].role}</p>
                      </div>

                      <div className="md:w-2/3">
                        <div className="relative">
                          <Quote className="absolute -top-6 -left-6 text-purple-500/20" size={48} />
                          <p className="text-xl text-gray-300 italic leading-relaxed">
                            {testimonials[activeIndex].content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full mx-1 transition-all ${
                    index === activeIndex ? "bg-purple-500" : "bg-gray-600"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
