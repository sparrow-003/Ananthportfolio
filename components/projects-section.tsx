"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { ArrowRight, ExternalLink, Github, Code, MessageSquare, BarChart4 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import Image from "next/image"

export function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const [activeProject, setActiveProject] = useState(0)

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

  const projects = [
    {
      title: "DevHub - Developer Community Platform",
      description:
        "A comprehensive platform for developers to share knowledge, ask questions, and collaborate on projects. Inspired by Stack Overflow and Reddit, but specifically tailored for developers with modern features and a sleek interface.",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["React", "Next.js", "TypeScript", "Prisma", "PostgreSQL"],
      features: [
        "Question & answer system with markdown support",
        "Reputation and badge system for community engagement",
        "Real-time notifications and messaging",
        "Code snippet sharing with syntax highlighting",
      ],
      icon: <Code className="text-purple-400" size={24} />,
      demoLink: "#",
      githubLink: "#",
    },
    {
      title: "Financial Dashboard",
      description:
        "A sophisticated financial analytics dashboard that provides real-time insights into market trends, portfolio performance, and investment opportunities. Built with a focus on data visualization and user experience.",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["JavaScript", "React", "D3.js", "Node.js", "MongoDB"],
      features: [
        "Real-time stock market data visualization",
        "Portfolio tracking and performance analytics",
        "Investment opportunity analysis",
        "Customizable dashboard with drag-and-drop widgets",
      ],
      icon: <BarChart4 className="text-purple-400" size={24} />,
      demoLink: "#",
      githubLink: "#",
    },
    {
      title: "AI-Powered Chatbot",
      description:
        "An intelligent conversational AI chatbot that leverages natural language processing to provide personalized assistance, answer questions, and automate tasks. Designed for seamless integration into websites and applications.",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Python", "TensorFlow", "React", "Flask", "OpenAI API"],
      features: [
        "Natural language understanding and generation",
        "Context-aware conversations with memory",
        "Multi-language support and translation",
        "Customizable personality and response styles",
      ],
      icon: <MessageSquare className="text-purple-400" size={24} />,
      demoLink: "#",
      githubLink: "#",
    },
  ]

  return (
    <section id="projects" className="relative py-32 overflow-hidden">
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
              Featured{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-amber-400">
                Projects
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-amber-500 mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore my portfolio of innovative solutions that showcase my technical expertise and creative
              problem-solving abilities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 },
                }}
                onClick={() => setActiveProject(index)}
                className={`cursor-pointer transition-all duration-300 ${
                  activeProject === index ? "scale-105" : "scale-100 opacity-70"
                }`}
              >
                <GlassCard className={activeProject === index ? "border-purple-500/50" : ""}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-purple-500/20 p-3 rounded-xl">{project.icon}</div>
                    <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                  </div>

                  <p className="text-gray-300 mb-6 line-clamp-3">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs bg-purple-900/50 text-purple-300 px-3 py-1 rounded-full border border-purple-700/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">{projects[activeProject].title}</h3>
                    <p className="text-gray-300 mb-6">{projects[activeProject].description}</p>

                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-amber-400 mb-3">Key Features</h4>
                      <ul className="space-y-2">
                        {projects[activeProject].features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-300">
                            <ArrowRight size={16} className="text-purple-400 mt-1 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        variant="default"
                        className="bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white"
                        onClick={() => window.open(projects[activeProject].demoLink, "_blank")}
                      >
                        <ExternalLink size={16} className="mr-2" />
                        Live Demo
                      </Button>
                      <Button
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                        onClick={() => window.open(projects[activeProject].githubLink, "_blank")}
                      >
                        <Github size={16} className="mr-2" />
                        View Code
                      </Button>
                    </div>
                  </div>

                  <div className="relative h-[300px] rounded-xl overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${projects[activeProject].image})`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                    {/* Project preview overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="bg-black/50 backdrop-blur-sm p-4 rounded-xl border border-white/10"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        <div className="text-lg font-semibold text-white mb-2">Project Preview</div>
                        <div className="text-sm text-gray-300">Click the Live Demo button to explore</div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>

          {/* Project showcase */}
          <motion.div variants={itemVariants} className="mt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <GlassCard>
                  <h3 className="text-2xl font-bold text-white mb-6">DevHub Showcase</h3>
                  <div className="relative h-[300px] rounded-xl overflow-hidden mb-6">
                    <Image
                      src="/placeholder.svg?height=300&width=500"
                      alt="DevHub Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  </div>
                  <p className="text-gray-300 mb-4">
                    DevHub is a modern platform where developers can connect, share knowledge, and collaborate on
                    projects. Built with a focus on community engagement and knowledge sharing.
                  </p>
                  <Button
                    variant="default"
                    className="w-full bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Explore DevHub
                  </Button>
                </GlassCard>
              </div>

              <div>
                <GlassCard>
                  <h3 className="text-2xl font-bold text-white mb-6">Financial Dashboard</h3>
                  <div className="relative h-[300px] rounded-xl overflow-hidden mb-6">
                    <Image
                      src="/placeholder.svg?height=300&width=500"
                      alt="Financial Dashboard Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  </div>
                  <p className="text-gray-300 mb-4">
                    A comprehensive financial analytics platform with real-time data visualization, portfolio tracking,
                    and investment analysis tools.
                  </p>
                  <Button
                    variant="default"
                    className="w-full bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    View Dashboard
                  </Button>
                </GlassCard>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
