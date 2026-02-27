import { useEffect, useState, useRef, useCallback, memo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface SmoothScrollProps {
  children: React.ReactNode;
}

const SmoothScroll = memo(({ children }: SmoothScrollProps) => {
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  // Optimized spring with less stiffness for smoother feel
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001
  });
  
  // Smooth scroll with easing
  const smoothScrollTo = useCallback((target: number) => {
    const start = window.scrollY;
    const change = target - start;
    const duration = 600;
    const startTime = performance.now();
    
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    
    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start + change * easeOutCubic(progress));
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
  }, []);
  
  useEffect(() => {
    setMounted(true);
    
    // Simple CSS smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Intercept anchor clicks
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      
      if (anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href')?.slice(1);
        const targetElement = document.getElementById(targetId || '');
        
        if (targetElement) {
          smoothScrollTo(targetElement.offsetTop - 80);
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [smoothScrollTo]);

  return (
    <>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 z-[100] origin-left"
        style={{ scaleX }}
      />
      
      {/* Navigation dots - simplified */}
      {mounted && (
        <div className="fixed top-1/2 right-4 lg:right-8 transform -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
          {['home', 'about', 'skills', 'projects', 'contact'].map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className="group relative"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(section);
                if (el) smoothScrollTo(el.offsetTop - 80);
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30 border border-emerald-400/50 hover:bg-emerald-500 hover:scale-125 transition-all duration-200" />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-2 py-1 rounded">
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </span>
            </a>
          ))}
        </div>
      )}
      
      {/* Content */}
      <div ref={scrollRef} className="flex flex-col w-full">
        {children}
      </div>
    </>
  );
});

SmoothScroll.displayName = 'SmoothScroll';

export default SmoothScroll;
