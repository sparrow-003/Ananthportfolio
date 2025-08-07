"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, Stars } from "@react-three/drei"
import type * as THREE from "three"

export function HeroScene() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1
    }
  })

  return (
    <>
      <color attach="background" args={["#050010"]} />
      <fog attach="fog" args={["#050010", 5, 20]} />
      <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />

      <group ref={groupRef}>
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[-3, -1, -5]}>
            <octahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial color="#9333ea" wireframe transparent opacity={0.5} />
          </mesh>
        </Float>

        <Float speed={1.2} rotationIntensity={0.8} floatIntensity={0.5}>
          <mesh position={[3, 2, -10]}>
            <dodecahedronGeometry args={[2, 0]} />
            <meshStandardMaterial color="#fbbf24" wireframe transparent opacity={0.3} />
          </mesh>
        </Float>

        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
          <mesh position={[-5, 3, -15]}>
            <icosahedronGeometry args={[3, 0]} />
            <meshStandardMaterial color="#9333ea" wireframe transparent opacity={0.2} />
          </mesh>
        </Float>
      </group>
    </>
  )
}
