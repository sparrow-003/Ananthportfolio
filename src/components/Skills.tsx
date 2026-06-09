import { memo } from 'react';
import { BrainCircuit, Globe, Layers, Cpu, PencilRuler, CheckCircle } from 'lucide-react';
import { Workflow, Sparkles, Rocket, MessageSquareQuote, Brain, Network, Plug, Search, Award, Crown, MessageCircle, Wrench, HeartHandshake, Microscope, BookOpen, PenTool, Telescope, Code2, Palette, Paintbrush, Database } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { TechGlyph } from './TechGlyph';

const Skills = memo(() => {
  const [sectionRef, inView] = useReveal<HTMLDivElement>(0.08, 500);

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
        { name: "Python", icon: <TechGlyph name="Python" className="w-6 h-6 lg:w-7 lg:h-7 text-primary" /> },
        { name: "JavaScript", icon: <TechGlyph name="JavaScript" className="w-6 h-6 lg:w-7 lg:h-7 text-accent" /> },
        { name: "TypeScript", icon: <TechGlyph name="TypeScript" className="w-6 h-6 lg:w-7 lg:h-7 text-primary" /> },
      ]
    },
    {
      title: "Web Development",
      icon: <Globe className="text-primary" size={28} />,
      skills: [
        { name: "React", icon: <TechGlyph name="React" className="w-6 h-6 lg:w-7 lg:h-7 text-primary" /> },
        { name: "Node.js", icon: <TechGlyph name="Node.js" className="w-6 h-6 lg:w-7 lg:h-7 text-primary" /> },
        { name: "Next.js", icon: <TechGlyph name="Next.js" className="w-6 h-6 lg:w-7 lg:h-7 text-foreground" /> },
        { name: "HTML5", icon: <TechGlyph name="HTML5" className="w-6 h-6 lg:w-7 lg:h-7 text-accent" /> },
        { name: "CSS3", icon: <Palette className="w-6 h-6 lg:w-7 lg:h-7 text-[#1572B6]" /> },
        { name: "TailwindCSS", icon: <TechGlyph name="TailwindCSS" className="w-6 h-6 lg:w-7 lg:h-7 text-primary" /> },
      ]
    },
    {
      title: "AI & Machine Learning",
      icon: <Brain className="text-primary" size={28} />,
      skills: [
        { name: "Prompt Engineering", icon: <MessageSquareQuote className="w-6 h-6 lg:w-7 lg:h-7 text-[#0077CC]" /> },
        { name: "OpenAI / LLMs", icon: <TechGlyph name="OpenAI" className="w-6 h-6 lg:w-7 lg:h-7 text-foreground" /> },
        { name: "LangChain", icon: <TechGlyph name="LangChain" className="w-6 h-6 lg:w-7 lg:h-7 text-primary" /> },
        { name: "Hugging Face", icon: <TechGlyph name="Hugging Face" className="w-6 h-6 lg:w-7 lg:h-7 text-accent" /> },
        { name: "TensorFlow", icon: <TechGlyph name="TensorFlow" className="w-6 h-6 lg:w-7 lg:h-7 text-accent" /> },
        { name: "Neural Networks", icon: <Network className="w-6 h-6 lg:w-7 lg:h-7 text-[#E89122]" /> },
      ]
    },
    {
      title: "Data Science",
      icon: <Microscope className="text-primary" size={28} />,
      skills: [
        { name: "Pandas", icon: <TechGlyph name="Pandas" className="w-6 h-6 lg:w-7 lg:h-7 text-primary" /> },
        { name: "NumPy", icon: <TechGlyph name="NumPy" className="w-6 h-6 lg:w-7 lg:h-7 text-foreground" /> },
        { name: "scikit-learn", icon: <TechGlyph name="scikit-learn" className="w-6 h-6 lg:w-7 lg:h-7 text-accent" /> },
        { name: "Jupyter / Colab", icon: <TechGlyph name="Jupyter / Colab" className="w-6 h-6 lg:w-7 lg:h-7 text-primary" /> },
      ]
    },
    {
      title: "Databases",
      icon: <Database className="text-primary" size={28} />,
      skills: [
        { name: "MongoDB", icon: <TechGlyph name="MongoDB" className="w-6 h-6 lg:w-7 lg:h-7 text-primary" /> },
        { name: "PostgreSQL", icon: <TechGlyph name="PostgreSQL" className="w-6 h-6 lg:w-7 lg:h-7 text-primary" /> },
        { name: "MySQL", icon: <TechGlyph name="MySQL" className="w-6 h-6 lg:w-7 lg:h-7 text-accent" /> },
        { name: "Supabase", icon: <TechGlyph name="Supabase" className="w-6 h-6 lg:w-7 lg:h-7 text-primary" /> },
        { name: "Redis", icon: <TechGlyph name="Redis" className="w-6 h-6 lg:w-7 lg:h-7 text-destructive" /> },
      ]
    },
    {
      title: "DevOps & Cloud",
      icon: <Layers className="text-primary" size={28} />,
      skills: [
        { name: "Docker", icon: <TechGlyph name="Docker" className="w-6 h-6 lg:w-7 lg:h-7 text-primary" /> },
        { name: "GitHub Actions", icon: <TechGlyph name="GitHub Actions" className="w-6 h-6 lg:w-7 lg:h-7 text-primary" /> },
        { name: "Vercel", icon: <TechGlyph name="Vercel" className="w-6 h-6 lg:w-7 lg:h-7 text-foreground" /> },
        { name: "Git", icon: <TechGlyph name="Git" className="w-6 h-6 lg:w-7 lg:h-7 text-accent" /> },
        { name: "Linux", icon: <TechGlyph name="Linux" className="w-6 h-6 lg:w-7 lg:h-7 text-accent" /> },
      ]
    },
    {
      title: "Frameworks & Libraries",
      icon: <Cpu className="text-primary" size={28} />,
      skills: [
        { name: "Express", icon: <TechGlyph name="Express" className="w-6 h-6 lg:w-7 lg:h-7 text-foreground" /> },
        { name: "Django", icon: <TechGlyph name="Django" className="w-6 h-6 lg:w-7 lg:h-7 text-primary" /> },
        { name: "Flask", icon: <TechGlyph name="Flask" className="w-6 h-6 lg:w-7 lg:h-7 text-foreground" /> },
        { name: "FastAPI", icon: <TechGlyph name="FastAPI" className="w-6 h-6 lg:w-7 lg:h-7 text-primary" /> },
        { name: "Socket.io", icon: <TechGlyph name="Socket.io" className="w-6 h-6 lg:w-7 lg:h-7 text-foreground" /> },
      ]
    },
    {
      title: "APIs & Tools",
      icon: <Wrench className="text-primary" size={28} />,
      skills: [
        { name: "GraphQL", icon: <TechGlyph name="GraphQL" className="w-6 h-6 lg:w-7 lg:h-7 text-primary" /> },
        { name: "REST APIs", icon: <Plug className="w-6 h-6 lg:w-7 lg:h-7 text-[#0077CC]" /> },
        { name: "VS Code", icon: <TechGlyph name="VS Code" className="w-6 h-6 lg:w-7 lg:h-7 text-primary" /> },
        { name: "Postman", icon: <TechGlyph name="Postman" className="w-6 h-6 lg:w-7 lg:h-7 text-accent" /> },
        { name: "Vite", icon: <TechGlyph name="Vite" className="w-6 h-6 lg:w-7 lg:h-7 text-primary" /> },
      ]
    },
    {
      title: "Design & UI/UX",
      icon: <PencilRuler className="text-primary" size={28} />,
      skills: [
        { name: "Figma", icon: <TechGlyph name="Figma" className="w-6 h-6 lg:w-7 lg:h-7 text-accent" /> },
        { name: "UI/UX Research", icon: <Search className="w-6 h-6 lg:w-7 lg:h-7 text-[#E89122]" /> },
        { name: "Adobe Suite", icon: <Paintbrush className="w-6 h-6 lg:w-7 lg:h-7 text-[#FF0000]" /> },
        { name: "3D / Blender", icon: <TechGlyph name="3D / Blender" className="w-6 h-6 lg:w-7 lg:h-7 text-accent" /> },
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

  // Reveal is handled by CSS (.is-revealed + .reveal-target) toggled via
  // the inView flag from useReveal. The previous GSAP tl.from()
  // implementation could leave elements stuck at opacity 0 after a
  // context revert in React 18 strict mode.

  return (
    <section
      id="skills"
      className={`py-24 relative overflow-hidden bg-transparent reveal-stagger ${inView ? 'is-revealed' : ''}`}
      ref={sectionRef}
    >
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
        <h2 className="reveal-target gsap-skills-header section-title text-3xl md:text-5xl text-center text-gradient">
          Technical Expertise
        </h2>

        <p className="reveal-target gsap-skills-header section-subtitle">
          A comprehensive toolbox of cutting-edge technologies I've mastered through continuous learning
        </p>

        <div className="gsap-skills-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 reveal-stagger">
          {skillCategories.map((category) => (
            <div
              key={category.title}
              className="reveal-target gsap-skills-category bg-card/60 backdrop-blur-sm p-6 border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1.5 h-full rounded-xl shadow-sm group/card"
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

        <div className="reveal-target gsap-skills-footer mt-16 bg-card/60 backdrop-blur-md rounded-2xl p-8 text-center relative overflow-hidden border border-primary/10 shadow-xl">
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
