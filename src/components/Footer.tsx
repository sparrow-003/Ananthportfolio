import { useState, useEffect } from 'react';
import { Code, Terminal } from 'lucide-react';

const Footer = () => {
  const [mounted, setMounted] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogoClick = () => {
    window.dispatchEvent(new CustomEvent('toggle-developer-console'));
  };

  return (
    <footer className="relative z-content bg-card/95 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-4">
          <p
            className={`text-sm text-muted-foreground text-center flex items-center gap-2 transition-all duration-500 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <Terminal className="w-4 h-4 text-primary" />
            Crafting digital experiences at the intersection of art and technology
            <Code className="w-4 h-4 text-primary" />
          </p>

          <p
            onClick={handleLogoClick}
            className={`text-xs text-muted-foreground/70 cursor-pointer select-none hover:text-primary transition-all duration-500 ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '250ms' }}
          >
            © {currentYear} Ananth N. All Rights Reserved.
          </p>

          <div
            className={`h-0.5 w-16 bg-gradient-to-r from-primary via-primary/70 to-primary/50 rounded-full transition-all duration-500 origin-left ${
              mounted ? 'scale-x-100' : 'scale-x-0'
            }`}
            style={{ transitionDelay: '400ms' }}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
