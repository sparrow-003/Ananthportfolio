"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Brain, Zap, Code2, Sparkles } from 'lucide-react'

export function DarkLoader() {
  const [progress, setProgress] = useState(0)
  const [currentText, setCurrentText] = useState(0)

  const loadingTexts = [
    "Initializing AI Systems...",
    "Loading Neural Networks...",
    "Connecting to LLM APIs...",
    "Preparing Elite Experience...",
    "Ready for Launch!"
  ]

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 50)

    const textInterval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % loadingTexts.length)
    }, 1000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(textInterval)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="relative z-10 text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl mx-auto">
              <span className="text-white font-bold text-3xl">A</span>
            </div>
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl blur"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Ananth N.</h1>
          <p className="text-blue-400 text-lg">Elite AI Developer</p>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-8"
        >
          <p className="text-gray-300 text-lg font-medium">
            {loadingTexts[currentText]}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="w-80 mx-auto"
        >
          <div className="bg-gray-800 rounded-full h-2 mb-4 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-gray-400 text-sm">{progress}% Complete</p>
        </motion.div>

        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Brain className="text-blue-400" size={24} />
          </motion.div>

          <motion.div
            className="absolute top-1/3 right-1/4"
            animate={{
              y: [0, 15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <Zap className="text-purple-400" size={20} />
          </motion.div>

          <motion.div
            className="absolute bottom-1/3 left-1/3"
            animate={{
              x: [0, -10, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            <Code2 className="text-cyan-400" size={18} />
          </motion.div>

          <motion.div
            className="absolute bottom-1/4 right-1/3"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Sparkles className="text-blue-300" size={16} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
