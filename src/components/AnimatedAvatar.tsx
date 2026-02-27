import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { memo, useState, useRef, useEffect } from 'react';
import heroAvatar from '@/assets/hero-avatar.jpg';
import avatarImage2 from '@/assets/avatar-art-2.png';
import avatarImage3 from '@/assets/avatar-art-3.png';

interface AnimatedAvatarProps {
  variant: 'hero' | 'about' | 'contact';
  className?: string;
}

const AnimatedAvatar = memo(({ variant, className = '' }: AnimatedAvatarProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Magnetic Effect Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
  const translateX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
  const translateY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const getImage = () => {
    switch (variant) {
      case 'hero':
        return heroAvatar;
      case 'about':
        return avatarImage3;
      case 'contact':
        return avatarImage2;
      default:
        return heroAvatar;
    }
  };

  // 4 Types of Animations mapped to variants and interaction
  const variantStyles = {
    hero: "shadow-emerald-500/20 text-emerald-500",
    about: "shadow-teal-500/20 text-teal-400",
    contact: "shadow-cyan-500/20 text-cyan-400",
  };

  return (
    <div
      ref={containerRef}
      className={`relative cursor-none group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1000px" }}
    >
      {/* 1. Cinematic Aura (Ambient Glow) */}
      <motion.div
        className={`absolute -inset-8 rounded-[40px] opacity-20 blur-3xl transition-colors duration-700 bg-gradient-to-br ${variant === 'hero' ? 'from-emerald-500 via-emerald-400 to-transparent' :
            variant === 'about' ? 'from-teal-500 via-emerald-400 to-transparent' :
              'from-cyan-500 via-teal-400 to-transparent'
          }`}
        animate={{
          scale: isHovered ? [1, 1.2, 1] : 1,
          opacity: isHovered ? 0.4 : 0.2,
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* 2. Floating Particle Field (Digital Dust) */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full bg-white/40`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* 3. Magnetic Genesis Frame (Main Container) */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          x: translateX,
          y: translateY,
          transformStyle: "preserve-3d",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        className="w-full h-full relative"
      >
        {/* Animated Rings (Cybernetic Logic) */}
        <motion.div
          className="absolute -inset-4 rounded-[38px] border border-white/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ transform: "translateZ(-20px)" }}
        />
        <motion.div
          className="absolute -inset-2 rounded-[34px] border border-emerald-500/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ transform: "translateZ(-10px)" }}
        />

        {/* 4. Prismatic Refraction Image Shell */}
        <div className="relative w-full aspect-square rounded-[32px] overflow-hidden border border-white/10 shadow-2xl group-hover:border-emerald-500/30 transition-colors duration-500">
          <motion.img
            src={getImage()}
            alt="Genesis Avatar"
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
            animate={{
              filter: isHovered ? 'contrast(1.1) brightness(1.1)' : 'contrast(1) brightness(1)',
            }}
          />

          {/* Liquid Light Sweep Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
            animate={{
              translateX: ["100%", "-100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: 1,
            }}
          />

          {/* Glass Overlay with Chromatic Aberration Simulation */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/40 pointer-events-none" />

          {/* Subtle Scanline Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-10 bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20" />
        </div>

        {/* Content Spotlight (on hover) */}
        <motion.div
          className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[32px]"
          style={{ transform: "translateZ(30px)" }}
        />
      </motion.div>

      {/* Floating UI Elements (Luxury Details) */}
      <motion.div
        className="absolute -bottom-4 -right-4 px-4 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl z-30 shadow-xl overflow-hidden"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
        transition={{ delay: 0.1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent" />
        <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-400 relative z-10">
          {variant === 'hero' ? 'System.Active' : variant === 'about' ? 'Bio.Nexus' : 'Comm.Node'}
        </span>
      </motion.div>
    </div>
  );
});

AnimatedAvatar.displayName = 'AnimatedAvatar';

export default AnimatedAvatar;
