"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { Text, OrbitControls, Sphere, Box, Torus, Stars } from "@react-three/drei"
import { Crown, Zap, Star, Award, Trophy, Target, Briefcase, Phone, Mail } from "lucide-react"
import type * as THREE from "three"

// 3D Elite Objects Component
function EliteFloatingObjects() {
  const groupRef = useRef<THREE.Group>(null)
  const sphereRef = useRef<THREE.Mesh>(null)
  const boxRef = useRef<THREE.Mesh>(null)
  const torusRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.08
    }
    if (sphereRef.current) {
      sphereRef.current.rotation.x = clock.getElapsedTime() * 0.4
      sphereRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.6
    }
    if (boxRef.current) {
      boxRef.current.rotation.z = clock.getElapsedTime() * 0.25
      boxRef.current.position.x = Math.cos(clock.getElapsedTime() * 0.6) * 2.2
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = clock.getElapsedTime() * 0.35
      torusRef.current.rotation.y = clock.getElapsedTime() * 0.15
      torusRef.current.position.z = Math.sin(clock.getElapsedTime() * 0.4) * 1.2
    }
  })

  return (
    <group ref={groupRef}>
      {/* Elite Blue Sphere */}
      <Sphere ref={sphereRef} args={[0.6, 32, 32]} position={[-2.5, 0, 0]}>
        <meshStandardMaterial color="#0066ff" wireframe transparent opacity={0.8} />
      </Sphere>

      {/* Luxury Black Box */}
      <Box ref={boxRef} args={[0.9, 0.9, 0.9]} position={[2.5, 1.2, -1.2]}>
        <meshStandardMaterial color="#000000" wireframe transparent opacity={0.9} />
      </Box>

      {/* Premium Blue Torus */}
      <Torus ref={torusRef} args={[0.7, 0.25, 16, 100]} position={[0, -1.2, 1.2]}>
        <meshStandardMaterial color="#00bfff" wireframe transparent opacity={0.7} />
      </Torus>

      {/* Elite Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[12, 12, 12]} intensity={1.2} color="#0066ff" />
      <pointLight position={[-12, -12, -12]} intensity={0.8} color="#00bfff" />
      <pointLight position={[0, 0, 15]} intensity={0.6} color="#ffffff" />
    </group>
  )
}

// 3D Elite Text Component
function EliteHackerText({ progress }: { progress: number }) {
  const textRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.08
      textRef.current.position.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.12
    }
  })

  return (
    <Text
      ref={textRef}
      position={[0, 0, 0]}
      fontSize={1.8}
      color="#0066ff"
      anchorX="center"
      anchorY="middle"
      font="/fonts/Geist-Bold.ttf"
    >
      ANANTH.N
      <meshStandardMaterial color="#0066ff" emissive="#001133" emissiveIntensity={0.5} />
    </Text>
  )
}

export function EliteHacker3DLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [showMatrix, setShowMatrix] = useState(true)
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const [showCongratulations, setShowCongratulations] = useState(false)
  const [showCallToAction, setShowCallToAction] = useState(false)
  const matrixRef = useRef<HTMLDivElement>(null)

  const eliteHackingPhases = [
    "INITIALIZING ELITE NEURAL MATRIX...",
    "CONNECTING TO PREMIUM SERVERS...",
    "AUTHENTICATING LUXURY PROTOCOLS...",
    "ACCESSING EXECUTIVE AI SYSTEMS...",
    "DECRYPTING PREMIUM DATA STREAMS...",
    "LOADING QUANTUM ALGORITHMS...",
    "ESTABLISHING SECURE VIP CONNECTION...",
    "CALIBRATING ELITE PROMPT ENGINE...",
    "OPTIMIZING NEURAL PATHWAYS...",
    "ACTIVATING PREMIUM FEATURES...",
    "ELITE SYSTEM BREACH SUCCESSFUL...",
    "WELCOME TO THE EXECUTIVE MATRIX...",
  ]

  const eliteTerminalCommands = [
    "> ssh elite@ananth-executive.matrix",
    "Password: ******************",
    "🔐 VIP Access Granted. Welcome, Executive.",
    "> cd /premium/ananth/portfolio",
    "> ls -la --executive",
    "drwxr-xr-x elite-ai-projects/",
    "drwxr-xr-x quantum-neural-networks/",
    "drwxr-xr-x premium-algorithms/",
    "drwxr-xr-x executive-solutions/",
    "-rwxr-xr-x elite-portfolio.exe",
    "> ./elite-portfolio.exe --vip-mode",
    "🚀 Loading Executive AI Consciousness...",
    "💎 Neural pathways: PREMIUM ACTIVE",
    "⚡ Quantum state: ELITE ENTANGLED",
    "🏆 Executive.exe initialized successfully",
    "🎯 Switching to VIP Matrix mode...",
    "👑 Welcome to Elite Digital Excellence.",
  ]

  // Elite Matrix Rain Effect
  useEffect(() => {
    if (!showMatrix || !matrixRef.current) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.position = "absolute"
    canvas.style.top = "0"
    canvas.style.left = "0"
    canvas.style.zIndex = "1"
    canvas.style.pointerEvents = "none"

    matrixRef.current.appendChild(canvas)

    const chars = "ANANTH.N★ELITE★AI★PREMIUM★VIP★EXECUTIVE★LUXURY★01"
    const charArray = chars.split("")
    const fontSize = 16
    const columns = canvas.width / fontSize

    const drops: number[] = []
    for (let i = 0; i < columns; i++) {
      drops[i] = 1
    }

    function drawEliteMatrix() {
      if (!ctx) return

      ctx.fillStyle = "rgba(0, 0, 0, 0.04)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Blue gradient for elite effect
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#0066ff")
      gradient.addColorStop(0.5, "#00bfff")
      gradient.addColorStop(1, "#0044cc")

      ctx.fillStyle = gradient
      ctx.font = `${fontSize}px 'Courier New', monospace`
      ctx.fontWeight = "bold"

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)]

        // Add glow effect
        ctx.shadowColor = "#0066ff"
        ctx.shadowBlur = 10

        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(drawEliteMatrix, 60)

    return () => {
      clearInterval(interval)
      if (matrixRef.current && canvas.parentNode) {
        matrixRef.current.removeChild(canvas)
      }
    }
  }, [showMatrix])

  // Elite Progress Management
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.random() * 2.5 + 1.5
        const newProgress = Math.min(prev + increment, 100)

        const phaseIndex = Math.floor((newProgress / 100) * (eliteHackingPhases.length - 1))
        setCurrentPhase(phaseIndex)

        if (newProgress >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => {
            setShowMatrix(false)
            setShowCongratulations(true)
          }, 1200)
          setTimeout(() => {
            setShowCongratulations(false)
            setShowCallToAction(true)
          }, 4000)
          setTimeout(() => onComplete(), 8000)
        }

        return newProgress
      })
    }, 120)

    return () => clearInterval(progressInterval)
  }, [onComplete, eliteHackingPhases.length])

  // Elite Terminal Animation
  useEffect(() => {
    if (progress < 40) return

    let lineIndex = 0
    const terminalInterval = setInterval(() => {
      if (lineIndex < eliteTerminalCommands.length) {
        setTerminalLines((prev) => [...prev, eliteTerminalCommands[lineIndex]])
        lineIndex++
      } else {
        clearInterval(terminalInterval)
      }
    }, 180)

    return () => clearInterval(terminalInterval)
  }, [progress, eliteTerminalCommands])

  const handleHireMe = () => {
    const subject = "🚀 URGENT: Elite AI Developer Available - Ananth N."
    const body = `Dear Hiring Manager,

🎯 I've just discovered an EXCEPTIONAL AI talent that could revolutionize your team!

👑 ANANTH N. - Elite AI Developer & Prompt Engineer

🔥 Why You Need Him NOW:
✅ Expert in cutting-edge AI & Machine Learning
✅ Master of Prompt Engineering & Neural Networks  
✅ Full-stack development with modern tech stack
✅ Proven track record of delivering premium solutions
✅ Ready to transform your digital presence

💎 This is a RARE opportunity to secure top-tier talent before competitors do.

📞 Let's schedule an immediate interview: +91 6384227309
📧 Direct contact: thanan757@gmail.com

⚡ Don't let this elite developer slip away to your competition!

Best regards,
[Your Name]

P.S. His portfolio demonstrates the exact innovation your company needs to stay ahead.`

    const mailtoLink = `mailto:thanan757@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  }

  const handleCallNow = () => {
    window.location.href = "tel:+916384227309"
  }

  return (
    <div className="elite-hacker-loader-container">
      {/* Elite Matrix Background */}
      {showMatrix && <div ref={matrixRef} className="elite-matrix-background" />}

      {/* 3D Elite Scene */}
      <div className="elite-scene-container">
        <Canvas camera={{ position: [0, 0, 6], fov: 75 }}>
          <color attach="background" args={["#000000"]} />
          <fog attach="fog" args={["#000011", 6, 18]} />
          <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

          <EliteFloatingObjects />
          <EliteHackerText progress={progress} />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
            enableDamping
            dampingFactor={0.05}
          />
        </Canvas>
      </div>

      {/* Elite UI Overlay */}
      <div className="elite-hacker-ui-overlay">
        <AnimatePresence mode="wait">
          {showMatrix && !showCongratulations && !showCallToAction && (
            <motion.div
              key="hacking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="elite-hacking-interface"
            >
              {/* Elite Status Bar */}
              <div className="elite-status-bar">
                <div className="elite-status-item">
                  <Crown size={16} className="text-blue-400" />
                  <span className="elite-status-label">STATUS:</span>
                  <span className="elite-status-value elite-online">VIP ONLINE</span>
                </div>
                <div className="elite-status-item">
                  <Zap size={16} className="text-blue-400" />
                  <span className="elite-status-label">SECURITY:</span>
                  <span className="elite-status-value elite-premium">PREMIUM</span>
                </div>
                <div className="elite-status-item">
                  <Star size={16} className="text-blue-400" />
                  <span className="elite-status-label">ACCESS:</span>
                  <span className="elite-status-value elite-executive">EXECUTIVE</span>
                </div>
              </div>

              {/* Elite Main Display */}
              <div className="elite-main-display">
                <div className="elite-progress-section">
                  <div className="elite-progress-header">
                    <div className="elite-system-branding">
                      <Crown size={24} className="text-blue-400" />
                      <span className="elite-system-name">ANANTH.N ELITE NEURAL SYSTEM</span>
                      <Star size={20} className="text-blue-400" />
                    </div>
                    <div className="elite-progress-display">
                      <span className="elite-progress-percent">{Math.floor(progress)}%</span>
                      <span className="elite-progress-label">PREMIUM</span>
                    </div>
                  </div>

                  <div className="elite-progress-bar-container">
                    <div className="elite-progress-bar-bg">
                      <motion.div
                        className="elite-progress-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                      <div className="elite-progress-scanner"></div>
                      <div className="elite-progress-glow"></div>
                    </div>
                  </div>

                  <div className="elite-current-phase">
                    <span className="elite-phase-indicator">👑</span>
                    <motion.span
                      key={currentPhase}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="elite-phase-text"
                    >
                      {eliteHackingPhases[currentPhase]}
                    </motion.span>
                    <span className="elite-cursor-blink">▋</span>
                  </div>
                </div>

                {/* Elite System Stats */}
                <div className="elite-system-stats">
                  <div className="elite-stats-header">
                    <Trophy size={20} className="text-blue-400" />
                    <span>ELITE SPECIFICATIONS</span>
                  </div>
                  <div className="elite-stat-row">
                    <span>CPU:</span>
                    <span className="elite-stat-value">QUANTUM-ELITE-X</span>
                  </div>
                  <div className="elite-stat-row">
                    <span>RAM:</span>
                    <span className="elite-stat-value">∞ TB PREMIUM</span>
                  </div>
                  <div className="elite-stat-row">
                    <span>GPU:</span>
                    <span className="elite-stat-value">AI-MATRIX-ELITE</span>
                  </div>
                  <div className="elite-stat-row">
                    <span>NET:</span>
                    <span className="elite-stat-value">QUANTUM-VIP-LINK</span>
                  </div>
                  <div className="elite-stat-row">
                    <span>STATUS:</span>
                    <span className="elite-stat-value">EXECUTIVE READY</span>
                  </div>
                </div>
              </div>

              {/* Elite Terminal Window */}
              {progress > 40 && (
                <motion.div
                  initial={{ opacity: 0, y: 60, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="elite-terminal-window"
                >
                  <div className="elite-terminal-header">
                    <div className="elite-terminal-buttons">
                      <span className="elite-btn elite-red"></span>
                      <span className="elite-btn elite-yellow"></span>
                      <span className="elite-btn elite-green"></span>
                    </div>
                    <span className="elite-terminal-title">
                      <Crown size={14} className="inline mr-1" />
                      elite@ananth-matrix:~$
                    </span>
                  </div>
                  <div className="elite-terminal-content">
                    {terminalLines.map((line, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="elite-terminal-line"
                      >
                        {line}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Elite Congratulations Screen */}
          {showCongratulations && (
            <motion.div
              key="congratulations"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1.2, type: "spring" }}
              className="elite-congratulations-screen"
            >
              <div className="elite-congratulations-content">
                <motion.div
                  className="elite-congratulations-icon"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                >
                  <Trophy size={80} className="text-blue-400" />
                </motion.div>

                <motion.div
                  className="elite-congratulations-title"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  CONGRATULATIONS!
                </motion.div>

                <motion.div
                  className="elite-congratulations-subtitle"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 1 }}
                >
                  You've Discovered Elite Talent
                </motion.div>

                <motion.div
                  className="elite-congratulations-message"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  🎯 ANANTH N. - Premium AI Developer Ready for Your Team
                </motion.div>

                <motion.div
                  className="elite-achievement-badges"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, duration: 0.8 }}
                >
                  <div className="elite-badge">
                    <Award size={24} />
                    <span>AI Expert</span>
                  </div>
                  <div className="elite-badge">
                    <Star size={24} />
                    <span>Elite Quality</span>
                  </div>
                  <div className="elite-badge">
                    <Crown size={24} />
                    <span>Premium Ready</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Elite Call to Action Screen */}
          {showCallToAction && (
            <motion.div
              key="cta"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1, type: "spring" }}
              className="elite-cta-screen"
            >
              <div className="elite-cta-content">
                <motion.div
                  className="elite-cta-header"
                  initial={{ y: -40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  <Target size={60} className="text-blue-400 mb-4" />
                  <h1 className="elite-cta-title">DON'T LET THIS TALENT ESCAPE!</h1>
                  <p className="elite-cta-subtitle">Secure Elite AI Developer - Ananth N.</p>
                </motion.div>

                <motion.div
                  className="elite-cta-features"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <div className="elite-feature">
                    <Zap className="text-blue-400" />
                    <span>Expert AI & Prompt Engineering</span>
                  </div>
                  <div className="elite-feature">
                    <Crown className="text-blue-400" />
                    <span>Premium Full-Stack Development</span>
                  </div>
                  <div className="elite-feature">
                    <Star className="text-blue-400" />
                    <span>Cutting-Edge Tech Solutions</span>
                  </div>
                  <div className="elite-feature">
                    <Trophy className="text-blue-400" />
                    <span>Proven Track Record</span>
                  </div>
                </motion.div>

                <motion.div
                  className="elite-cta-urgency"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <div className="elite-urgency-text">
                    ⚡ URGENT: Your competitors are also looking for top AI talent!
                  </div>
                </motion.div>

                <motion.div
                  className="elite-cta-actions"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  <button onClick={handleHireMe} className="elite-cta-primary">
                    <Mail size={20} />
                    HIRE ME NOW - SEND EMAIL
                    <span className="elite-cta-arrow">→</span>
                  </button>

                  <button onClick={handleCallNow} className="elite-cta-secondary">
                    <Phone size={20} />
                    CALL IMMEDIATELY
                    <span className="elite-phone">+91 6384227309</span>
                  </button>
                </motion.div>

                <motion.div
                  className="elite-cta-guarantee"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.8 }}
                >
                  <Briefcase size={24} className="text-blue-400" />
                  <span>100% Ready to Start • Available for Immediate Hiring</span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Elite Effects */}
      <div className="elite-scan-lines"></div>
      <div className="elite-vignette"></div>
      <div className="elite-glow-overlay"></div>
    </div>
  )
}
