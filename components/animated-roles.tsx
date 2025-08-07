"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function AnimatedRoles() {
  const roles = ["ANANTH.N", "PROMPT ENGINEER", "PYTHON DEV", "JS & TS DEV", "AI TOOLS EXPERT"]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % roles.length)
    }, 2500) // Change role every 2.5 seconds

    return () => clearInterval(interval)
  }, [roles.length])

  return (
    <div className="h-16 relative flex items-center justify-center overflow-hidden">
      <div className="flex items-center gap-2">
        <motion.span
          className="text-white text-xl md:text-2xl font-medium"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          I'm
        </motion.span>

        <div className="relative w-64 md:w-80">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{
                rotateY: 90,
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                rotateY: 0,
                opacity: 1,
                scale: 1,
              }}
              exit={{
                rotateY: -90,
                opacity: 0,
                scale: 0.8,
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.6,
              }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ transformStyle: "preserve-3d" }}
            >
              <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-amber-300 to-purple-600 whitespace-nowrap">
                {roles[currentIndex]}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
