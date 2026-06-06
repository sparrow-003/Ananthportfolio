import { useState, memo } from "react";
import {
  ArrowUpRight,
  Github,
  Play,
  Sparkles,
  BookOpen,
  Users,
  Bot,
  Star,
  Calendar,
  Layers,
  Tag,
} from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import {
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiSocketdotio,
  SiTypescript,
  SiTailwindcss,
  SiPython,
  SiJupyter,
  SiTensorflow,
  SiOpenai,
  SiLangchain,
  SiVercel,
  SiGooglecolab,
} from "react-icons/si";

interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  technologies: { name: string; icon: React.ReactNode; color: string }[];
  features: string[];
  category: string;
  type: "coding" | "physical";
  accent: "blue" | "orange" | "violet";
  stats: { label: string; value: string }[];
  liveUrl: string;
  githubUrl: string;
  year: string;
  status: "Live" | "In Production" | "Ongoing";
}

const projectsData: Project[] = [
  {
    id: 1,
    title: "BookStore",
    subtitle: "Full-Stack E-commerce Platform",
    description:
      "A complete online bookstore with catalog browsing, cart, checkout, and an AI-powered recommendation engine.",
    longDescription:
      "BOOK_STORE is a production-grade full-stack web application. It features a React/Next.js front-end, a Node.js/Express REST API, MongoDB persistence, and a real-time socket layer for live cart updates. The platform includes secure auth, admin dashboards, and a TensorFlow-based recommender that suggests books based on browsing history.",
    technologies: [
      { name: "React", icon: <SiReact className="w-4 h-4" />, color: "#61DAFB" },
      { name: "Next.js", icon: <SiNextdotjs className="w-4 h-4" />, color: "#FFFFFF" },
      { name: "Node.js", icon: <SiNodedotjs className="w-4 h-4" />, color: "#339933" },
      { name: "Express", icon: <SiExpress className="w-4 h-4" />, color: "#FFFFFF" },
      { name: "MongoDB", icon: <SiMongodb className="w-4 h-4" />, color: "#47A248" },
      { name: "Socket.io", icon: <SiSocketdotio className="w-4 h-4" />, color: "#FFFFFF" },
      { name: "TypeScript", icon: <SiTypescript className="w-4 h-4" />, color: "#3178C6" },
    ],
    features: [
      "AI-powered book recommendation system",
      "Real-time cart updates via WebSockets",
      "Secure JWT authentication with refresh tokens",
      "Admin dashboard for inventory & orders",
      "Stripe-ready checkout flow",
    ],
    category: "Full-Stack Development",
    type: "coding",
    accent: "blue",
    stats: [
      { label: "Status", value: "Live" },
      { label: "Stack", value: "MERN" },
      { label: "Year", value: "2024" },
    ],
    liveUrl: "https://bookstore-vn.vercel.app/",
    githubUrl: "https://github.com/rolex132/BOOK_STORE.git",
    year: "2024",
    status: "Live",
  },
  {
    id: 2,
    title: "Naan Mudhalvan",
    subtitle: "AI & BI Mentorship Program",
    description:
      "Personal mentorship of 150+ students in AI and Business Intelligence through hands-on workshops and project guidance.",
    longDescription:
      "As a mentor under Tamil Nadu's flagship Naan Mudhalvan initiative, I designed and delivered a 12-week curriculum covering Python, data analysis, machine learning, and Power BI. I personally coached 150+ students through real industry case studies, culminating in capstone projects that were demoed to academic evaluators.",
    technologies: [
      { name: "Python", icon: <SiPython className="w-4 h-4" />, color: "#3776AB" },
      { name: "Jupyter", icon: <SiJupyter className="w-4 h-4" />, color: "#F37726" },
      { name: "TensorFlow", icon: <SiTensorflow className="w-4 h-4" />, color: "#FF6F00" },
      { name: "OpenAI", icon: <SiOpenai className="w-4 h-4" />, color: "#FFFFFF" },
      { name: "LangChain", icon: <SiLangchain className="w-4 h-4" />, color: "#1C3C3C" },
      { name: "Colab", icon: <SiGooglecolab className="w-4 h-4" />, color: "#F9AB00" },
    ],
    features: [
      "12-week structured AI/BI curriculum",
      "Live sessions with 150+ students",
      "Hands-on capstone projects",
      "1-on-1 mentorship and code reviews",
      "Real-world industry case studies",
    ],
    category: "Education & Mentorship",
    type: "physical",
    accent: "orange",
    stats: [
      { label: "Students", value: "150+" },
      { label: "Weeks", value: "12" },
      { label: "Year", value: "2024" },
    ],
    liveUrl: "#",
    githubUrl: "#",
    year: "2024",
    status: "Ongoing",
  },
  {
    id: 3,
    title: "ChatGPT Clone",
    subtitle: "Conversational AI Interface",
    description:
      "A modern, streaming ChatGPT-style web app with real-time message rendering, markdown support, and chat history.",
    longDescription:
      "A production-quality ChatGPT clone built with React, TypeScript, and Tailwind. The UI streams responses from OpenAI-compatible APIs, supports markdown rendering, code highlighting, conversation history, and dark/light themes. Designed for sub-100ms perceived latency with optimistic UI updates.",
    technologies: [
      { name: "React", icon: <SiReact className="w-4 h-4" />, color: "#61DAFB" },
      { name: "TypeScript", icon: <SiTypescript className="w-4 h-4" />, color: "#3178C6" },
      { name: "Tailwind", icon: <SiTailwindcss className="w-4 h-4" />, color: "#06B6D4" },
      { name: "OpenAI", icon: <SiOpenai className="w-4 h-4" />, color: "#FFFFFF" },
      { name: "Vercel", icon: <SiVercel className="w-4 h-4" />, color: "#FFFFFF" },
    ],
    features: [
      "Streaming responses with optimistic UI",
      "Markdown + syntax-highlighted code blocks",
      "Persistent chat history (localStorage)",
      "Multi-conversation sidebar",
      "Light & dark mode adaptive",
    ],
    category: "AI / Front-End",
    type: "coding",
    accent: "violet",
    stats: [
      { label: "Status", value: "Live" },
      { label: "Type", value: "AI UI" },
      { label: "Year", value: "2024" },
    ],
    liveUrl: "https://v0-smart-document-summarizer.vercel.app",
    githubUrl: "https://github.com/sparrow-003/chat-gpt-ui.git",
    year: "2024",
    status: "Live",
  },
];

