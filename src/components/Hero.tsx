import { motion, useTransform, useScroll } from 'framer-motion';
import AnimatedText from './AnimatedText';
import AnimatedAvatar from './AnimatedAvatar';
import { memo, useEffect, useState, useRef, useCallback } from 'react';
import { Mail, ArrowRight, Briefcase, MapPin, Code } from 'lucide-react';

// Memoized roles array to prevent re-creation
const ROLES = [
  "Vibe Coder",
  "Python Developer",
  "JavaScript/TypeScript Developer",
  "Teaching Expert",
  "UI/UX Designer",
  "AI Prompt Engineer",
  "Web Developer"
] as const;

// Memoized pickup lines
const HR_PICKUP_LINES = [
  "A dreamer who codes worlds beyond the ordinary",
  "Crafting futures where AI and imagination collide",
  "Guiding 150+ minds to awaken their hidden genius",
  "A voice of leadership, turning sparks into fire",
  "Join me on this journey — where vision becomes destiny"
] as const;

const Hero = memo(() => {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Enhanced parallax values for better 3D effect
  const avatarY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const avatarRotate = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  const handleHireMe = useCallback(() => {
    const subject = "Project Inquiry - I'd Like to Hire You";
    const body = `Hello Ananth,

I came across your impressive portfolio website and I'm interested in discussing a potential project with you.

Project Overview:
[Brief description of your project/requirements]

Timeline:
[Your expected timeline]

Budget Range:
[Your budget range if applicable]

Looking forward to hearing from you soon!

Best regards,
[Your Name]`;

    window.location.href = `mailto:thanan757@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, []);

  const [currentPickupLine, setCurrentPickupLine] = useState<string>(HR_PICKUP_LINES[0]);

  // Rotate through pickup lines
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * HR_PICKUP_LINES.length);
      setCurrentPickupLine(HR_PICKUP_LINES[randomIndex]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      if (Math.abs(window.scrollY - scrollY) > 5) {
        setScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

  return (
    <section ref={sectionRef} id="home" className="relative min-h-screen flex items-center justify-center pt-20 sm:pt-24 w-full overflow-hidden bg-background">
      {/* Enhanced gradient background with emerald theme - respects light/dark */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-background to-teal-950/20 dark:from-emerald-950/30 dark:via-black dark:to-teal-950/20" />

      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-emerald-500/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-teal-500/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </div>

      <div className="section-container flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 z-10">
        {/* Left Side: Avatar and Socials */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: "spring" }}
          className="perspective z-10 flex flex-col items-center"
          style={{ y: avatarY, rotateY: avatarRotate }}
        >
          <AnimatedAvatar
            variant="hero"
            className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
          />

          <div className="mt-6 text-center text-xs text-emerald-400 animate-pulse font-medium tracking-widest uppercase mb-4">
            ___________________
          </div>

          {/* Social Media Links */}
          <div className="flex gap-4 justify-center">
            {[
              { href: "https://www.linkedin.com/in/ananth-n-583036233", icon: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 4a2 2 0 1 0 0 4 2 2 0 1 0 0-4z", label: "LinkedIn" },
              { href: "https://github.com/sparrow-003", icon: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22", label: "GitHub" },
              { href: "https://www.instagram.com/_alexxz_0", icon: "M2 2h20v20H2z M17.5 6.5h.01 M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z", label: "Instagram" },
              { href: "https://api.whatsapp.com/send?phone=916384227309", icon: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z", label: "WhatsApp" }
            ].map((social, idx) => (
              <motion.a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-full flex items-center justify-center border border-emerald-500/20 hover:border-emerald-500/50 transition-all group"
                whileHover={{ scale: 1.15, rotate: idx % 2 === 0 ? 5 : -5, boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                aria-label={social.label}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 group-hover:text-emerald-300 transition-colors">
                  <path d={social.icon} />
                </svg>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ y: contentY, opacity: contentOpacity }}
          className="z-10 text-center lg:text-left flex-1"
        >
          <motion.h2
            className="text-xl md:text-2xl mb-4 text-emerald-400 font-medium tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            HELLO, I'M
          </motion.h2>
          <motion.h1
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 cinematic-text"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className="text-gradient">ANANTH.N</span>
          </motion.h1>
          <motion.div
            className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 sm:mb-8 min-h-12 sm:min-h-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            I'm a <AnimatedText texts={[...ROLES]} className="text-primary" interval={2500} />
          </motion.div>
          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto lg:mx-0 mb-6 text-muted-foreground leading-relaxed font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            A dreamer who codes worlds beyond the ordinary, crafting futures where AI and imagination collide. Guiding 150+ minds to awaken their hidden genius, a voice of leadership turning sparks into fire.
          </motion.p>

          {/* Cinematic HR pickup line */}
          <motion.div
            className="glass-card p-4 mb-12 relative overflow-hidden inline-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/10"></div>
            <p className="text-primary/80 italic font-medium tracking-wide">"{currentPickupLine}"</p>
          </motion.div>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <motion.button
              className="px-8 py-3 bg-primary hover:bg-primary/90 rounded-full font-bold text-primary-foreground shadow-lg transition-all group overflow-hidden relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleHireMe}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Mail size={18} />
                Hire Me Now
                <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>

            <motion.a
              href="#projects"
              className="px-8 py-3 border border-primary/30 rounded-full font-bold text-foreground hover:bg-primary/10 transition-all flex items-center justify-center gap-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View My Work
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>

          {/* Information cards */}
          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Experience", value: "Teaching 150+ Students", icon: Briefcase, color: "text-primary" },
              { label: "Location", value: "Madurai, Tamil Nadu", icon: MapPin, color: "text-primary" },
              { label: "Vibe Skills", value: "AI, Python, React", icon: Code, color: "text-primary" }
            ].map((card, i) => (
              <motion.div
                key={i}
                className="bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border flex items-center gap-3 hover:border-primary/30 transition-colors"
                whileHover={{ y: -5 }}
              >
                <div className={`w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center ${card.color}`}>
                  <card.icon size={20} />
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">{card.label}</p>
                  <p className="text-sm font-bold text-foreground">{card.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-[10px] text-muted-foreground uppercase tracking-[0.3em]">Examine Depth</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-primary to-transparent"
        />
      </motion.div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
