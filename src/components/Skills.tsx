import { memo, useEffect, useRef } from 'react';
import { Code, BrainCircuit, Database, Globe, Layers, Cpu, PencilRuler, CheckCircle } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAnimationPreference } from '@/contexts/AnimationContext';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const Skills = memo(() => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { effectiveMode } = useAnimationPreference();

  const skillCategories = [
    {
      title: "Vibe Coding Skills",
      icon: <BrainCircuit className="text-primary" size={28} />,
      skills: [
        { name: "Flow State Programming", icon: "https://img.icons8.com/color/48/meditation.png" },
        { name: "Creative Problem Solving", icon: "https://img.icons8.com/color/48/creative-thinking.png" },
        { name: "Intuitive Design", icon: "https://img.icons8.com/color/48/design.png" },
        { name: "Rapid Prototyping", icon: "https://img.icons8.com/color/48/prototype.png" },
      ]
    },
    {
      title: "Programming Languages",
      icon: <Code className="text-primary" size={28} />,
      skills: [
        { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
        { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
        { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
      ]
    },
    {
      title: "Web Development",
      icon: <Globe className="text-primary" size={28} />,
      skills: [
        { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
        { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
        { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
        { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
        { name: "TailwindCSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" },
      ]
    },
    {
      title: "AI & Machine Learning",
      icon: <BrainCircuit className="text-primary" size={28} />,
      skills: [
        { name: "Prompt Engineering", icon: "https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-ai-industry-4-flaticons-flat-flat-icons.png" },
        { name: "LLM", icon: "https://img.icons8.com/color/48/artificial-intelligence.png" },
        { name: "LangChain", icon: "https://img.icons8.com/external-tal-revivo-color-tal-revivo/96/external-chainlink-is-a-blockchain-abstraction-layer-that-enables-universally-connected-smart-contracts-logo-color-tal-revivo.png" },
        { name: "Neural Network", icon: "https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-neural-network-robotics-flaticons-lineal-color-flat-icons.png" },
        { name: "Hugging Face", icon: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg" },
        { name: "API Integration", icon: "https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-api-no-code-flaticons-flat-flat-icons.png" },
      ]
    },
    {
      title: "Databases",
      icon: <Database className="text-primary" size={28} />,
      skills: [
        { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
        { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
        { name: "Supabase", icon: "https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png" },
      ]
    },
    {
      title: "DevOps & Cloud",
      icon: <Layers className="text-primary" size={28} />,
      skills: [
        { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
        { name: "GitHub Actions", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
      ]
    },
    {
      title: "Frameworks & Libraries",
      icon: <Cpu className="text-primary" size={28} />,
      skills: [
        { name: "Express", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
        { name: "Django", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
        { name: "Flask", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" },
      ]
    },
    {
      title: "Design & UI/UX",
      icon: <PencilRuler className="text-primary" size={28} />,
      skills: [
        { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
        { name: "UI/UX Research", icon: "https://img.icons8.com/fluency/48/test-lab.png" },
      ]
    },
    {
      title: "Teaching & Leadership",
      icon: <CheckCircle className="text-primary" size={28} />,
      skills: [
        { name: "AI/BI Training", icon: "https://img.icons8.com/color/48/artificial-intelligence.png" },
        { name: "Campus Ambassador", icon: "https://img.icons8.com/color/48/ambassador.png" },
        { name: "Student Mentoring", icon: "https://img.icons8.com/color/48/mentor.png" },
        { name: "Technical Communication", icon: "https://img.icons8.com/color/48/communication--v1.png" },
        { name: "Team Leadership", icon: "https://img.icons8.com/color/48/conference-call--v1.png" },
        { name: "Problem Solving", icon: "https://img.icons8.com/color/48/solution.png" },
      ]
    }
  ];

  useEffect(() => {
    if (effectiveMode === 'off') return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      });

      tl.from('.gsap-skills-header', {
        opacity: 0,
        y: 30,
        duration: effectiveMode === 'reduced' ? 0.35 : 0.5,
        stagger: 0.15,
        ease: 'power3.out',
      });

      tl.from('.gsap-skills-category', {
        opacity: 0,
        y: 40,
        scale: 0.96,
        duration: effectiveMode === 'reduced' ? 0.35 : 0.55,
        stagger: 0.08,
        ease: 'power2.out',
      }, '-=0.3');

      tl.from('.gsap-skills-footer', {
        opacity: 0,
        y: 35,
        duration: effectiveMode === 'reduced' ? 0.35 : 0.55,
        ease: 'power3.out',
      }, '-=0.4');
    }, sectionRef);

    // Refresh ScrollTrigger to recalculate dynamic viewport measures
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
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

      <div className="section-container relative z-10">
        <h2 className="gsap-skills-header section-title text-3xl md:text-5xl text-center text-gradient">
          Technical Expertise
        </h2>

        <p className="gsap-skills-header section-subtitle">
          A comprehensive toolbox of cutting-edge technologies I've mastered through continuous learning
        </p>

        <div className="gsap-skills-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
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

              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                {category.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex flex-col items-center justify-center group/skill"
                  >
                    <div
                      className="w-12 h-12 lg:w-16 lg:h-16 bg-muted/50 rounded-lg flex items-center justify-center mb-2 hover:bg-primary/10 transition-all border border-border hover:border-primary/20 duration-300 hover:scale-105 hover:rotate-2"
                    >
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        className="w-6 h-6 lg:w-8 lg:h-8 object-contain opacity-80 group-hover/skill:opacity-100 transition-all dark:filter dark:brightness-110 duration-300"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-center text-xs lg:text-sm text-muted-foreground group-hover/skill:text-foreground transition-colors duration-300">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="gsap-skills-footer mt-16 bg-card/60 backdrop-blur-md rounded-2xl p-8 text-center relative overflow-hidden border border-primary/10 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 z-0" />

          <div className="relative z-10">
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
