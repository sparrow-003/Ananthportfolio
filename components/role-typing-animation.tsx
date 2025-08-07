"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function RoleTypingAnimation() {
  const roles = [
    "Programmer",
    "Prompt Engineer",
    "AI Tools Expert",
    "Web Developer",
    "JavaScript Developer",
    "TypeScript Developer",
  ]

  const [currentRole, setCurrentRole] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isTypingComplete, setIsTypingComplete] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (isDeleting && displayText === "") {
      // Move to the next role
      setCurrentRole((prev) => (prev + 1) % roles.length)
      setIsDeleting(false)
      timeout = setTimeout(() => {}, 500) // Pause before typing the next word
    } else if (!isDeleting && displayText === roles[currentRole]) {
      // Start deleting after a pause
      setIsTypingComplete(true)
      timeout = setTimeout(() => {
        setIsTypingComplete(false)
        setIsDeleting(true)
      }, 2000)
    } else {
      // Set typing speed
      const typingSpeed = isDeleting ? 50 : 100

      timeout = setTimeout(() => {
        setDisplayText((prev) => {
          if (isDeleting) {
            return prev.substring(0, prev.length - 1)
          } else {
            return roles[currentRole].substring(0, prev.length + 1)
          }
        })
      }, typingSpeed)
    }

    return () => clearTimeout(timeout)
  }, [displayText, currentRole, isDeleting, roles])

  return (
    <div className="h-16 flex items-center">
      <span className="block mt-2 text-white">
        I'm a{" "}
        <AnimatePresence mode="wait">
          <motion.span
            key={displayText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400 inline-block"
          >
            {displayText}
          </motion.span>
        </AnimatePresence>
        <span
          className={`ml-1 inline-block w-1 h-8 bg-amber-400 ${isTypingComplete ? "opacity-0" : "animate-blink"}`}
        ></span>
      </span>
    </div>
  )
}
