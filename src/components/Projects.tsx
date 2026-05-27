import { useState, memo, useEffect, useRef } from "react";
import { Code2, Users, Bot, ExternalLink, Github, Play } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  features: string[];
  category: string;
  type: string;
  icon: React.ReactNode;
  gradient: string;
  liveUrl: string;
  githubUrl: string;
}

interface ProjectCardProps {
  project: Project;
  isActive: boolean;
  onClick: () => void;
}

interface ProjectDetailsProps {
  project: Project;
}

const projectsData: Project[] = [
  {
    id: 1,
    title: "BOOKSTORE",
    subtitle: "E-com platform for Books",
    description: `✨ BOOK_STORE – Full-stack Book Store web application built with a React/Next.js frontend and a Node.js/Express backend for browsing, managing and purchasing books.
                  ✨ Implemented RESTful APIs, user interactions, and dynamic UI components to deliver seamless book catalog browsing and cart functionality.`,
    technologies: ["React", "TypeScript", "Node.js", "MongoDB", "Socket.io", "Express.js"],
    features: [
      "AI-powered book recommendation system",
      "User-friendly book browsing and search",
      "Secure authentication and user accounts",
      "Shopping cart and order management",
      "RESTful API integration with dynamic UI"
    ],
    category: "Full-Stack Development",
    type: "coding",
    icon: <Code2 className="w-8 h-8" />,
    gradient: "from-primary via-accent to-primary",
    liveUrl: "https://bookstore-vn.vercel.app/",
    githubUrl: "https://github.com/rolex132/BOOK_STORE.git"
  },
  {
    id: 2,
    title: "Naan Mudhalvan",
    subtitle: "AI & BI Education Initiative",
    description: "A comprehensive educational program where I personally mentor and teach 150+ students in Artificial Intelligence and Business Intelligence through hands-on workshops, practical sessions, and real-world project guidance.",
    technologies: ["Python", "Jupyter Notebooks", "TensorFlow", "Power BI", "Tableau", "Data Analytics"],
    features: [
      "Live class sessions with 150+ students",
      "Hands-on AI/BI project workshops",
      "Personalized mentorship programs",
      "Real-world case study implementations",
      "Student progress tracking and assessment"
    ],
    category: "Education & Mentorship",
    type: "physical",
    icon: <Users className="w-8 h-8" />,
    gradient: "from-primary via-accent to-primary",
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: 3,
    title: "Chat Bot UI using React.js",
    subtitle: "ChatGPT clone ",
    description: "A modern and responsive ChatGPT-like web interface built to interact with AI models, providing real-time conversational experiences with a clean UI and smooth user interactions.",
    technologies: ["React", "Tailwind CSS", "TypeScript"],
    features: [
       "ChatGPT-style conversational user interface",
       "Real-time message rendering with smooth UX",
       "Responsive design for desktop and mobile",
       "Reusable and modular UI components",
       "Clean state management for chat history"
    ],
    category: "AI/ML Development",
    type: "coding",
    icon: <Bot className="w-8 h-8" />,
    gradient: "from-primary via-accent to-primary",
    liveUrl: "https://v0-smart-document-summarizer.vercel.app",
    githubUrl: "https://github.com/sparrow-003/chat-gpt-ui.git"
  }
];

