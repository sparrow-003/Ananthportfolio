import { motion } from 'framer-motion';
import { Code, Terminal } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleLogoClick = () => {
    window.dispatchEvent(new CustomEvent('toggle-developer-console'));
  };

  return (
    <footer className="relative bg-card/95 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-4">
          {/* Main tagline */}
          <motion.p
            className="text-sm text-muted-foreground text-center flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Terminal className="w-4 h-4 text-primary" />
            Crafting digital experiences at the intersection of art and technology
            <Code className="w-4 h-4 text-primary" />
          </motion.p>

          {/* Copyright */}
          <motion.p
            onClick={handleLogoClick}
            className="text-xs text-muted-foreground/70 cursor-pointer select-none hover:text-primary transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            © {currentYear} Ananth N. All Rights Reserved.
          </motion.p>

          {/* Decorative line */}
          <motion.div
            className="h-0.5 w-16 bg-gradient-to-r from-primary via-primary/70 to-primary/50 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
