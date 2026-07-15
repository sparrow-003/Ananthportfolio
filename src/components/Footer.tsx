import { useState, useEffect } from 'react';
import { Code, Terminal, Home, User, Briefcase, BookOpen, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const footerLinks = [
  { label: 'Home', href: '/#home', icon: Home },
  { label: 'About', href: '/#about', icon: User },
  { label: 'Skills', href: '/#skills', icon: Briefcase },
  { label: 'Projects', href: '/#projects', icon: Briefcase },
  { label: 'Blog', href: '/blog', icon: BookOpen },
  { label: 'Contact', href: '/#contact', icon: Mail },
];

const Footer = () => {
  const [mounted, setMounted] = useState(false);
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogoClick = () => {
    window.dispatchEvent(new CustomEvent('toggle-developer-console'));
  };

  const handleHashLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      const hash = href.substring(2);
      if (location.pathname !== '/') return; // Let the Link handle navigation
      e.preventDefault();
      const el = document.querySelector(`#${hash}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="relative z-content bg-card/95 border-t border-border" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8" role="navigation" aria-label="Footer navigation">
          {/* Brand column */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link to="/" className="text-xl font-bold tracking-tighter text-foreground hover:text-primary transition-colors">
              ANANTH<span className="text-primary">.N</span>
            </Link>
            <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs leading-relaxed">
              Full-Stack Developer &amp; AI Engineer crafting digital experiences at the intersection of art and technology.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-widest mb-1">Quick Links</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {footerLinks.map((link) => {
                const Icon = link.icon;
                const isExternal = link.href.startsWith('http');
                const isHash = link.href.startsWith('/#');
                const isActive = isHash
                  ? location.pathname === '/' && location.hash === `#${link.href.substring(2)}`
                  : location.pathname === link.href;

                if (isExternal) {
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {link.label}
                    </a>
                  );
                }

                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={(e) => handleHashLink(e, link.href)}
                    className={`flex items-center gap-2 text-sm transition-colors ${
                      isActive ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Contact info */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-widest mb-1">Contact</h3>
            <a href="mailto:thanan757@gmail.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Mail className="w-3.5 h-3.5" />
              thanan757@gmail.com
            </a>
            <a href="tel:+916384227309" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Code className="w-3.5 h-3.5" />
              +91 6384227309
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 pt-6 border-t border-border">
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
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleLogoClick(); }}
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
