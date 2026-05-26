import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Stars } from '@react-three/drei';
import { useAnimationPreference } from '@/contexts/AnimationContext';

const FLOATING_STAR_COUNT = 6000;
const FALLING_STAR_COUNT = 30;

const METEOR_COLORS = [
  '#ffffff', '#a6d4ff', '#fff4e8', '#87ceeb',
  '#ffb6c1', '#ffd700', '#e0ffff', '#b0e0e6'
];

interface FloatingStar {
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: THREE.Color;
}

interface FallingStar {
  x: number;
  y: number;
  z: number;
  speed: number;
  length: number;
  opacity: number;
  color: THREE.Color;
}

const FloatingStarsSystem = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const { positions, sizes, colors, randoms } = useMemo(() => {
    const positions = new Float32Array(FLOATING_STAR_COUNT * 3);
    const sizes = new Float32Array(FLOATING_STAR_COUNT);
    const colors = new Float32Array(FLOATING_STAR_COUNT * 3);
    const randoms = new Float32Array(FLOATING_STAR_COUNT * 2);

    const starColors = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#ffe4c4'),
      new THREE.Color('#b0c4de'),
      new THREE.Color('#ffd700'),
      new THREE.Color('#add8e6'),
      new THREE.Color('#ffefd5'),
      new THREE.Color('#c9d6ff'),
      new THREE.Color('#e2f0cb'),
    ];

    for (let i = 0; i < FLOATING_STAR_COUNT; i++) {
      const i3 = i * 3;
      
      const radius = 50 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      sizes[i] = 0.5 + Math.random() * 1.5;

      const starColor = starColors[Math.floor(Math.random() * starColors.length)];
      const brightness = 0.6 + Math.random() * 0.4;
      colors[i3] = starColor.r * brightness;
      colors[i3 + 1] = starColor.g * brightness;
      colors[i3 + 2] = starColor.b * brightness;

      randoms[i * 2] = Math.random();
      randoms[i * 2 + 1] = Math.random();
    }

    return { positions, sizes, colors, randoms };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    
    pointsRef.current.rotation.y += 0.0002;
    pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.05;
    
    pointsRef.current.position.y = Math.sin(time * 0.3) * 0.5;
  });

  return (
    <Points ref={pointsRef} positions={positions} sizes={sizes} colors={colors} stride={3}>
      <PointsMaterial
        transparent
        vertexColors
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.9}
      />
    </Points>
  );
};

const Points = ({ positions, sizes, colors, stride, children }: any) => {
  const ref = useRef<THREE.Points>(null);
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      {children}
    </points>
  );
};

const PointsMaterial = (props: any) => {
  return <pointsMaterial {...props} />;
};

const BackgroundStars = () => {
  return (
    <Stars 
      radius={200} 
      depth={100} 
      count={3000} 
      factor={3} 
      saturation={0} 
      fade 
      speed={0.5}
    />
  );
};

const FallingMeteors = () => {
  const meteorsRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const meteors = useMemo(() => {
    return Array.from({ length: FALLING_STAR_COUNT }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * viewport.width * 3,
      y: 30 + Math.random() * 50,
      z: -Math.random() * 50 - 10,
      speed: 0.3 + Math.random() * 0.7,
      length: 2 + Math.random() * 4,
      angle: -Math.PI / 4 + (Math.random() - 0.5) * 0.3,
      color: new THREE.Color(METEOR_COLORS[Math.floor(Math.random() * METEOR_COLORS.length)]),
      opacity: 0.4 + Math.random() * 0.5,
      size: 0.02 + Math.random() * 0.03,
    }));
  }, [viewport]);

  useFrame((_state, delta) => {
    if (!meteorsRef.current) return;
    
    meteors.forEach((meteor, i) => {
      const mesh = meteorsRef.current?.children[i] as THREE.Mesh;
      if (!mesh) return;

      const speed = meteor.speed * delta * 30;
      meteor.y -= Math.cos(meteor.angle) * speed;
      meteor.x += Math.sin(meteor.angle) * speed;

      if (meteor.y < -viewport.height / 2 - 20) {
        meteor.y = viewport.height / 2 + 20 + Math.random() * 30;
        meteor.x = (Math.random() - 0.5) * viewport.width * 3;
      }

      mesh.position.set(meteor.x, meteor.y, meteor.z);
    });
  });

  return (
    <group ref={meteorsRef}>
      {meteors.map((meteor) => (
        <mesh key={meteor.id} position={[meteor.x, meteor.y, meteor.z]} rotation={[0, 0, meteor.angle]}>
          <planeGeometry args={[meteor.size * 2, meteor.length]} />
          <meshBasicMaterial
            color={meteor.color}
            transparent
            opacity={meteor.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

const CleanSpaceBackground = () => {
  const { effectiveMode } = useAnimationPreference();
  
  if (effectiveMode === 'off') return null;

  return (
    <>
      <fog attach="fog" args={['#000000', 80, 200]} />
      <ambientLight intensity={0.05} />
      
      <BackgroundStars />
      <FloatingStarsSystem />
      <FallingMeteors />
    </>
  );
};

export default CleanSpaceBackground;
