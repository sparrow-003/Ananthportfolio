"use client"

import { motion } from "framer-motion"
import { Brain, Zap, Code2, Database, Globe, Cpu, Bot, Sparkles } from 'lucide-react'

export function DarkSkillsSection() {
  const skillCategories = [
    {
      title: "AI & LLM Expertise",
      icon: Brain,
      color: "from-blue-500 to-cyan-500",
      skills: [
        { name: "OpenAI GPT Integration", level: 95 },
        { name: "Claude API", level: 90 },
        { name: "Gemini Pro", level: 88 },
        { name: "LangChain", level: 92 },
        { name: "LangGraph", level: 89 },
        { name: "Vector Databases", level: 87 },
      ]
    },
    {
      title: "Agent Development",
      icon: Bot,
      color: "from-purple-500 to-pink-500",
      skills: [
        { name: "Multi-Agent Systems", level: 93 },
        { name: "AutoGen Framework", level: 88 },
        { name: "CrewAI", level: 85 },
        { name: "Agent Orchestration", level: 91 },
        { name: "Tool Integration", level: 94 },
        { name: "Workflow Automation", level: 89 },
      ]
    },
    {
      title: "Data & Integration",
      icon: Database,
      color: "from-green-500 to-teal-500",
      skills: [
        { name: "Web Scraping", level: 96 },
        { name: "API Development", level: 94 },
        { name: "Data Pipeline", level: 91 },
        { name: "ETL Processes", level: 88 },
        { name: "Real-time Processing", level: 87 },
        { name: "Database Design", level: 92 },
      ]
    },
    {
      title: "Full-Stack Development",
      icon: Code2,
      color: "from-orange-500 to-red-500",
      skills: [
        { name: "React/Next.js", level: 97 },
        { name: "TypeScript", level: 95 },
        { name: "Node.js", level: 93 },
        { name: "Python", level: 94 },
        { name: "PostgreSQL", level: 90 },
        { name: "Docker/K8s", level: 88 },
      ]
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <section id="skills" className="py-20 bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-6">
            <Sparkles className="w-4 h-4 text-blue-400 mr-2" />
            <span className="text-blue-300 text-sm font-medium">Elite Technical Arsenal</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Premium Skills
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Cutting-edge expertise in AI, machine learning, and full-stack development. 
            Delivering enterprise-grade solutions with the latest technologies.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              variants={itemVariants}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all duration-300 group"
            >
              <div className="flex items-center mb-8">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white">{category.title}</h3>
              </div>

              <div className="space-y-6">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">{skill.name}</span>
                      <span className="text-blue-400 font-semibold">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ 
                          duration: 1.5, 
                          delay: categoryIndex * 0.2 + skillIndex * 0.1,
                          ease: "easeOut"
                        }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tech Stack Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-3xl font-bold text-white mb-8">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Technology Stack
            </span>
          </h3>
          
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "OpenAI", "LangChain", "LangGraph", "Claude", "Gemini",
              "React", "Next.js", "TypeScript", "Python", "Node.js",
              "PostgreSQL", "MongoDB", "Docker", "AWS", "Vercel",
              "TensorFlow", "PyTorch", "Hugging Face", "Pinecone", "Weaviate"
            ].map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full text-gray-300 text-sm font-medium hover:border-blue-500/50 hover:text-blue-300 transition-all duration-300 cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
