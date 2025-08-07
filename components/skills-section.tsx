"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { GlassCard } from "@/components/glass-card"

export function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  const categories = [
    {
      name: "Programming Languages",
      skills: [
        { name: "Python", level: 85 },
        { name: "JavaScript", level: 80 },
        { name: "TypeScript", level: 75 },
        { name: "HTML/CSS", level: 85 },
      ],
    },
    {
      name: "AI & Machine Learning",
      skills: [
        { name: "AI Prompt Engineering", level: 90 },
        { name: "AI Tools & Frameworks", level: 95 },
        { name: "Natural Language Processing", level: 85 },
        { name: "Computer Vision", level: 70 },
      ],
    },
    {
      name: "Web Development",
      skills: [
        { name: "React", level: 75 },
        { name: "Next.js", level: 80 },
        { name: "Node.js", level: 70 },
        { name: "Responsive Design", level: 85 },
      ],
    },
  ]

  return (
    <section id="skills" className="relative py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black -z-10"></div>

      {/* Animated background shapes */}
      <div className="absolute inset-0 -z-5">
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-amber-500/10 rounded-full filter blur-3xl animate-blob"></div>
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Technical{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-amber-400">
                Skills
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-amber-500 mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A comprehensive overview of my technical expertise and proficiency levels across various domains.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, categoryIndex) => (
              <motion.div key={categoryIndex} variants={itemVariants}>
                <GlassCard>
                  <h3 className="text-xl font-semibold text-white mb-6 text-center">{category.name}</h3>

                  <div className="space-y-6">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skillIndex}>
                        <div className="mb-2 flex justify-between">
                          <h4 className="font-medium text-gray-300">{skill.name}</h4>
                          <span className="text-amber-400">{skill.level}%</span>
                        </div>
                        <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-purple-600 to-amber-500"
                            initial={{ width: 0 }}
                            animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                            transition={{ duration: 1, delay: 0.3 + skillIndex * 0.1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants} className="mt-16">
            <GlassCard>
              <h3 className="text-xl font-semibold text-white mb-6 text-center">Additional Expertise</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  "Problem Solving",
                  "Critical Thinking",
                  "UI/UX Design",
                  "API Integration",
                  "Database Management",
                  "Version Control (Git)",
                  "Responsive Design",
                  "SEO Optimization",
                  "Technical Documentation",
                  "Agile Methodology",
                  "Cloud Services",
                  "DevOps",
                  "System Architecture",
                  "Performance Optimization",
                ].map((item, index) => (
                  <motion.span
                    key={index}
                    className="px-4 py-2 bg-purple-900/30 text-purple-300 rounded-full border border-purple-700/30"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 + 0.5 }}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(168, 85, 247, 0.2)",
                      transition: { duration: 0.2 },
                    }}
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
