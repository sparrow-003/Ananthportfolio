
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedTextProps {
  texts: string[];
  interval?: number;
  className?: string;
}

const AnimatedText = ({ texts, interval = 3000, className = '' }: AnimatedTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing intervals to prevent memory leaks
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Set up new interval for text rotation with clean timing
    intervalRef.current = setInterval(() => {
      setIsVisible(false);
      
      // Wait for exit animation to complete before changing text
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsVisible(true);
      }, 500); // Half a second for the transition
      
      return () => clearTimeout(timer);
    }, interval);

    // Clean up on unmount or texts/interval change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [texts, interval]);

  // Enhanced 3D animation variants with better performance
  const variants = {
    initial: { 
      y: 20, 
      opacity: 0, 
      rotateX: 45,
      filter: "blur(8px)"
    },
    animate: { 
      y: 0, 
      opacity: 1, 
      rotateX: 0,
      filter: "blur(0px)"
    },
    exit: { 
      y: -20, 
      opacity: 0, 
      rotateX: -45,
      filter: "blur(8px)"
    }
  };

  return (
    <div className="relative inline-block perspective-wrapper">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.span
            key={currentIndex}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ 
              duration: 0.5, 
              ease: "easeInOut",
              staggerChildren: 0.01
            }}
            className={`inline-block ${className}`}
            style={{ perspective: "1000px" }}
          >
            {texts[currentIndex]}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedText;
