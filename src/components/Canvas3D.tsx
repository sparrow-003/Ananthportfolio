
import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect } from 'react';
import { OrbitControls, Environment, Stars, Float, Preload } from '@react-three/drei';
import FloatingShape from './FloatingShape';
import FallingStars from './FallingStars';


// Custom shapes that represent different project categories and technologies
const ProjectShapes = () => {
  return (
    <group>
      {/* Financial Dashboard - Yellow */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <FloatingShape position={[5, 2, -8]} size={1.5} color="#EAB308" shape="octahedron" speed={0.8} text="Financial" />
      </Float>
      
      {/* AI Business - Green */}
      <Float speed={1.2} rotationIntensity={0.8} floatIntensity={1.5}>
        <FloatingShape position={[-6, 3, -12]} size={2} color="#22C55E" shape="icosahedron" speed={0.5} text="AI Business" />
      </Float>
      
      {/* Chat Bot - Blue */}
      <Float speed={1.8} rotationIntensity={1.2} floatIntensity={2.2}>
        <FloatingShape position={[0, -3, -10]} size={1.7} color="#3B82F6" shape="tetrahedron" speed={0.6} text="Chatbot" />
      </Float>
      
      {/* Dev Hub - Purple */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={1.8}>
        <FloatingShape position={[-4, -2, -6]} size={1.2} color="#8B5CF6" shape="sphere" speed={0.9} text="Dev Hub" />
      </Float>
      
      {/* MongoDB - Yellow Green */}
      <Float speed={1.3} rotationIntensity={0.7} floatIntensity={1.7}>
        <FloatingShape position={[6, -1, -14]} size={1.3} color="#4CAF50" shape="torus" speed={0.7} text="MongoDB" />
      </Float>
      
      {/* Express - Orange */}
      <Float speed={1.4} rotationIntensity={0.9} floatIntensity={1.6}>
        <FloatingShape position={[-3, 5, -9]} size={1.2} color="#FF9800" shape="octahedron" speed={0.5} text="Express" />
      </Float>
      
      {/* React - Blue */}
      <Float speed={1.6} rotationIntensity={1} floatIntensity={1.9}>
        <FloatingShape position={[3, -4, -7]} size={1.4} color="#61DAFB" shape="sphere" speed={0.8} text="React" />
      </Float>
      
      {/* Python - Yellow & Blue */}
      <Float speed={1.2} rotationIntensity={0.6} floatIntensity={2}>
        <FloatingShape position={[-5, -1, -15]} size={1.6} color="#FFD43B" shape="icosahedron" speed={0.7} text="Python" />
      </Float>

      {/* New: Flask - Blue */}
      <Float speed={1.7} rotationIntensity={0.8} floatIntensity={1.8}>
        <FloatingShape position={[4, 5, -10]} size={1.3} color="#4B8BBE" shape="tetrahedron" speed={0.6} text="Flask" />
      </Float>
      
      {/* New: Django - Green */}
      <Float speed={1.3} rotationIntensity={0.7} floatIntensity={1.6}>
        <FloatingShape position={[-2, -4, -12]} size={1.4} color="#092E20" shape="icosahedron" speed={0.5} text="Django" />
      </Float>
      
      {/* New: Next.js - Black/White */}
      <Float speed={1.5} rotationIntensity={0.9} floatIntensity={1.7}>
        <FloatingShape position={[7, 0, -9]} size={1.3} color="#FFFFFF" shape="sphere" speed={0.7} text="Next.js" />
      </Float>
      
      {/* New: LLM - Purple */}
      <Float speed={1.8} rotationIntensity={1} floatIntensity={2}>
        <FloatingShape position={[0, 4, -13]} size={1.5} color="#A78BFA" shape="octahedron" speed={0.8} text="LLM" />
      </Float>
    </group>
  );
};

// Animated machine-like elements
const RunningMachine = () => {
  return (
    <group position={[0, -8, -20]} scale={[2, 2, 2]}>
      {/* Central Spinning Gear */}
      <Float speed={0.5} rotationIntensity={2} floatIntensity={0.2}>
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[2, 0.3, 16, 50]} />
          <meshStandardMaterial color="#3B82F6" metalness={0.9} roughness={0.1} />
        </mesh>
      </Float>
      
      {/* Vertical Moving Piston */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[0.5, 3, 0.5]} />
        <meshStandardMaterial color="#1D4ED8" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Horizontal Moving Parts */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
        <mesh position={[3, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 4, 32]} />
          <meshStandardMaterial color="#60A5FA" metalness={0.7} roughness={0.3} />
        </mesh>
      </Float>
      
      {/* Small Spinning Elements */}
      <Float speed={3} rotationIntensity={5} floatIntensity={0.1}>
        <mesh position={[-2, 1, 0]}>
          <octahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial color="#2563EB" wireframe={true} />
        </mesh>
      </Float>
      
      {/* Data Flow Visualization */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1.5}>
        <mesh position={[0, 0, 2]}>
          <torusKnotGeometry args={[1, 0.2, 128, 32]} />
          <meshStandardMaterial color="#1E40AF" emissive="#1E40AF" emissiveIntensity={0.5} />
        </mesh>
      </Float>
    </group>
  );
};


const Canvas3D = () => {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    try {
      setMounted(true);
    } catch (err) {
      console.error('Canvas3D mount error:', err);
      setError(true);
    }
  }, []);

  if (error || !mounted) return null;

  return (
    <div className="canvas-container h-full">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 65 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
          preserveDrawingBuffer: false
        }}
        dpr={[1, 1.5]}
        shadows={false}
        performance={{ min: 0.5 }}
        style={{ background: '#000000' }}
        onError={(error) => {
          console.error('Canvas error:', error);
          setError(true);
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} color="#3B82F6" />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#1D4ED8" />
          <pointLight position={[5, 5, -10]} intensity={0.3} color="#60A5FA" />
          
          <ProjectShapes />
          <RunningMachine />
          <FallingStars />
          
          <Stars 
            radius={50} 
            depth={50} 
            count={1500} 
            factor={4} 
            saturation={1} 
            fade 
            speed={1}
          />
          
          <Environment preset="night" />
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate
            autoRotateSpeed={0.5}
            makeDefault
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
          
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Canvas3D;
