import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { memo, useState, useRef, useEffect } from 'react';
import heroAvatar from '@/assets/ananth-portrait.webp';
import contactAvatar from '@/assets/ananth-contact.webp';
import avatarImage3 from '@/assets/avatar-art-3.webp';

interface AnimatedAvatarProps {
  variant: 'hero' | 'about' | 'contact';
  className?: string;
  isInView?: boolean;
}

const AnimatedAvatar = memo(({ variant, className = '', isInView = true }: AnimatedAvatarProps) => {
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
        return contactAvatar;
      default:
        return heroAvatar;
    }
  };

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current && variant === 'hero') {
      imgRef.current.setAttribute('fetchpriority', 'high');
    }
  }, [variant]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1000px" }}
    >
      {/* Clean Image - No Box, No Border */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          x: translateX,
          y: translateY,
          transformStyle: "preserve-3d",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        className="w-full h-full"
      >
        <img
          ref={imgRef}
          src={getImage()}
          alt="Ananth N Portrait"
          loading="eager"
          decoding="async"
          className="w-full h-full object-contain drop-shadow-[0_10px_40px_hsl(var(--primary)/0.35)]"
          style={{ background: 'transparent' }}
        />
      </motion.div>
    </div>
  );
});

AnimatedAvatar.displayName = 'AnimatedAvatar';

export default AnimatedAvatar;
