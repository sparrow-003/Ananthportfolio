"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { Text, OrbitControls, Sphere, Box, Torus } from "@react-three/drei"
import type * as THREE from "three"

// 3D Floating Objects Component
function FloatingObjects() {
  const groupRef = useRef<THREE.Group>(null)
  const sphereRef = useRef<THREE.Mesh>(null)
  const boxRef = useRef<THREE.Mesh>(null)
  const torusRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1
    }
    if (sphereRef.current) {
      sphereRef.current.rotation.x = clock.getElapsedTime() * 0.5
      sphereRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.5
    }
    if (boxRef.current) {
      boxRef.current.rotation.z = clock.getElapsedTime() * 0.3
      boxRef.current.position.x = Math.cos(clock.getElapsedTime()) * 2
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = clock.getElapsedTime() * 0.4
      torusRef.current.rotation.y = clock.getElapsedTime() * 0.2
      torusRef.current.position.z = Math.sin(clock.getElapsedTime() * 0.5) * 1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Floating Sphere */}
      <Sphere ref={sphereRef} args={[0.5, 32, 32]} position={[-2, 0, 0]}>
        <meshStandardMaterial color="#00ff00" wireframe transparent opacity={0.6} />
      </Sphere>

      {/* Floating Box */}
      <Box ref={boxRef} args={[0.8, 0.8, 0.8]} position={[2, 1, -1]}>
        <meshStandardMaterial color="#0099ff" wireframe transparent opacity={0.7} />
      </Box>

      {/* Floating Torus */}
      <Torus ref={torusRef} args={[0.6, 0.2, 16, 100]} position={[0, -1, 1]}>
        <meshStandardMaterial color="#ff0099" wireframe transparent opacity={0.5} />
      </Torus>

      {/* Ambient Light */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00ff00" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0099ff" />
    </group>
  )
}

// 3D Text Component
function HackerText({ progress }: { progress: number }) {
  const textRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1
      textRef.current.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.1
    }
  })

  return (
    <Text
      ref={textRef}
      position={[0, 0, 0]}
      fontSize={1.5}
      color="#00ff00"
      anchorX="center"
      anchorY="middle"
      font="/fonts/Geist-Bold.ttf"
    >
      ANANTH.N
      <meshStandardMaterial color="#00ff00" emissive="#003300" />
    </Text>
  )
}

