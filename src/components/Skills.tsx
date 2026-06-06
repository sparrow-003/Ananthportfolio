import { memo, useEffect, useRef } from 'react';
import { BrainCircuit, Globe, Layers, Cpu, PencilRuler, CheckCircle } from 'lucide-react';
import {
  SiPython,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNodedotjs,
  SiNextdotjs,
  SiHtml5,
  SiTailwindcss,
  SiOpenai,
  SiLangchain,
  SiHuggingface,
  SiSupabase,
  SiMongodb,
  SiMysql,
  SiDocker,
  SiGithubactions,
  SiExpress,
  SiDjango,
  SiFlask,
  SiFigma,
  SiGooglecolab,
  SiTensorflow,
  SiPandas,
  SiNumpy,
  SiScikitlearn,
  SiFastapi,
  SiGraphql,
  SiPostgresql,
  SiRedis,
  SiVercel,
  SiGit,
  SiLinux,
  SiVscodium,
  SiPostman,
  SiVite,
  SiSocketdotio,
  SiBlender,
} from 'react-icons/si';
import { Workflow, Sparkles, Rocket, MessageSquareQuote, Brain, Network, Plug, Search, Award, Crown, MessageCircle, Wrench, HeartHandshake, Microscope, BookOpen, PenTool, Telescope, Code2, Palette, Paintbrush, Database } from 'lucide-react';
import { gsap } from 'gsap';
import { useAnimationPreference } from '@/contexts/AnimationContext';

