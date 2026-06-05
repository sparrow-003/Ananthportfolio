import { memo, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import {
  Sparkles,
  Code2,
  Brain,
  Users,
  Rocket,
  Heart,
  GraduationCap,
  Briefcase,
  Target,
  Coffee,
  Quote,
  MapPin,
} from "lucide-react";
import { useReveal } from '@/hooks/useReveal';
import avatarPhoto from '@/assets/avatar-art-3.webp';

const PHOTO_SRC = avatarPhoto;

const stats = [
  { icon: Brain, value: '2+', label: 'Years in AI & ML', tint: 'text-primary' },
  { icon: Code2, value: '3+', label: 'Years of Coding', tint: 'text-accent' },
  { icon: Users, value: '150+', label: 'Students Mentored', tint: 'text-primary' },
  { icon: Rocket, value: '10+', label: 'Projects Shipped', tint: 'text-accent' },
];

const whatIDo = [
  {
    icon: Code2,
    title: 'Mastery in Full-Stack Development',
    desc: 'Spearheading the end-to-end creation of high-performance, scalable web applications with React, TypeScript, Python, and Node.js.',
  },
  {
    icon: Brain,
    title: 'Cutting-Edge AI Integration',
    desc: 'Architecting intelligent, scalable workflows by integrating AI solutions and pioneering prompt engineering techniques.',
  },
  {
    icon: Sparkles,
    title: 'LLM Development & Fine-Tuning',
    desc: 'Innovating at the forefront of AI by developing, training, and fine-tuning language models for sophisticated experiences.',
  },
  {
    icon: GraduationCap,
    title: 'Strategic Leadership & Mentorship',
    desc: 'Leading 150+ learners as a Campus Ambassador, cultivating professional growth and a knowledge-driven community.',
  },
];

const About = memo(() => {
  const [sectionRef, isInView] = useReveal<HTMLDivElement>(0.08, 400);
  const hasAnimatedRef = useRef(false);
  const photoRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);

  // Gentle floating animation on the photo — runs continuously
  useEffect(() => {
    if (!photoRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(photoRef.current, {
        y: -12,
        duration: 3.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }, photoRef);
    return () => ctx.revert();
  }, []);

  // One-shot reveal animations when section enters view
  useEffect(() => {
    if (!isInView || hasAnimatedRef.current || !sectionRef.current) return;
    hasAnimatedRef.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.gsap-about-badge', { opacity: 0, y: 16, duration: 0.5 })
        .from('.gsap-about-title', { opacity: 0, y: 28, duration: 0.6 }, '-=0.3')
        .from('.gsap-about-sub', { opacity: 0, y: 20, duration: 0.5 }, '-=0.4')
        .from('.gsap-about-photo', { opacity: 0, scale: 0.92, duration: 0.7, ease: 'back.out(1.2)' }, '-=0.7')
        .from('.gsap-about-quote', { opacity: 0, x: -20, duration: 0.55 }, '-=0.5')
        .from('.gsap-about-card', { opacity: 0, y: 30, duration: 0.55, stagger: 0.12 }, '-=0.4')
        .from('.gsap-about-do-item', { opacity: 0, x: 20, duration: 0.4, stagger: 0.08 }, '-=0.4')
        .from('.gsap-about-stat', { opacity: 0, y: 24, scale: 0.9, duration: 0.5, stagger: 0.1, ease: 'back.out(1.1)' }, '-=0.4');
    }, sectionRef);

    return () => ctx.revert();
  }, [isInView, sectionRef]);

  return (
    <section
      id="about"
      className="min-h-screen py-20 md:py-24 relative w-full bg-transparent"
      ref={sectionRef}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent -z-10" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl -z-10" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl -z-10" />

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="gsap-about-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-5">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Get to know me
            </span>
          </div>
          <h2 className="gsap-about-title text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-5">
            About <span className="text-gradient">Me</span>
          </h2>
          <p className="gsap-about-sub text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Developer, educator, and AI enthusiast — building digital experiences that feel
            human, accessible, and meaningful.
          </p>
        </div>

        {/* Photo + Intro row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center mb-12">
          {/* Photo — displayed freely, no box */}
          <div className="lg:col-span-2 flex justify-center">
            <div ref={photoRef} className="gsap-about-photo relative">
              {/* Soft ambient glow behind the photo */}
              <div className="absolute -inset-10 bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30 blur-3xl opacity-50 -z-10" />

              {/* Photo — no border, no rounded box, just the image */}
              <img
                src={PHOTO_SRC}
                alt="Ananth N — Portfolio"
                onError={() => setImgError(true)}
                loading="lazy"
                decoding="async"
                className="relative w-64 sm:w-72 md:w-80 lg:w-[22rem] h-auto max-h-[36rem] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
              />

              {/* Floating badge top-right of photo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.9, type: 'spring', stiffness: 200 }}
                className="absolute -top-1 -right-1 sm:top-2 sm:right-2 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-md border border-primary/30 shadow-lg flex items-center gap-1.5 z-10"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">
                  Available
                </span>
              </motion.div>

              {/* Floating badge bottom-left of photo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.1, type: 'spring', stiffness: 200 }}
                className="absolute -bottom-1 -left-1 sm:bottom-2 sm:left-2 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-md border border-accent/30 shadow-lg flex items-center gap-1.5 z-10"
              >
                <Coffee className="w-3.5 h-3.5 text-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">
                  Open to work
                </span>
              </motion.div>
            </div>
          </div>

          {/* Intro + Quote */}
          <div className="lg:col-span-3 space-y-6">
            <div className="gsap-about-quote relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-card/60 to-accent/10 border border-primary/20 backdrop-blur-md">
              <Quote className="absolute top-4 right-4 w-10 h-10 text-primary/15" />
              <p className="text-lg md:text-xl text-foreground leading-relaxed italic mb-4">
                "I'm a B.Com graduate turned full-stack developer and AI mentor — driven by
                curiosity and a desire to make technology more human, accessible, and impactful."
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-border/60">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm">
                  AN
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Ananth N</p>
                  <p className="text-xs text-muted-foreground">Full-Stack Developer · AI Educator</p>
                </div>
              </div>
            </div>

            {/* Quick facts */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { icon: Briefcase, label: 'Role', value: 'Full-Stack Dev' },
                { icon: MapPin, label: 'Based in', value: 'Madurai, IN' },
                { icon: Target, label: 'Focus', value: 'AI · EdTech' },
              ].map((fact) => (
                <div
                  key={fact.label}
                  className="gsap-about-card flex items-center gap-3 p-3 rounded-xl border border-border bg-card/60 backdrop-blur-sm"
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <fact.icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {fact.label}
                    </p>
                    <p className="text-sm font-semibold text-foreground truncate">{fact.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Journey + What I Do */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* My Journey */}
          <div className="gsap-about-card relative overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur-xl p-6 md:p-8 shadow-xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-0 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">My Journey</h3>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  My path began as a{' '}
                  <span className="font-semibold text-primary">B.Com graduate</span> with a deep
                  interest in problem-solving. That interest grew into a passion for development
                  and education.
                </p>
                <p>
                  I currently mentor{' '}
                  <span className="text-primary font-bold">150+ students</span> in AI & BI through
                  the Naan Mudhalvan program, while also serving as a Campus Ambassador at
                  Averixis Solutions.
                </p>
                <p>
                  I thrive on{' '}
                  <span className="font-semibold text-foreground">building, sharing, and growing</span>{' '}
                  — every challenge is an opportunity to innovate.
                </p>
              </div>
            </div>
          </div>

          {/* What I Do */}
          <div className="gsap-about-card relative overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur-xl p-6 md:p-8 shadow-xl">
            <div className="absolute top-0 left-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl -z-0 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">What I Do</h3>
              </div>
              <div className="space-y-4">
                {whatIDo.map((item) => (
                  <div
                    key={item.title}
                    className="gsap-about-do-item flex items-start gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform">
                      <item.icon className="w-4.5 h-4.5" size={18} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Vision + Beyond */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="gsap-about-card group relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card/70 to-card/70 backdrop-blur-md p-6 md:p-8 shadow-xl hover:border-primary/40 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <Rocket className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground">My Vision</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              I aim to create platforms that combine AI, creativity, and real-world
              problem-solving to empower people globally.
            </p>
          </div>

          <div className="gsap-about-card group relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 via-card/70 to-card/70 backdrop-blur-md p-6 md:p-8 shadow-xl hover:border-accent/40 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Beyond Tech</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Outside development, I explore storytelling, mentoring, and personal growth —
              bringing creativity into everything I do.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="gsap-about-stat group rounded-2xl p-5 md:p-6 border border-border bg-card/70 backdrop-blur-xl text-center shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all"
            >
              <div className={`inline-flex p-2.5 rounded-xl bg-muted/60 ${stat.tint} mb-3 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`text-3xl md:text-4xl font-black ${stat.tint} mb-1`}>
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default About;
