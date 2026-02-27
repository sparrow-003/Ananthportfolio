
import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Stars } from '@react-three/drei';
import { useAnimationPreference } from '@/contexts/AnimationContext';

// -----------------------------------------------------------------------------
// Constants & Configuration
// -----------------------------------------------------------------------------

const METEOR_COLORS = [
  '#a6c9ff', // Pale Blue (Hot)
  '#fff4e8', // White/Yellow (Warm)
  '#28c7fa', // Cyan Neon (Exotic)
  '#ffffff', // Pure White
];

// -----------------------------------------------------------------------------
// Component: CinematicMeteor
// -----------------------------------------------------------------------------

const CinematicMeteor = ({ id }: { id: number }) => {
  const meshRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Initialize meteor properties
  const config = useMemo(() => {
    const isBig = Math.random() > 0.9;
    const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.5;
    return {
      speed: (isBig ? 1.0 : 0.6) + Math.random() * 0.5,
      size: isBig ? 0.2 : 0.08,
      color: new THREE.Color(METEOR_COLORS[Math.floor(Math.random() * METEOR_COLORS.length)]),
      length: isBig ? 8 : 4,
      z: -(Math.random() * 10),
      angle: angle,
    };
  }, []);

  const posRef = useRef({
    x: (Math.random() - 0.5) * 30,
    y: 15 + Math.random() * 20,
  });

  // Create gradient texture for trails
  const trailTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.1, '#' + config.color.getHexString());
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 512);
    return new THREE.CanvasTexture(canvas);
  }, [config.color]);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;

    const speed = config.speed * delta;
    posRef.current.x += Math.sin(config.angle) * speed * 25;
    posRef.current.y -= Math.cos(config.angle) * speed * 25;

    // Reset if out of view
    if (posRef.current.y < -viewport.height / 2 - 10) {
      posRef.current.y = viewport.height / 2 + 10 + Math.random() * 10;
      posRef.current.x = (Math.random() - 0.5) * viewport.width * 1.5;
      if (Math.random() > 0.3) posRef.current.y += 20;
    }

    meshRef.current.position.set(posRef.current.x, posRef.current.y, config.z);
    meshRef.current.rotation.z = config.angle;
  });

  return (
    <group ref={meshRef}>
      <mesh>
        <sphereGeometry args={[config.size, 16, 16]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <mesh scale={[3, 3, 3]}>
        <sphereGeometry args={[config.size, 16, 16]} />
        <meshBasicMaterial color={config.color} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[0, config.length / 2, 0]}>
        <planeGeometry args={[config.size * 2, config.length]} />
        <meshBasicMaterial
          map={trailTexture}
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

// -----------------------------------------------------------------------------
// Component: DeepSpaceBackground
// -----------------------------------------------------------------------------

const DeepSpaceBackground = () => {
  const starsRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.02;
      starsRef.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <group ref={starsRef}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Stars radius={50} depth={20} count={800} factor={6} saturation={1} fade speed={2} />
    </group>
  );
};

// -----------------------------------------------------------------------------
// Main Export: FallingStars
// -----------------------------------------------------------------------------

const FallingStars = () => {
  const { effectiveMode } = useAnimationPreference();

  if (effectiveMode === 'off') return null;

  const meteorCount = effectiveMode === 'full' ? 5 : 2;

  return (
    <>
      <color attach="background" args={['#030508']} />
      <fog attach="fog" args={['#030508', 20, 100]} />
      <ambientLight intensity={0.1} />
      <DeepSpaceBackground />
      <group>
        {Array.from({ length: meteorCount }).map((_, i) => (
          <CinematicMeteor key={i} id={i} />
        ))}
      </group>
    </>
  );
};

export default FallingStars;
