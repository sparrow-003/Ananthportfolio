"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function Loader() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 10
        return newProgress >= 100 ? 100 : newProgress
      })
    }, 150)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-amber-300 to-purple-600">
          ANANTH.N
        </div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-0.5 bg-gradient-to-r from-purple-400 via-amber-300 to-purple-600 mt-2"
        />
        <div className="text-right text-xs text-gray-400 mt-1">{Math.round(progress)}%</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute bottom-8 text-sm text-gray-400"
      >
        Crafting Digital Excellence
      </motion.div>
    </div>
  )
}
