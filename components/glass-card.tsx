"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
}

export function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      className={`relative p-6 rounded-2xl overflow-hidden ${className}`}
    >
      {/* Glass effect background */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl z-0"></div>

      {/* Gradient border */}
      <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-purple-500/30 via-transparent to-amber-500/30 z-0"></div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