const ProjectCard = ({ project, isActive, onClick }: ProjectCardProps) => {
  return (
    <div
      className={`gsap-project-card relative cursor-pointer group transition-all duration-500 hover:-translate-y-2 active:scale-95 ${isActive ? 'scale-105' : 'scale-100 hover:scale-102'}`}
      onClick={onClick}
    >
      <div className={`
        relative overflow-hidden rounded-3xl border backdrop-blur-xl
        ${isActive
          ? `bg-gradient-to-br ${project.gradient} p-1 border-primary/40 shadow-2xl shadow-primary/20`
          : 'bg-card/60 border-border hover:border-primary/40'
        }
        transition-all duration-700
      `}>
        <div className="relative bg-card/95 rounded-3xl p-6 h-full backdrop-blur-sm">
          {/* Type indicator */}
          <div className="absolute top-4 right-4">
            <span className={`
              px-3 py-1 rounded-full text-xs font-medium
              ${project.type === 'coding'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-accent/10 text-accent-foreground border border-accent/20'
              }
            `}>
              {project.type === 'coding' ? 'Genesis Engine' : 'Knowledge Node'}
            </span>
          </div>

          {/* Icon */}
          <div className="inline-flex p-3 rounded-2xl mb-4 bg-primary text-primary-foreground shadow-lg">
            {project.icon}
          </div>

          {/* Content */}
          <h3 className="text-2xl font-bold text-foreground mb-2">{project.title}</h3>
          <p className="text-sm font-medium text-muted-foreground mb-3">{project.subtitle}</p>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
            {project.description}
          </p>

          {/* Category */}
          <div className="text-xs text-muted-foreground/70 font-medium mb-4">
            {project.category}
          </div>

          {/* Tech stack preview */}
          <div className="flex flex-wrap gap-1 mb-4">
            {project.technologies.slice(0, 3).map((tech: string, i: number) => (
              <span key={i} className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-xs px-2 py-1 bg-muted/50 rounded-full text-muted-foreground/70">
                +{project.technologies.length - 3} more
              </span>
            )}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-all duration-500 bg-primary mix-blend-overlay" />
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
};

const ProjectDetails = ({ project }: ProjectDetailsProps) => {
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Elegant quick fade & slide reveal when activeProject changes
    gsap.fromTo(detailsRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, [project]);

  return (
    <div ref={detailsRef} className="relative gsap-project-details-inner">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 p-[1px] shadow-2xl shadow-primary/10">
        <div className="relative bg-card/95 rounded-3xl backdrop-blur-xl">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-30 rounded-3xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            {/* Left side - Visual */}
            <div className="relative p-6 lg:p-12 flex flex-col justify-center">
              <div className="inline-flex p-4 rounded-3xl mb-6 bg-primary text-primary-foreground shadow-2xl">
                {project.icon}
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                {project.title}
              </h2>
              <p className="text-xl text-muted-foreground mb-6 font-medium">
                {project.subtitle}
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                {project.description}
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 active:scale-98"
                >
                  <Play className="w-5 h-5" />
                  {project.type === 'coding' ? 'Live Demo' : 'Learn More'}
                </a>

                {project.type === 'coding' && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold bg-muted text-foreground border border-border hover:bg-muted/80 transition-all duration-300 hover:scale-105 active:scale-98"
                  >
                    <Github className="w-5 h-5" />
                    Source Code
                  </a>
                )}
              </div>
            </div>

            {/* Right side - Details */}
            <div className="p-8 lg:p-12 border-l border-border">
              {/* Technologies */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
                  Tech Stack Integration
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {project.technologies.map((tech: string, i: number) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-muted rounded-xl text-muted-foreground text-sm font-medium text-center backdrop-blur-sm border border-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key features */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Key Features
                </h3>
                <div className="space-y-3">
                  {project.features.map((feature: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 group"
                    >
                      <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-primary group-hover:scale-125 transition-transform duration-300" />
                      <span className="text-muted-foreground leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Projects = memo(() => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState(projectsData[0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // High-performance unified timeline triggered securely by the section ref
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      });

      // Header animations
      tl.from('.gsap-projects-header', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
      });

      // Stagger selection cards pop-in
      tl.from('.gsap-project-card', {
        opacity: 0,
        y: 35,
        scale: 0.96,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
      }, '-=0.3');

      // Bottom details panel fade-in
      tl.from('.gsap-projects-details-container', {
        opacity: 0,
        y: 35,
        duration: 0.8,
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
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="section-container relative bg-transparent">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent -z-10" />
      <div className="projects-section">
        {/* Enhanced background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-primary/5 via-transparent to-transparent rounded-full opacity-20" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="gsap-projects-header inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 mb-6 transition-all duration-300 hover:scale-105 hover:bg-primary/20 cursor-default">
              <Code2 className="w-5 h-5 text-primary" />
              <span className="text-primary font-bold uppercase tracking-widest text-xs">Featured Work</span>
            </div>

            <h2 className="gsap-projects-header text-5xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent mb-6">
              My Portfolio
            </h2>
            <p className="gsap-projects-header text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Showcasing my journey in development, education, and innovation. Each project represents
              a unique challenge solved through creativity and technical expertise.
            </p>
          </div>

          {/* Project navigation */}
          <div className="gsap-projects-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {projectsData.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isActive={activeProject.id === project.id}
                onClick={() => setActiveProject(project)}
              />
            ))}
          </div>

          {/* Active project details */}
          <div className="gsap-projects-details-container">
            <ProjectDetails project={activeProject} />
          </div>
        </div>
      </div>
    </section>
  );
});

Projects.displayName = 'Projects';

export default Projects;
