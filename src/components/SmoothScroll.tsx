import { useEffect, useState, useRef, useCallback, memo } from 'react';

interface SmoothScrollProps {
  children: React.ReactNode;
}

const SmoothScroll = memo(({ children }: SmoothScrollProps) => {
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const smoothScrollTo = useCallback((target: number) => {
    const start = window.scrollY;
    const change = target - start;
    const duration = 520;
    const startTime = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, start + change * ease(p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    setMounted(true);
    document.documentElement.style.scrollBehavior = 'smooth';

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute('href')?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        smoothScrollTo(el.offsetTop - 80);
      }
    };

    document.addEventListener('click', handleAnchorClick);

    const updateProgress = () => {
      const bar = document.getElementById('scroll-progress-bar');
      if (!bar) return;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      bar.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('scroll', updateProgress);
      document.documentElement.style.scrollBehavior = '';
    };
  }, [smoothScrollTo]);

  return (
    <>
      <div
        id="scroll-progress-bar"
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-floating origin-left scale-x-0 will-change-transform pointer-events-none"
      />

      {mounted && (
        <div className="fixed top-1/2 right-4 lg:right-8 transform -translate-y-1/2 z-nav hidden md:flex flex-col gap-3">
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
                <div className="w-2.5 h-2.5 rounded-full bg-primary/30 border border-primary/40 hover:bg-primary hover:scale-125 transition-all duration-200" />
               <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-background/90 px-2 py-1 rounded border border-border">
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </span>
            </a>
          ))}
        </div>
      )}

      <div ref={scrollRef} className="relative flex flex-col w-full">
        {children}
      </div>
    </>
  );
});

SmoothScroll.displayName = 'SmoothScroll';

export default SmoothScroll;
