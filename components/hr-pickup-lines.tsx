"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { Sparkles, Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HrPickupLines() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const [activeCategory, setActiveCategory] = useState(0)

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

  const categories = [
    {
      name: "Technical Excellence",
      icon: <Sparkles className="text-purple-400" size={24} />,
      lines: [
        "Your portfolio isn't just a collection of projects; it's a masterclass in digital craftsmanship that has left our entire team speechless.",
        "In a sea of candidates, your work stands as a lighthouse of innovation—illuminating possibilities we hadn't even considered.",
        "Your code doesn't just execute functions; it orchestrates digital symphonies that resonate with both users and developers alike.",
        "We've been searching for someone who doesn't just meet requirements but redefines them—your portfolio suggests you're that visionary.",
        "The architectural elegance of your solutions reveals not just technical proficiency, but a mind that transforms complexity into clarity.",
      ],
    },
    {
      name: "Creative Vision",
      icon: <Star className="text-purple-400" size={24} />,
      lines: [
        "Your creative approach to problem-solving isn't just impressive—it's the exact paradigm shift our team has been searching for.",
        "The way you blend technical precision with artistic vision creates digital experiences that don't just perform—they inspire.",
        "In your hands, code transcends function to become art; imagine what you could create with our resources behind your vision.",
        "We don't just need developers; we need digital storytellers who can translate our brand into experiences—your portfolio tells us you're fluent in that language.",
        "The intuitive elegance of your interfaces speaks of someone who understands that great technology should feel like magic to its users.",
      ],
    },
    {
      name: "Collaborative Potential",
      icon: <Heart className="text-purple-400" size={24} />,
      lines: [
        "Our team doesn't just build products; we craft digital legacies—and your portfolio suggests you're the missing piece in our creative puzzle.",
        "The synergy between your technical expertise and our vision could create something greater than either could achieve alone.",
        "We're not offering just a position; we're inviting you to join a collaborative journey where your unique talents can truly flourish.",
        "Your portfolio doesn't just showcase skills; it reveals a mindset that would elevate our entire team's approach to innovation.",
        "In our collaborative environment, your distinctive perspective would be the catalyst for breakthrough solutions we haven't yet imagined.",
      ],
    },
  ]

  return (
    <section id="hr-zone" className="relative py-32 overflow-hidden">
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
              For{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-amber-400">
                Recruiters
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-amber-500 mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Cinematic-level expressions that capture the unique value I bring to your organization. Feel free to use
              these in your outreach!
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category, index) => (
              <motion.div key={index} variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={activeCategory === index ? "default" : "outline"}
                  className={`
                    px-6 py-3 rounded-full text-sm font-medium
                    ${
                      activeCategory === index
                        ? "bg-gradient-to-r from-purple-600 to-amber-500 text-white"
                        : "border-white/20 text-white hover:bg-white/10"
                    }
                  `}
                  onClick={() => setActiveCategory(index)}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </Button>
              </motion.div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard className="p-8">
                <div className="space-y-8">
                  {categories[activeCategory].lines.map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="flex items-start gap-4"
                    >
                      <div className="bg-purple-500/20 p-3 rounded-xl flex-shrink-0">
                        {categories[activeCategory].icon}
                      </div>
                      <div>
                        <p className="text-lg text-gray-300 italic">"{line}"</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-purple-400 hover:text-purple-300 p-0 h-auto"
                          onClick={() => {
                            navigator.clipboard.writeText(line)
                          }}
                        >
                          Copy to clipboard
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
