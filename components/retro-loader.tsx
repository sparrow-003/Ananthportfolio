"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function RetroLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)

  const loadingMessages = [
    "INITIALIZING SYSTEM...",
    "LOADING NEURAL NETWORKS...",
    "CONNECTING TO AI MATRIX...",
    "CALIBRATING PROMPT ENGINE...",
    "OPTIMIZING ALGORITHMS...",
    "PREPARING DIGITAL EXPERIENCE...",
    "SYSTEM READY...",
  ]

  useEffect(() => {
    // Fast loading from 1 to 100
    const loadingInterval = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.random() * 8 + 2 // Random increment between 2-10
        const newProgress = Math.min(prev + increment, 100)

        // Change message based on progress
        const messageIndex = Math.floor((newProgress / 100) * (loadingMessages.length - 1))
        setCurrentMessage(messageIndex)

        if (newProgress >= 100) {
          clearInterval(loadingInterval)
          setTimeout(() => setShowWelcome(true), 500)
          setTimeout(() => onComplete(), 3000)
        }

        return newProgress
      })
    }, 80) // Fast updates every 80ms

    return () => clearInterval(loadingInterval)
  }, [onComplete, loadingMessages.length])

  return (
    <div className="retro-loader-container">
      {/* Enhanced Background Motion */}
      <div className="retro-background">
        <div className="grid-overlay"></div>
        <div className="scanning-lines"></div>
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`particle particle-${i}`}></div>
          ))}
        </div>
        <div className="energy-waves">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
        </div>
      </div>

      <div className="retro-content">
        <AnimatePresence mode="wait">
          {!showWelcome ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="loading-section"
            >
              {/* Retro Terminal Header */}
              <div className="terminal-header">
                <div className="terminal-buttons">
                  <span className="btn red"></span>
                  <span className="btn yellow"></span>
                  <span className="btn green"></span>
                </div>
                <div className="terminal-title">ANANTH.N SYSTEM v2.0</div>
              </div>

              {/* Progress Counter */}
              <div className="progress-display">
                <motion.div
                  className="progress-number"
                  key={Math.floor(progress)}
                  initial={{ scale: 1.2, color: "#00ff00" }}
                  animate={{ scale: 1, color: "#ffffff" }}
                  transition={{ duration: 0.1 }}
                >
                  {Math.floor(progress)}%
                </motion.div>
              </div>

              {/* Progress Bar */}
              <div className="progress-container">
                <div className="progress-bar-bg">
                  <motion.div
                    className="progress-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                  <div className="progress-glow"></div>
                </div>
                <div className="progress-brackets">
                  <span>[</span>
                  <div className="progress-dots">
                    {[...Array(20)].map((_, i) => (
                      <span key={i} className={`dot ${i < (progress / 5) ? "active" : ""}`}>
                        ■
                      </span>
                    ))}
                  </div>
                  <span>]</span>
                </div>
              </div>

              {/* Loading Message */}
              <motion.div
                className="loading-message"
                key={currentMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="message-cursor">&gt;</span>
                <span className="message-text">{loadingMessages[currentMessage]}</span>
                <span className="blinking-cursor">_</span>
              </motion.div>

              {/* System Info */}
              <div className="system-info">
                <div className="info-line">
                  <span>CPU:</span> <span className="value">AI-CORE-9000</span>
                </div>
                <div className="info-line">
                  <span>RAM:</span> <span className="value">∞ GB NEURAL</span>
                </div>
                <div className="info-line">
                  <span>GPU:</span> <span className="value">PROMPT-ENGINE-X</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 1, type: "spring", stiffness: 100 }}
              className="welcome-section"
            >
              <div className="welcome-container">
                <motion.div
                  className="welcome-title"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  ANANTH.N
                </motion.div>

                <motion.div
                  className="welcome-subtitle"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <span className="role-bracket">[</span>
                  <span className="role-text">PROMPT ENGINEER</span>
                  <span className="role-bracket">]</span>
                </motion.div>

                <motion.div
                  className="welcome-tagline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  SYSTEM INITIALIZED • READY FOR INNOVATION
                </motion.div>

                <motion.div
                  className="access-granted"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
                >
                  ACCESS GRANTED
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