const Skills = memo(() => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { effectiveMode } = useAnimationPreference();

  const skillCategories = [
    {
      title: "Vibe Coding Skills",
      icon: <BrainCircuit className="text-primary" size={28} />,
      skills: [
        { name: "Flow State Programming", icon: <Workflow className="w-6 h-6 lg:w-7 lg:h-7 text-[#0077CC]" /> },
        { name: "Creative Problem Solving", icon: <Sparkles className="w-6 h-6 lg:w-7 lg:h-7 text-[#E89122]" /> },
        { name: "Intuitive Design", icon: <PenTool className="w-6 h-6 lg:w-7 lg:h-7 text-[#0077CC]" /> },
        { name: "Rapid Prototyping", icon: <Rocket className="w-6 h-6 lg:w-7 lg:h-7 text-[#E89122]" /> },
      ]
    },
    {
      title: "Programming Languages",
      icon: <Code2 className="text-primary" size={28} />,
      skills: [
        { name: "Python", icon: <SiPython className="w-6 h-6 lg:w-7 lg:h-7 text-[#3776AB]" /> },
        { name: "JavaScript", icon: <SiJavascript className="w-6 h-6 lg:w-7 lg:h-7 text-[#F7DF1E]" /> },
        { name: "TypeScript", icon: <SiTypescript className="w-6 h-6 lg:w-7 lg:h-7 text-[#3178C6]" /> },
      ]
    },
    {
      title: "Web Development",
      icon: <Globe className="text-primary" size={28} />,
      skills: [
        { name: "React", icon: <SiReact className="w-6 h-6 lg:w-7 lg:h-7 text-[#61DAFB]" /> },
        { name: "Node.js", icon: <SiNodedotjs className="w-6 h-6 lg:w-7 lg:h-7 text-[#339933]" /> },
        { name: "Next.js", icon: <SiNextdotjs className="w-6 h-6 lg:w-7 lg:h-7 text-foreground" /> },
        { name: "HTML5", icon: <SiHtml5 className="w-6 h-6 lg:w-7 lg:h-7 text-[#E34F26]" /> },
        { name: "CSS3", icon: <Palette className="w-6 h-6 lg:w-7 lg:h-7 text-[#1572B6]" /> },
        { name: "TailwindCSS", icon: <SiTailwindcss className="w-6 h-6 lg:w-7 lg:h-7 text-[#06B6D4]" /> },
      ]
    },
    {
      title: "AI & Machine Learning",
      icon: <Brain className="text-primary" size={28} />,
      skills: [
        { name: "Prompt Engineering", icon: <MessageSquareQuote className="w-6 h-6 lg:w-7 lg:h-7 text-[#0077CC]" /> },
        { name: "OpenAI / LLMs", icon: <SiOpenai className="w-6 h-6 lg:w-7 lg:h-7 text-foreground" /> },
        { name: "LangChain", icon: <SiLangchain className="w-6 h-6 lg:w-7 lg:h-7 text-[#1C3C3C]" /> },
        { name: "Hugging Face", icon: <SiHuggingface className="w-6 h-6 lg:w-7 lg:h-7 text-[#FFD21E]" /> },
        { name: "TensorFlow", icon: <SiTensorflow className="w-6 h-6 lg:w-7 lg:h-7 text-[#FF6F00]" /> },
        { name: "Neural Networks", icon: <Network className="w-6 h-6 lg:w-7 lg:h-7 text-[#E89122]" /> },
      ]
    },
    {
      title: "Data Science",
      icon: <Microscope className="text-primary" size={28} />,
      skills: [
        { name: "Pandas", icon: <SiPandas className="w-6 h-6 lg:w-7 lg:h-7 text-[#150458]" /> },
        { name: "NumPy", icon: <SiNumpy className="w-6 h-6 lg:w-7 lg:h-7 text-[#013243]" /> },
        { name: "scikit-learn", icon: <SiScikitlearn className="w-6 h-6 lg:w-7 lg:h-7 text-[#F7931E]" /> },
        { name: "Jupyter / Colab", icon: <SiGooglecolab className="w-6 h-6 lg:w-7 lg:h-7 text-[#F9AB00]" /> },
      ]
    },
    {
      title: "Databases",
      icon: <Database className="text-primary" size={28} />,
      skills: [
        { name: "MongoDB", icon: <SiMongodb className="w-6 h-6 lg:w-7 lg:h-7 text-[#47A248]" /> },
        { name: "PostgreSQL", icon: <SiPostgresql className="w-6 h-6 lg:w-7 lg:h-7 text-[#4169E1]" /> },
        { name: "MySQL", icon: <SiMysql className="w-6 h-6 lg:w-7 lg:h-7 text-[#4479A1]" /> },
        { name: "Supabase", icon: <SiSupabase className="w-6 h-6 lg:w-7 lg:h-7 text-[#3ECF8E]" /> },
        { name: "Redis", icon: <SiRedis className="w-6 h-6 lg:w-7 lg:h-7 text-[#DC382D]" /> },
      ]
    },
    {
      title: "DevOps & Cloud",
      icon: <Layers className="text-primary" size={28} />,
      skills: [
        { name: "Docker", icon: <SiDocker className="w-6 h-6 lg:w-7 lg:h-7 text-[#2496ED]" /> },
        { name: "GitHub Actions", icon: <SiGithubactions className="w-6 h-6 lg:w-7 lg:h-7 text-[#2088FF]" /> },
        { name: "Vercel", icon: <SiVercel className="w-6 h-6 lg:w-7 lg:h-7 text-foreground" /> },
        { name: "Git", icon: <SiGit className="w-6 h-6 lg:w-7 lg:h-7 text-[#F05032]" /> },
        { name: "Linux", icon: <SiLinux className="w-6 h-6 lg:w-7 lg:h-7 text-[#FCC624]" /> },
      ]
    },
    {
      title: "Frameworks & Libraries",
      icon: <Cpu className="text-primary" size={28} />,
      skills: [
        { name: "Express", icon: <SiExpress className="w-6 h-6 lg:w-7 lg:h-7 text-foreground" /> },
        { name: "Django", icon: <SiDjango className="w-6 h-6 lg:w-7 lg:h-7 text-[#092E20]" /> },
        { name: "Flask", icon: <SiFlask className="w-6 h-6 lg:w-7 lg:h-7 text-foreground" /> },
        { name: "FastAPI", icon: <SiFastapi className="w-6 h-6 lg:w-7 lg:h-7 text-[#009688]" /> },
        { name: "Socket.io", icon: <SiSocketdotio className="w-6 h-6 lg:w-7 lg:h-7 text-foreground" /> },
      ]
    },
    {
      title: "APIs & Tools",
      icon: <Wrench className="text-primary" size={28} />,
      skills: [
        { name: "GraphQL", icon: <SiGraphql className="w-6 h-6 lg:w-7 lg:h-7 text-[#E10098]" /> },
        { name: "REST APIs", icon: <Plug className="w-6 h-6 lg:w-7 lg:h-7 text-[#0077CC]" /> },
        { name: "VS Code", icon: <SiVscodium className="w-6 h-6 lg:w-7 lg:h-7 text-[#0078D7]" /> },
        { name: "Postman", icon: <SiPostman className="w-6 h-6 lg:w-7 lg:h-7 text-[#FF6C37]" /> },
        { name: "Vite", icon: <SiVite className="w-6 h-6 lg:w-7 lg:h-7 text-[#646CFF]" /> },
      ]
    },
    {
      title: "Design & UI/UX",
      icon: <PencilRuler className="text-primary" size={28} />,
      skills: [
        { name: "Figma", icon: <SiFigma className="w-6 h-6 lg:w-7 lg:h-7 text-[#F24E1E]" /> },
        { name: "UI/UX Research", icon: <Search className="w-6 h-6 lg:w-7 lg:h-7 text-[#E89122]" /> },
        { name: "Adobe Suite", icon: <Paintbrush className="w-6 h-6 lg:w-7 lg:h-7 text-[#FF0000]" /> },
        { name: "3D / Blender", icon: <SiBlender className="w-6 h-6 lg:w-7 lg:h-7 text-[#F5792A]" /> },
      ]
    },
    {
      title: "Teaching & Leadership",
      icon: <CheckCircle className="text-primary" size={28} />,
      skills: [
        { name: "AI/BI Training", icon: <BookOpen className="w-6 h-6 lg:w-7 lg:h-7 text-[#0077CC]" /> },
        { name: "Campus Ambassador", icon: <Award className="w-6 h-6 lg:w-7 lg:h-7 text-[#E89122]" /> },
        { name: "Student Mentoring", icon: <HeartHandshake className="w-6 h-6 lg:w-7 lg:h-7 text-[#0077CC]" /> },
        { name: "Technical Communication", icon: <MessageCircle className="w-6 h-6 lg:w-7 lg:h-7 text-[#E89122]" /> },
        { name: "Team Leadership", icon: <Crown className="w-6 h-6 lg:w-7 lg:h-7 text-[#0077CC]" /> },
        { name: "Problem Solving", icon: <Telescope className="w-6 h-6 lg:w-7 lg:h-7 text-[#E89122]" /> },
      ]
    }
  ];

  useEffect(() => {
    if (effectiveMode === 'off') return;
    if (!sectionRef.current) return;

    // Use IntersectionObserver so the animation only plays when the section
    // actually enters the viewport. This avoids the lazy-load race where
    // ScrollTrigger fires before layout settles and leaves content at opacity 0.
    let observer: IntersectionObserver | null = null;
    let played = false;

    const play = () => {
      if (played) return;
      played = true;
      observer?.disconnect();

      const ctx = gsap.context(() => {
        const tl = gsap.timeline();

        tl.from('.gsap-skills-header', {
          opacity: 0,
          y: 30,
          duration: effectiveMode === 'reduced' ? 0.35 : 0.5,
          stagger: 0.15,
          ease: 'power3.out',
          immediateRender: false,
        });

        tl.from('.gsap-skills-category', {
          opacity: 0,
          y: 40,
          scale: 0.96,
          duration: effectiveMode === 'reduced' ? 0.35 : 0.55,
          stagger: 0.08,
          ease: 'power2.out',
          immediateRender: false,
        }, '-=0.3');

        tl.from('.gsap-skills-footer', {
          opacity: 0,
          y: 35,
          duration: effectiveMode === 'reduced' ? 0.35 : 0.55,
          ease: 'power3.out',
          immediateRender: false,
        }, '-=0.4');
      }, sectionRef);

      return () => ctx.revert();
    };

    if (typeof IntersectionObserver === 'undefined') {
      play();
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            play();
            break;
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(sectionRef.current);

    return () => observer?.disconnect();
  }, [effectiveMode]);

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-transparent" ref={sectionRef}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 -z-10" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-primary/10 rounded-full animate-pulse-slow opacity-20" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-primary/10 rounded-full animate-reverse-pulse opacity-20" />
      </div>

      <div className="section-container relative z-content">
        <h2 className="gsap-skills-header section-title text-3xl md:text-5xl text-center text-gradient">
          Technical Expertise
        </h2>

        <p className="gsap-skills-header section-subtitle">
          A comprehensive toolbox of cutting-edge technologies I've mastered through continuous learning
        </p>

        <div className="gsap-skills-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {skillCategories.map((category) => (
            <div
              key={category.title}
              className="gsap-skills-category bg-card/60 backdrop-blur-sm p-6 border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1.5 h-full rounded-xl shadow-sm group/card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg border border-border">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground">{category.title}</h3>
              </div>

              <div className="grid grid-cols-3 gap-3 lg:gap-4">
                {category.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex flex-col items-center justify-center group/skill"
                  >
                    <div
                      className="w-12 h-12 lg:w-16 lg:h-16 bg-muted/50 rounded-lg flex items-center justify-center mb-2 hover:bg-primary/10 transition-all border border-border hover:border-primary/20 duration-300 hover:scale-110 hover:-rotate-3"
                    >
                      {skill.icon}
                    </div>
                    <span className="text-center text-[11px] lg:text-xs text-muted-foreground group-hover/skill:text-foreground transition-colors duration-300 leading-tight">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="gsap-skills-footer mt-16 bg-card/60 backdrop-blur-md rounded-2xl p-8 text-center relative overflow-hidden border border-primary/10 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 z-base" />

          <div className="relative z-content">
            <h3 className="text-2xl font-bold mb-4 text-foreground">Always Learning & Growing</h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              As a passionate technologist, I'm constantly expanding my skillset through continuous learning,
              hands-on projects, and collaboration with industry experts. I believe in staying ahead of emerging
              technologies and applying them to build innovative solutions that solve real-world problems.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
                {[
                  { label: "Quick Learner", icon: "M22 12h-4l-3 9L9 3l-3 9H2" },
                  { label: "Problem Solver", icon: "M18 8h1a4 4 0 1 1 0 8h-1 M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" },
                  { label: "Innovative Thinker", icon: "M12 2v4 M12 18v4 M4.93 4.93l2.83 2.83 M16.24 16.24l2.83 2.83 M2 12h4 M18 12h4 M4.93 19.07l2.83-2.83 M16.24 7.76l2.83-2.83" },
                  { label: "Modular Approach", icon: "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z" },
                ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full border border-border text-foreground transition-all duration-300 hover:scale-105 hover:bg-primary/10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d={item.icon} />
                  </svg>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Skills.displayName = 'Skills';

export default Skills;
