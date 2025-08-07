"use client"

import { useState, useEffect } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      const checkIfMobile = () => {
        const userAgent = navigator.userAgent.toLowerCase()
        const mobileDevices = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
        setIsMobile(mobileDevices.test(userAgent))
      }

      // Initial check
      checkIfMobile()

      // Add event listener for window resize
      window.addEventListener("resize", checkIfMobile)

      // Cleanup
      return () => {
        window.removeEventListener("resize", checkIfMobile)
      }
    }
  }, [])

  return isMobile
}
