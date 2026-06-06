import { memo, useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, Code, Briefcase, Mail } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

const items = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: User },
  { id: 'skills', label: 'Skills', icon: Code },
  { id: 'projects', label: 'Work', icon: Briefcase },
  { id: 'contact', label: 'Contact', icon: Mail },
];

const smoothScrollTo = (targetY: number) => {
  window.scrollTo({ top: targetY, behavior: 'smooth' });
};

const MobileBottomNav = memo(() => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState('home');

  // Track active section via IntersectionObserver
  useEffect(() => {
    if (!isMobile || location.pathname !== '/') return;
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isMobile, location.pathname]);

  const go = useCallback(
    (sectionId: string) => {
      const scrollToSection = () => {
        const el = document.getElementById(sectionId);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 70;
        smoothScrollTo(top);
        setActive(sectionId);
      };
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(scrollToSection, 180);
      } else {
        scrollToSection();
      }
    },
    [navigate, location.pathname]
  );

  if (!isMobile) return null;

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 25 }}
      className="fixed bottom-0 left-0 right-0 z-nav md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Mobile navigation"
    >
      <div className="mx-3 mb-3 rounded-2xl border border-border bg-background/85 backdrop-blur-xl shadow-2xl">
        <ul className="flex items-center justify-around px-2 py-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => go(item.id)}
                  className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors active:scale-95 ${
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {isActive && (
                    <motion.span
                      layoutId="mobile-nav-pill"
                      className="absolute inset-0 rounded-xl bg-primary/15"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon size={20} className="relative z-content" />
                  <span className="text-[10px] font-medium relative z-content">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.nav>
  );
});

MobileBottomNav.displayName = 'MobileBottomNav';
export default MobileBottomNav;
