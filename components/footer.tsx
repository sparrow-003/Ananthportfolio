"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Twitter, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative py-12 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-black -z-10"></div>

      {/* Border top with gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-8 md:mb-0"
            >
              <div className="text-2xl font-bold text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-amber-300 to-purple-600">
                  ANANTH.N
                </span>
              </div>
              <p className="text-gray-400 mt-2">Crafting digital excellence</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex space-x-6"
            >
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="mailto:thanan757@gmail.com" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Mail size={20} />
                <span className="sr-only">Email</span>
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="border-t border-white/10 mt-8 pt-8 text-center"
          >
            <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Ananth N. All rights reserved.</p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
