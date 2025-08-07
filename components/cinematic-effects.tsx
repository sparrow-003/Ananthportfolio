"use client"

import { useEffect, useState } from "react"

export function CinematicEffects() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Cinematic cursor effect (desktop only)
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobile) {
        setMousePosition({ x: e.clientX, y: e.clientY })
      }
    }

    // Create particles with responsive count
    const createParticles = () => {
      const particlesContainer = document.createElement("div")
      particlesContainer.className = "particles-container"
      document.body.appendChild(particlesContainer)

      const particleCount = isMobile ? 20 : 50

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div")
        particle.className = "particle"
        particle.style.left = Math.random() * 100 + "%"
        particle.style.width = Math.random() * 4 + 2 + "px"
        particle.style.height = particle.style.width
        particle.style.animationDelay = Math.random() * 20 + "s"
        particlesContainer.appendChild(particle)
      }
    }

    // Create matrix rain effect with responsive density
    const createMatrixRain = () => {
      const matrixContainer = document.createElement("div")
      matrixContainer.className = "matrix-rain"
      document.body.appendChild(matrixContainer)

      const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリ���レロワヲン"
      const columnCount = isMobile ? 10 : 20

      for (let i = 0; i < columnCount; i++) {
        const column = document.createElement("div")
        column.style.position = "absolute"
        column.style.left = i * (100 / columnCount) + "%"
        column.style.top = "0"

        const charCount = isMobile ? 10 : 20
        for (let j = 0; j < charCount; j++) {
          const char = document.createElement("div")
          char.className = "matrix-char"
          char.textContent = chars[Math.floor(Math.random() * chars.length)]
          char.style.animationDelay = Math.random() * 10 + "s"
          char.style.top = j * 20 + "px"
          column.appendChild(char)
        }

        matrixContainer.appendChild(column)
      }
    }

    // Intersection Observer for scroll animations
    const observeElements = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible")
            }
          })
        },
        { threshold: isMobile ? 0.05 : 0.1 },
      )

      document.querySelectorAll(".section-fade-in").forEach((el) => {
        observer.observe(el)
      })
    }

    // Scroll progress indicator
    const updateScrollProgress = () => {
      const scrollProgress = document.querySelector(".scroll-indicator") as HTMLElement
      if (scrollProgress) {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        scrollProgress.style.transform = `scaleX(${scrollPercent / 100})`
      }
    }

    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove)
    }

    window.addEventListener("scroll", updateScrollProgress)
    createParticles()
    createMatrixRain()
    observeElements()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", updateScrollProgress)
      window.removeEventListener("resize", checkMobile)
    }
  }, [isMobile])

  return (
    <>
      {/* Cinematic Cursor (Desktop Only) */}
      {!isMobile && (
        <div
          className="cinematic-cursor"
          style={{
            left: mousePosition.x - 10,
            top: mousePosition.y - 10,
          }}
        />
      )}

      {/* Scroll Progress Indicator */}
      <div className="scroll-indicator" />
    </>
  )
}
