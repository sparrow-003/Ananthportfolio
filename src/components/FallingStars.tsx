import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Stars, Float, Points, PointMaterial } from '@react-three/drei';
import { useAnimationPreference } from '@/contexts/AnimationContext';

const METEOR_COLORS = [
  '#a6c9ff', '#fff4e8', '#28c7fa', '#ffffff', '#ff6b6b', '#c084fc',
  '#fbbf24', '#34d399',
];

// Galaxy Constants
const GALAXY_COUNT = 30000;
const GALAXY_RADIUS = 35;
const GALAXY_BRANCHES = 4;
const GALAXY_SPIN = 1.2;
const GALAXY_RANDOMNESS = 0.45;
const GALAXY_RANDOMNESS_POWER = 3;
const GALAXY_INSIDE_COLOR = '#ff6030';
const GALAXY_OUTSIDE_COLOR = '#1b3984';

// High-fidelity Spiral Galaxy with Star Flow
const SpiralGalaxy = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const { clock } = useThree();
  
  const [positions, colors, randoms] = useMemo(() => {
    const positions = new Float32Array(GALAXY_COUNT * 3);
    const colors = new Float32Array(GALAXY_COUNT * 3);
    const randoms = new Float32Array(GALAXY_COUNT);

    const colorInside = new THREE.Color(GALAXY_INSIDE_COLOR);
    const colorOutside = new THREE.Color(GALAXY_OUTSIDE_COLOR);

    for (let i = 0; i < GALAXY_COUNT; i++) {
      const i3 = i * 3;

      const radius = Math.random() * GALAXY_RADIUS;
      const spinAngle = radius * GALAXY_SPIN;
      const branchAngle = ((i % GALAXY_BRANCHES) / GALAXY_BRANCHES) * Math.PI * 2;

      const randomX = Math.pow(Math.random(), GALAXY_RANDOMNESS_POWER) * (Math.random() < 0.5 ? 1 : -1) * GALAXY_RANDOMNESS * radius;
      const randomY = Math.pow(Math.random(), GALAXY_RANDOMNESS_POWER) * (Math.random() < 0.5 ? 1 : -1) * GALAXY_RANDOMNESS * radius;
      const randomZ = Math.pow(Math.random(), GALAXY_RANDOMNESS_POWER) * (Math.random() < 0.5 ? 1 : -1) * GALAXY_RANDOMNESS * radius;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY * 0.4;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / GALAXY_RADIUS);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
      
      randoms[i] = Math.random();
    }

    return [positions, colors, randoms];
  }, []);

  useFrame((_s, delta) => {
    if (pointsRef.current) {
      const time = _s.clock.getElapsedTime();
      
      // Dynamic base rotation (slightly faster)
      pointsRef.current.rotation.y += delta * 0.08;
      
      // Scroll-based tilt and rotation
      const scrollY = window.scrollY;
      const targetRotationX = Math.PI / 6 + (scrollY * 0.00025);
      const targetRotationZ = (scrollY * 0.00015);
      
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, targetRotationX, 0.05);
      pointsRef.current.rotation.z = THREE.MathUtils.lerp(pointsRef.current.rotation.z, targetRotationZ, 0.05);
      
      // Twinkle effect using material size oscillation
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      if (mat && 'size' in mat) {
        mat.size = 0.12 + Math.sin(time * 2) * 0.02;
      }
      
      // Subtle position float
      pointsRef.current.position.y = Math.sin(time * 0.5) * 0.3;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        transparent
        vertexColors
        size={0.12}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </Points>
  );
};

