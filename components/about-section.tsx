"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Code, Zap, Brain, Sparkles, Target, Rocket, Star } from "lucide-react"
import { GlassCard } from "@/components/glass-card"

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

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

  const motivationalQuotes = [
    {
      quote: "Innovation distinguishes between a leader and a follower.",
      author: "Steve Jobs",
      icon: <Rocket className="text-purple-400" size={24} />,
    },
    {
      quote: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
      icon: <Star className="text-amber-400" size={24} />,
    },
    {
      quote: "Code is poetry written in logic.",
      author: "Anonymous",
      icon: <Code className="text-purple-400" size={24} />,
    },
  ]

  return (
    <section id="about" className="relative py-32 overflow-hidden">
      {/* Enhanced background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/30 to-black -z-10"></div>

      {/* More animated background shapes */}
      <div className="absolute inset-0 -z-5">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 0.8, 1.1, 1],
            rotate: [0, -90, -180, -270, -360],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-700/10 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 1.3, 0.9, 1],
            rotate: [0, 120, 240, 360],
            x: [0, 30, -20, 0],
            y: [0, -50, 20, 0],
          }}
          transition={{
            duration: 30,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-20">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              About{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-amber-400">Me</span>
            </motion.h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-purple-500 to-amber-500 mx-auto mb-8"
              initial={{ width: 0 }}
              animate={isInView ? { width: 96 } : { width: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A visionary developer and AI specialist with a passion for creating innovative digital solutions that push
              the boundaries of what's possible.
            </p>
          </motion.div>

          {/* Motivational Quotes Section */}
          <motion.div variants={itemVariants} className="mb-20">
            <h3 className="text-2xl font-bold text-center text-white mb-12">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-amber-400">
                Words That Inspire Me
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {motivationalQuotes.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    y: -10,
                    rotateY: 5,
                    scale: 1.02,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <GlassCard className="h-full">
                    <div className="text-center">
                      <div className="bg-purple-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <blockquote className="text-lg italic text-gray-300 mb-4">"{item.quote}"</blockquote>
                      <cite className="text-amber-400 font-semibold">— {item.author}</cite>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div variants={itemVariants}>
              <div className="relative h-[400px] w-full flex items-center justify-center">
                <motion.div
                  className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-amber-300 to-purple-600"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  whileHover={{
                    scale: 1.1,
                    rotateY: 10,
                    rotateX: 5,
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  ANANTH
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <motion.div
                    className="w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/20 to-amber-500/20"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 360],
                      borderRadius: ["50%", "30%", "50%"],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  />
                </div>

                {/* Enhanced floating elements */}
                <motion.div
                  className="absolute top-1/4 left-1/4 w-16 h-16 bg-purple-500/20 rounded-full"
                  animate={{
                    y: [0, -30, 0],
                    x: [0, 20, 0],
                    rotate: [0, 180, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />

                <motion.div
                  className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-amber-500/20 rounded-full"
                  animate={{
                    y: [0, 25, 0],
                    x: [0, -15, 0],
                    rotate: [0, -180, -360],
                    scale: [1, 0.8, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: 1,
                  }}
                />

                <motion.div
                  className="absolute top-1/2 right-1/6 w-8 h-8 bg-purple-400/30 rounded-full"
                  animate={{
                    y: [0, -20, 0],
                    x: [0, 10, 0],
                    rotate: [0, 90, 180, 270, 360],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: 2,
                  }}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-8">
              <motion.div whileHover={{ scale: 1.02, rotateY: 2 }} transition={{ type: "spring", stiffness: 300 }}>
                <GlassCard>
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="bg-purple-500/20 p-3 rounded-xl"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Brain className="text-purple-400" size={24} />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Visionary Thinker</h3>
                      <p className="text-gray-300">
                        I approach every project with a unique perspective, combining technical expertise with creative
                        problem-solving to deliver innovative solutions that exceed expectations and redefine industry
                        standards.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02, rotateY: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                <GlassCard>
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="bg-purple-500/20 p-3 rounded-xl"
                      whileHover={{ rotate: -360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Code className="text-purple-400" size={24} />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Self-Taught Developer</h3>
                      <p className="text-gray-300">
                        With a strong foundation in Python and JavaScript, I've mastered the art of building
                        sophisticated applications through self-directed learning, continuous experimentation, and
                        hands-on experience across diverse projects.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02, rotateY: 2 }} transition={{ type: "spring", stiffness: 300 }}>
                <GlassCard>
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="bg-purple-500/20 p-3 rounded-xl"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Sparkles className="text-purple-400" size={24} />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">AI Specialist</h3>
                      <p className="text-gray-300">
                        As an expert in AI prompt engineering and cutting-edge AI tools, I harness the power of
                        artificial intelligence to create revolutionary solutions that drive business growth, enhance
                        user experiences, and unlock new possibilities.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02, rotateY: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                <GlassCard>
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="bg-purple-500/20 p-3 rounded-xl"
                      whileHover={{ rotate: -360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Zap className="text-purple-400" size={24} />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Continuous Innovator</h3>
                      <p className="text-gray-300">
                        In the rapidly evolving tech landscape, I stay ahead of the curve by constantly expanding my
                        knowledge, embracing emerging technologies, and pushing the boundaries of what's possible in
                        digital innovation.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="mt-20 text-center">
            <motion.blockquote
              className="text-2xl md:text-3xl italic text-gray-300 max-w-4xl mx-auto"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              "I don't just build applications; I craft digital experiences that resonate with users, drive meaningful
              results, and create lasting impact in the digital world."
            </motion.blockquote>
            <motion.div
              className="mt-6 text-amber-400 font-semibold"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              — Ananth N.
            </motion.div>
          </motion.div>

          {/* Personal Philosophy Section */}
          <motion.div variants={itemVariants} className="mt-20">
            <GlassCard>
              <div className="text-center">
                <motion.div
                  className="bg-gradient-to-r from-purple-500/20 to-amber-500/20 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center"
                  whileHover={{
                    rotate: 360,
                    scale: 1.1,
                  }}
                  transition={{ duration: 0.8 }}
                >
                  <Target className="text-purple-400" size={32} />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-4">My Philosophy</h3>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                  "Technology is not just about code and algorithms; it's about creating solutions that empower people,
                  solve real-world problems, and make the impossible possible. Every line of code I write is a step
                  towards building a better digital future."
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