const accentStyles: Record<Project["accent"], { bg: string; border: string; text: string; glow: string; gradient: string }> = {
  blue: {
    bg: "bg-[#0077CC]/10",
    border: "border-[#0077CC]/30",
    text: "text-[#0099FF]",
    glow: "shadow-[#0077CC]/20",
    gradient: "from-[#0077CC] via-[#0D87CC] to-[#0F0F14]",
  },
  orange: {
    bg: "bg-[#E89122]/10",
    border: "border-[#E89122]/30",
    text: "text-[#E89122]",
    glow: "shadow-[#E89122]/20",
    gradient: "from-[#E89122] via-[#DB6E1C] to-[#0F0F14]",
  },
  violet: {
    bg: "bg-[#7C3AED]/10",
    border: "border-[#7C3AED]/30",
    text: "text-[#A78BFA]",
    glow: "shadow-[#7C3AED]/20",
    gradient: "from-[#7C3AED] via-[#0077CC] to-[#0F0F14]",
  },
};

const ProjectCard = ({
  project,
  isActive,
  onClick,
  index,
}: {
  project: Project;
  isActive: boolean;
  onClick: () => void;
  index: number;
}) => {
  const accent = accentStyles[project.accent];
  const TypeIcon = project.type === "coding" ? Code2 : Users;
  const ProjectIcon =
    project.id === 1 ? BookOpen : project.id === 2 ? Users : Bot;
  return (
    <button
      onClick={onClick}
      className={`group relative w-full text-left rounded-2xl p-5 border transition-all duration-500 ${
        isActive
          ? `${accent.border} bg-card shadow-xl ${accent.glow} scale-[1.02]`
          : "border-border bg-card/60 hover:border-primary/40 hover:-translate-y-1"
      }`}
      aria-pressed={isActive}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className={`p-2.5 rounded-xl ${accent.bg} ${accent.text}`}>
          <ProjectIcon className="w-5 h-5" />
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${accent.bg} ${accent.text} border ${accent.border}`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1">
        {project.title}
      </h3>
      <p className="text-xs text-muted-foreground line-clamp-1 mb-3">
        {project.subtitle}
      </p>
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <Tag className="w-3 h-3" />
        <span className="line-clamp-1">{project.category}</span>
      </div>
      {isActive && (
        <div
          className={`absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r ${accent.gradient} rounded-full`}
        />
      )}
    </button>
  );
};

const ProjectHero = ({ project }: { project: Project }) => {
  const accent = accentStyles[project.accent];
  const ProjectIcon =
    project.id === 1 ? BookOpen : project.id === 2 ? Users : Bot;
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
      {/* Decorative gradient header */}
      <div
        className={`relative h-44 sm:h-56 bg-gradient-to-br ${accent.gradient} overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-black/30 blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative h-full flex items-center justify-between p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-2xl">
              <ProjectIcon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">
                {project.category}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {project.title}
              </h2>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {project.status}
            </span>
            <span className="inline-flex items-center gap-1.5 text-white/80 text-xs">
              <Calendar className="w-3 h-3" /> {project.year}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Description */}
        <div className="lg:col-span-3 space-y-4">
          <div>
            <p className="text-sm font-semibold text-primary mb-1">
              {project.subtitle}
            </p>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              {project.longDescription}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
              <Sparkles className={`w-3.5 h-3.5 ${accent.text}`} /> Key Features
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {project.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${accent.text.replace("text", "bg")} flex-shrink-0`} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {project.type === "coding" ? (
              <>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-primary text-primary-foreground shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4" /> Live Demo
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-secondary text-secondary-foreground border border-border hover:scale-105 active:scale-95 transition-all"
                >
                  <Github className="w-4 h-4" /> Source Code
                </a>
              </>
            ) : (
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-primary text-primary-foreground shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <Users className="w-4 h-4" /> Get in Touch
              </a>
            )}
          </div>
        </div>

        {/* Side panel: stats + tech */}
        <div className="lg:col-span-2 space-y-5">
          <div className={`rounded-2xl p-4 ${accent.bg} border ${accent.border}`}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
              <Star className={`w-3.5 h-3.5 ${accent.text}`} /> At a Glance
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {project.stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className={`text-lg font-bold ${accent.text}`}>{s.value}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/80 p-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-primary" /> Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <span
                  key={t.name}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/50 border border-border text-xs font-medium text-foreground"
                  style={{ color: t.color }}
                >
                  {t.icon}
                  {t.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { Code2 } from "lucide-react";

const Projects = memo(() => {
  const [sectionRef, inView] = useReveal<HTMLDivElement>(0.05, 500);
  const [activeId, setActiveId] = useState(projectsData[0].id);
  const activeProject = projectsData.find((p) => p.id === activeId) ?? projectsData[0];

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={`section-container relative bg-transparent reveal-stagger ${inView ? 'is-revealed' : ''}`}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-12">
        <div className="reveal-target gsap-projects-header inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Featured Work
          </span>
        </div>
          <h2 className="reveal-target gsap-projects-header text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient mb-4">
          My Portfolio
        </h2>
          <p className="reveal-target gsap-projects-header text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A curated collection of projects spanning full-stack engineering,
          applied AI, and education. Click any card to dive in.
        </p>
      </div>

      {/* Project selector grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {projectsData.map((p, i) => (
          <div key={p.id} className="reveal-target gsap-project-card">
            <ProjectCard
              project={p}
              index={i}
              isActive={p.id === activeId}
              onClick={() => setActiveId(p.id)}
            />
          </div>
        ))}
      </div>

      {/* Featured project hero */}
      <div key={activeProject.id} className="reveal-target gsap-projects-hero">
        <ProjectHero project={activeProject} />
      </div>
    </section>
  );
});

Projects.displayName = "Projects";

export default Projects;
