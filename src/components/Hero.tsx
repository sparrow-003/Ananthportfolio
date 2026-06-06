import AnimatedText from './AnimatedText';
import AnimatedAvatar from './AnimatedAvatar';
import { memo, useEffect, useState, useRef, useCallback } from 'react';
import { Mail, ArrowRight, Briefcase, MapPin, Code } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAnimationPreference } from '@/contexts/AnimationContext';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const ROLES = [
  "Vibe Coder",
  "Python Developer",
  "JavaScript/TypeScript Developer",
  "Teaching Expert",
  "UI/UX Designer",
  "AI Prompt Engineer",
  "Web Developer"
] as const;

const HR_PICKUP_LINES = [
  "A dreamer who codes worlds beyond the ordinary",
  "Crafting futures where AI and imagination collide",
  "Guiding 150+ minds to awaken their hidden genius",
  "A voice of leadership, turning sparks into fire",
  "Join me on this journey — where vision becomes destiny"
] as const;

const Hero = memo(() => {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentPickupLine, setCurrentPickupLine] = useState<string>(HR_PICKUP_LINES[0]);
  const { effectiveMode } = useAnimationPreference();

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

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * HR_PICKUP_LINES.length);
      setCurrentPickupLine(HR_PICKUP_LINES[randomIndex]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Setup cinematic entrance and scroll parallax utilizing GSAP
  useEffect(() => {
    if (effectiveMode === 'off') return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      // Stagger entrance of left column elements
      tl.from('.gsap-hero-left', {
        opacity: 0,
        scale: 0.8,
        duration: effectiveMode === 'reduced' ? 0.55 : 0.85,
        ease: 'power4.out'
      });

      tl.from('.gsap-hero-social', {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: effectiveMode === 'reduced' ? 0.35 : 0.55,
        ease: 'back.out(1.5)'
      }, '-=0.8');

      // Stagger entrance of right content elements
      tl.from('.gsap-hero-fade-in', {
        opacity: 0,
        y: 35,
        stagger: 0.12,
        duration: effectiveMode === 'reduced' ? 0.4 : 0.6,
        ease: 'power3.out'
      }, '-=0.9');

      // Stagger info cards
      tl.from('.gsap-hero-info-card', {
        opacity: 0,
        scale: 0.95,
        y: 25,
        stagger: 0.1,
        duration: effectiveMode === 'reduced' ? 0.35 : 0.5,
        ease: 'back.out(1.2)'
      }, '-=0.5');

      // Floating indicator fade-in
      tl.from('.gsap-hero-indicator', {
        opacity: 0,
        y: 20,
        duration: 0.8
      }, '-=0.2');

      // Parallax scroll for Avatar
      if (effectiveMode === 'full') {
        gsap.to('.gsap-hero-left', {
          y: -40,
          rotationZ: 2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });

        gsap.to('.gsap-hero-right', {
          y: 48,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
      }

      // Subtle slow looping float on background glows
      gsap.to('.gsap-hero-glow-1', {
        scale: 1.2,
        opacity: 0.45,
        duration: effectiveMode === 'reduced' ? 12 : 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to('.gsap-hero-glow-2', {
        scale: 1.2,
        opacity: 0.45,
        duration: effectiveMode === 'reduced' ? 12 : 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 4
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [effectiveMode]);

  return (
    <section ref={sectionRef} id="home" className="relative z-content min-h-screen flex items-center justify-center pt-20 sm:pt-24 w-full overflow-hidden bg-transparent">
      {/* Background glow - transparent center so space layer stays visible */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="gsap-hero-glow-1 absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl opacity-30" />
        <div className="gsap-hero-glow-2 absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-primary/8 to-transparent rounded-full blur-3xl opacity-30" />
      </div>

      <div className="section-container flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 z-content">
        {/* Left Side: Avatar and Socials */}
        <div className="gsap-hero-left perspective z-content flex flex-col items-center">
          <AnimatedAvatar
            variant="hero"
            className="w-56 h-72 sm:w-64 sm:h-80 md:w-72 md:h-96 lg:w-80 lg:h-[28rem]"
          />

          <div className="mt-6 text-center text-xs text-primary animate-pulse font-medium tracking-widest uppercase mb-4">
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
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="gsap-hero-social w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 hover:border-primary/50 transition-all text-primary hover:scale-110 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] duration-300"
                aria-label={social.label}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={social.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Right Side: Text Content */}
        <div className="gsap-hero-right z-content text-center lg:text-left flex-1">
          <h2 className="gsap-hero-fade-in text-xl md:text-2xl mb-4 text-primary font-medium tracking-widest">
            HELLO, I'M
          </h2>
          <h1 className="gsap-hero-fade-in text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 cinematic-text">
            <span className="text-gradient">ANANTH.N</span>
          </h1>
          <div className="gsap-hero-fade-in text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 sm:mb-8 min-h-12 sm:min-h-16 text-foreground">
            I'm a <AnimatedText texts={[...ROLES]} className="text-primary" interval={2500} />
          </div>
          <p className="gsap-hero-fade-in text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto lg:mx-0 mb-6 text-muted-foreground leading-relaxed font-light">
            A dreamer who codes worlds beyond the ordinary, crafting futures where AI and imagination collide. Guiding 150+ minds to awaken their hidden genius, a voice of leadership turning sparks into fire.
          </p>

          {/* Cinematic HR pickup line */}
          <div className="gsap-hero-fade-in glass-card p-4 mb-12 relative overflow-hidden inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/10" />
            <p className="text-primary/80 italic font-medium tracking-wide">"{currentPickupLine}"</p>
          </div>

          <div className="gsap-hero-fade-in flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <button
              className="px-8 py-3 bg-primary hover:bg-primary/90 rounded-full font-bold text-primary-foreground shadow-lg transition-all group overflow-hidden relative active:scale-95 duration-200"
              onClick={handleHireMe}
            >
              <span className="relative z-content flex items-center justify-center gap-2">
                <Mail size={18} />
                Hire Me Now
                <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </span>
            </button>

            <a
              href="#projects"
              className="px-8 py-3 border border-primary/30 rounded-full font-bold text-foreground hover:bg-primary/10 transition-all flex items-center justify-center gap-2 group active:scale-95 duration-200"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View My Work
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>

          {/* Information cards */}
          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Experience", value: "Teaching 150+ Students", icon: Briefcase },
              { label: "Location", value: "Madurai, Tamil Nadu", icon: MapPin },
              { label: "Vibe Skills", value: "AI, Python, React", icon: Code }
            ].map((card, i) => (
              <div
                key={i}
                className="gsap-hero-info-card bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border flex items-center gap-3 hover:border-primary/30 transition-all hover:-translate-y-1 duration-300"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <card.icon size={20} />
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">{card.label}</p>
                  <p className="text-sm font-bold text-foreground">{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating indicator */}
      <div className="gsap-hero-indicator absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] text-muted-foreground uppercase tracking-[0.3em]">Examine Depth</span>
        <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent animate-pulse" />
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