// Galaxy Core Glow - More intense and "hot"
const GalaxyCore = () => {
  return (
    <group>
      {/* Central bright core */}
      <mesh>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      {/* Inner glow */}
      <mesh scale={[3.2, 2.5, 3.2]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#ffd8aa" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Atmospheric blue halo */}
      <mesh scale={[6, 4, 6]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial color="#3366ff" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </mesh>
      <pointLight intensity={8} color="#ffd27a" distance={50} />
    </group>
  );
};

// Nebula — using more dust-like particles for "Milky Way" look
const Nebula = () => {
  const meshRef = useRef<THREE.Group>(null);
  useFrame((_s, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * 0.008;
      meshRef.current.rotation.x = Math.sin(_s.clock.getElapsedTime() * 0.2) * 0.05;
    }
  });

  const nebulae = useMemo(() =>
    Array.from({ length: 20 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 140,
        (Math.random() - 0.5) * 120,
        -(25 + Math.random() * 70),
      ] as [number, number, number],
      scale: 20 + Math.random() * 50,
      color: new THREE.Color().setHSL(
        0.58 + Math.random() * 0.12,
        0.7 + Math.random() * 0.2,
        0.1 + Math.random() * 0.05
      ),
      opacity: 0.02 + Math.random() * 0.04,
    })), []);

  return (
    <group ref={meshRef}>
      {nebulae.map((n, i) => (
        <mesh key={i} position={n.position}>
          <sphereGeometry args={[n.scale, 12, 12]} />
          <meshBasicMaterial
            color={n.color} transparent opacity={n.opacity}
            blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

// Upgraded Cinematic Meteor with longer trails
const CinematicMeteor = () => {
  const meshRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const config = useMemo(() => {
    const isRare = Math.random() > 0.9;
    return {
      speed: (isRare ? 1.8 : 0.6) + Math.random() * 0.8,
      size: isRare ? 0.4 : 0.08 + Math.random() * 0.1,
      color: new THREE.Color(METEOR_COLORS[Math.floor(Math.random() * METEOR_COLORS.length)]),
      length: isRare ? 18 : 6 + Math.random() * 6,
      z: -(Math.random() * 20),
      angle: -Math.PI / 4 + (Math.random() - 0.5) * 0.5,
    };
  }, []);

  const posRef = useRef({
    x: (Math.random() - 0.5) * 60,
    y: 30 + Math.random() * 40,
  });

  useFrame((_s, delta) => {
    if (!meshRef.current) return;
    const speed = config.speed * delta * 30;
    posRef.current.x += Math.sin(config.angle) * speed;
    posRef.current.y -= Math.cos(config.angle) * speed;

    if (posRef.current.y < -viewport.height / 2 - 30) {
      posRef.current.y = viewport.height / 2 + 30 + Math.random() * 30;
      posRef.current.x = (Math.random() - 0.5) * viewport.width * 3;
    }
    meshRef.current.position.set(posRef.current.x, posRef.current.y, config.z);
    meshRef.current.rotation.z = config.angle;
  });

  return (
    <group ref={meshRef}>
      <mesh>
        <sphereGeometry args={[config.size, 12, 12]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <mesh position={[0, config.length / 2, 0]}>
        <planeGeometry args={[config.size * 2, config.length]} />
        <meshBasicMaterial 
          color={config.color} 
          transparent 
          opacity={0.8} 
          blending={THREE.AdditiveBlending} 
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

// Background layers
const StarLayers = () => {
  return (
    <>
      <Stars radius={150} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Stars radius={100} depth={50} count={2000} factor={6} saturation={1} fade speed={2} />
    </>
  );
};

const FallingStars = () => {
  const { effectiveMode } = useAnimationPreference();
  if (effectiveMode === 'off') return null;
  
  const meteorCount = effectiveMode === 'full' ? 8 : 4;

  return (
    <>
      <fog attach="fog" args={['#000005', 40, 150]} />
      <ambientLight intensity={0.1} />
      
      <StarLayers />
      <Nebula />
      
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <group position={[0, 0, -15]} rotation={[Math.PI / 6, 0, 0]}>
          <SpiralGalaxy />
          <GalaxyCore />
        </group>
      </Float>

      <group>
        {Array.from({ length: meteorCount }).map((_, i) => (
          <CinematicMeteor key={i} />
        ))}
      </group>
    </>
  );
};

export default FallingStars;