export function Hacker3DLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [showMatrix, setShowMatrix] = useState(true)
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const [showWelcome, setShowWelcome] = useState(false)
  const matrixRef = useRef<HTMLDivElement>(null)

  const hackingPhases = [
    "INITIALIZING NEURAL NETWORK...",
    "CONNECTING TO MAINFRAME...",
    "BYPASSING SECURITY PROTOCOLS...",
    "ACCESSING AI MATRIX...",
    "DECRYPTING DATA STREAMS...",
    "LOADING QUANTUM ALGORITHMS...",
    "ESTABLISHING SECURE CONNECTION...",
    "CALIBRATING PROMPT ENGINE...",
    "OPTIMIZING NEURAL PATHWAYS...",
    "SYSTEM BREACH SUCCESSFUL...",
    "WELCOME TO THE MATRIX...",
  ]

  const terminalCommands = [
    "> ssh root@ananth-matrix.dev",
    "Password: ****************",
    "Access granted. Welcome, Neo.",
    "> cd /home/ananth/projects",
    "> ls -la",
    "drwxr-xr-x ai-projects/",
    "drwxr-xr-x neural-networks/",
    "drwxr-xr-x quantum-algorithms/",
    "-rw-r--r-- portfolio.exe",
    "> ./portfolio.exe --initialize",
    "Loading AI consciousness...",
    "Neural pathways: ACTIVE",
    "Quantum state: ENTANGLED",
    "Reality.exe has stopped working",
    "Switching to Matrix mode...",
    "Welcome to the real world.",
  ]

  // Matrix Rain Effect
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

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01"
    const charArray = chars.split("")
    const fontSize = 14
    const columns = canvas.width / fontSize

    const drops: number[] = []
    for (let i = 0; i < columns; i++) {
      drops[i] = 1
    }

    function drawMatrix() {
      if (!ctx) return

      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#00ff00"
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(drawMatrix, 50)

    return () => {
      clearInterval(interval)
      if (matrixRef.current && canvas.parentNode) {
        matrixRef.current.removeChild(canvas)
      }
    }
  }, [showMatrix])

  // Progress and Phase Management
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.random() * 3 + 1
        const newProgress = Math.min(prev + increment, 100)

        // Update phase based on progress
        const phaseIndex = Math.floor((newProgress / 100) * (hackingPhases.length - 1))
        setCurrentPhase(phaseIndex)

        if (newProgress >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => {
            setShowMatrix(false)
            setShowWelcome(true)
          }, 1000)
          setTimeout(() => onComplete(), 4000)
        }

        return newProgress
      })
    }, 150)

    return () => clearInterval(progressInterval)
  }, [onComplete, hackingPhases.length])

  // Terminal Animation
  useEffect(() => {
    if (progress < 50) return

    let lineIndex = 0
    const terminalInterval = setInterval(() => {
      if (lineIndex < terminalCommands.length) {
        setTerminalLines((prev) => [...prev, terminalCommands[lineIndex]])
        lineIndex++
      } else {
        clearInterval(terminalInterval)
      }
    }, 200)

    return () => clearInterval(terminalInterval)
  }, [progress, terminalCommands])

  return (
    <div className="hacker-loader-container">
      {/* Matrix Rain Background */}
      {showMatrix && <div ref={matrixRef} className="matrix-background" />}

      {/* 3D Scene */}
      <div className="scene-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <color attach="background" args={["#000000"]} />
          <fog attach="fog" args={["#000000", 5, 15]} />

          <FloatingObjects />
          <HackerText progress={progress} />

          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Hacker UI Overlay */}
      <div className="hacker-ui-overlay">
        <AnimatePresence mode="wait">
          {!showWelcome ? (
            <motion.div
              key="hacking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hacking-interface"
            >
              {/* Top Status Bar */}
              <div className="status-bar">
                <div className="status-item">
                  <span className="status-label">STATUS:</span>
                  <span className="status-value online">ONLINE</span>
                </div>
                <div className="status-item">
                  <span className="status-label">SECURITY:</span>
                  <span className="status-value warning">BYPASSED</span>
                </div>
                <div className="status-item">
                  <span className="status-label">CONNECTION:</span>
                  <span className="status-value secure">ENCRYPTED</span>
                </div>
              </div>

              {/* Main Progress Display */}
              <div className="main-display">
                <div className="progress-section">
                  <div className="progress-header">
                    <span className="system-name">ANANTH.N NEURAL SYSTEM</span>
                    <span className="progress-percent">{Math.floor(progress)}%</span>
                  </div>

                  <div className="progress-bar-container">
                    <div className="progress-bar-bg">
                      <motion.div
                        className="progress-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                      <div className="progress-scanner"></div>
                    </div>
                  </div>

                  <div className="current-phase">
                    <span className="phase-indicator">&gt;</span>
                    <motion.span
                      key={currentPhase}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="phase-text"
                    >
                      {hackingPhases[currentPhase]}
                    </motion.span>
                    <span className="cursor-blink">_</span>
                  </div>
                </div>

                {/* System Stats */}
                <div className="system-stats">
                  <div className="stat-row">
                    <span>CPU:</span>
                    <span className="stat-value">QUANTUM-CORE-X</span>
                  </div>
                  <div className="stat-row">
                    <span>RAM:</span>
                    <span className="stat-value">∞ TB NEURAL</span>
                  </div>
                  <div className="stat-row">
                    <span>GPU:</span>
                    <span className="stat-value">AI-MATRIX-9000</span>
                  </div>
                  <div className="stat-row">
                    <span>NET:</span>
                    <span className="stat-value">QUANTUM-LINK</span>
                  </div>
                </div>
              </div>

              {/* Terminal Window */}
              {progress > 50 && (
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="terminal-window">
                  <div className="terminal-header">
                    <div className="terminal-buttons">
                      <span className="btn red"></span>
                      <span className="btn yellow"></span>
                      <span className="btn green"></span>
                    </div>
                    <span className="terminal-title">root@matrix:~$</span>
                  </div>
                  <div className="terminal-content">
                    {terminalLines.map((line, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="terminal-line"
                      >
                        {line}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Glitch Effects */}
              <div className="glitch-overlay">
                <div className="glitch-line glitch-1"></div>
                <div className="glitch-line glitch-2"></div>
                <div className="glitch-line glitch-3"></div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 1.5, type: "spring" }}
              className="welcome-screen"
            >
              <div className="welcome-content">
                <motion.div
                  className="welcome-title"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 1 }}
                >
                  WELCOME TO THE MATRIX
                </motion.div>

                <motion.div
                  className="welcome-subtitle"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 1 }}
                >
                  ANANTH.N - AI ARCHITECT
                </motion.div>

                <motion.div
                  className="welcome-message"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  REALITY IS JUST CODE WAITING TO BE REWRITTEN
                </motion.div>

                <motion.div
                  className="access-granted"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.8, type: "spring" }}
                >
                  ACCESS GRANTED • ENTERING PORTFOLIO
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scan Lines Effect */}
      <div className="scan-lines"></div>

      {/* Vignette Effect */}
      <div className="vignette"></div>
    </div>
  )
}
