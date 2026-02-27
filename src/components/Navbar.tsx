 import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

 const Navbar = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Blog', href: '/blog', isRoute: true },
    { name: 'Articles', href: 'https://ananthdev.blogspot.com/', external: true },
    { name: 'Hire Me', href: 'mailto', isHireMe: true }
  ];

  const handleHireMe = () => {
    const subject = encodeURIComponent("Hiring Inquiry - Let's Work Together!");
    const body = encodeURIComponent(
      `Hi Ananth,\n\nI came across your portfolio and I'm impressed with your work!\n\nI would like to discuss a potential opportunity/project with you.\n\nProject Details:\n- \n\nLooking forward to hearing from you.\n\nBest regards,`
    );
    window.location.href = `mailto:thanan757@gmail.com?subject=${subject}&body=${body}`;
    setMobileMenuOpen(false);
  };

  const scrollToSection = (id: string, isExternal?: boolean, isRoute?: boolean) => {
    if (isExternal) {
      window.open(id, '_blank');
      setMobileMenuOpen(false);
      return;
    }
    if (isRoute) {
      navigate(id);
      setMobileMenuOpen(false);
      return;
    }

    // If we're not on the home page, navigate there first then scroll
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation then scroll
      setTimeout(() => {
        const element = document.querySelector(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      setMobileMenuOpen(false);
      return;
    }

    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
       className={`fixed top-0 left-0 right-0 w-full z-50 px-4 sm:px-6 transition-all duration-500 ${isScrolled ? 'glass-nav py-3 backdrop-blur-xl shadow-xl shadow-primary/10 bg-background/80' : 'py-4 bg-background/20 backdrop-blur-sm'
          }`}
        style={{
         borderBottom: isScrolled ? '1px solid hsl(var(--primary) / 0.1)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Brand / Logo */}
          <a
            href="#home"
           className="text-xl font-bold tracking-tighter text-foreground hover:text-primary transition-colors z-50 relative"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#home');
            }}
          >
           ANANTH<span className="text-primary">.N</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
               className="text-sm lg:text-base text-foreground opacity-80 hover:opacity-100 hover:text-primary font-medium transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.1 * index, duration: 0.5 }
                }}
                onClick={(e) => {
                  e.preventDefault();
                  if ((item as any).isHireMe) {
                    handleHireMe();
                  } else if (!item.external && !(item as any).isRoute) {
                    scrollToSection(item.href);
                  } else if ((item as any).isRoute) {
                    scrollToSection(item.href, false, true);
                  } else {
                    window.open(item.href, '_blank');
                  }
                }}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
              >
                {item.name}
              </motion.a>
            ))}
            <div className="pl-4 flex items-center space-x-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              className="focus:outline-none text-foreground p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-14 sm:top-16 left-0 right-0 z-40 glass-nav py-4 md:hidden bg-background/95 backdrop-blur-xl"
          >
            <div className="flex flex-col items-center space-y-4 px-6">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground text-lg py-2"
                  onClick={(e) => {
                    e.preventDefault();
                    if ((item as any).isHireMe) {
                      handleHireMe();
                    } else if (!item.external && !(item as any).isRoute) {
                      scrollToSection(item.href);
                    } else if ((item as any).isRoute) {
                      scrollToSection(item.href, false, true);
                    } else {
                      window.open(item.href, '_blank');
                    }
                  }}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Indicator - Small arrow bouncing at bottom of viewport */}
      <motion.div
        className="hidden md:flex fixed bottom-8 left-1/2 -translate-x-1/2 z-30"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          delay: 2,
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop"
        }}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
         className="text-primary/50"
        >
          <path d="M7 13l5 5 5-5M7 7l5 5 5-5" />
        </svg>
      </motion.div>
    </>
  );
 });
 
 Navbar.displayName = 'Navbar';

export default Navbar;
