 import { motion, useInView } from "framer-motion";
 import { useRef, useState, memo } from "react";
import { Code2, Users, Bot, ExternalLink, Github, Play } from "lucide-react";

const projectsData = [
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
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
   gradientClass: "from-primary via-accent to-primary",
    bgPattern: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]",
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
    gradient: "from-emerald-500 via-teal-500 to-green-500",
   gradientClass: "from-primary via-accent to-primary",
    bgPattern: "bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))]",
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
    gradient: "from-teal-500 via-emerald-500 to-cyan-500",
   gradientClass: "from-primary via-accent to-primary",
    bgPattern: "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]",
    liveUrl: "https://v0-smart-document-summarizer.vercel.app",
    githubUrl: "https://github.com/sparrow-003/chat-gpt-ui.git"
  }
];

const ProjectCard = ({ project, isActive, onClick }: any) => {
  return (
    <motion.div
      className={`relative cursor-pointer group transition-all duration-500 ${isActive ? 'scale-105' : 'scale-100 hover:scale-105'
        }`}
      onClick={onClick}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
    >
      <div className={`
        relative overflow-hidden rounded-3xl border backdrop-blur-xl
        ${isActive
          ? `bg-gradient-to-br ${project.gradient} p-1 border-white/30 shadow-2xl shadow-emerald-500/50`
          : 'bg-black/40 border-emerald-500/10 hover:border-emerald-500/40'
        }
        transition-all duration-700
      `}>
        <div className="relative bg-black/80 rounded-3xl p-6 h-full backdrop-blur-sm">
          {/* Type indicator */}
          <div className="absolute top-4 right-4">
            <span className={`
              px-3 py-1 rounded-full text-xs font-medium
              ${project.type === 'coding'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
              }
            `}>
              {project.type === 'coding' ? 'Genesis Engine' : 'Knowledge Node'}
            </span>
          </div>

          {/* Icon */}
          <div className={`
            inline-flex p-3 rounded-2xl mb-4
            bg-gradient-to-br ${project.gradient} text-white shadow-lg
          `}>
            {project.icon}
          </div>

          {/* Content */}
          <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
          <p className="text-sm font-medium text-gray-300 mb-3">{project.subtitle}</p>
          <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
            {project.description}
          </p>

          {/* Category */}
          <div className="text-xs text-gray-500 font-medium mb-4">
            {project.category}
          </div>

          {/* Tech stack preview */}
          <div className="flex flex-wrap gap-1 mb-4">
            {project.technologies.slice(0, 3).map((tech: string, i: number) => (
              <span key={i} className="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-300">
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-xs px-2 py-1 bg-white/5 rounded-full text-gray-500">
                +{project.technologies.length - 3} more
              </span>
            )}
          </div>

          {/* Hover overlay */}
          <div className={`
            absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-30 transition-all duration-500
            bg-gradient-to-br ${project.gradient} mix-blend-overlay
          `} />
          <div className={`
            absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700
            bg-gradient-to-t from-emerald-500/20 via-transparent to-transparent
          `} />
        </div>
      </div>
    </motion.div>
  );
};

const ProjectDetails = ({ project }: any) => {
  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className={`
        relative overflow-hidden rounded-3xl 
        bg-gradient-to-br ${project.gradient} p-1
        shadow-2xl
      `}>
        <div className="relative bg-black/90 rounded-3xl backdrop-blur-xl">
          {/* Background pattern */}
          <div className={`absolute inset-0 ${project.bgPattern} ${project.gradient} opacity-10 rounded-3xl`} />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            {/* Left side - Visual */}
            <div className="relative p-6 lg:p-12 flex flex-col justify-center">
              <div className={`
                inline-flex p-4 rounded-3xl mb-6
                bg-gradient-to-br ${project.gradient} text-white shadow-2xl
              `}>
                {project.icon}
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
                {project.title}
              </h2>
              <p className="text-xl text-gray-300 mb-6 font-medium">
                {project.subtitle}
              </p>
              <p className="text-gray-400 leading-relaxed text-lg mb-8">
                {project.description}
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-4">
                <motion.a
                  href={project.liveUrl}
                  className={`
                    inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold
                    bg-gradient-to-r ${project.gradient} text-white shadow-lg
                    transition-all duration-300
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5" />
                  {project.type === 'coding' ? 'Live Demo' : 'Learn More'}
                </motion.a>

                {project.type === 'coding' && (
                  <motion.a
                    href={project.githubUrl}
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github className="w-5 h-5" />
                    Source Code
                  </motion.a>
                )}
              </div>
            </div>

            {/* Right side - Details */}
            <div className="p-8 lg:p-12 border-l border-white/10">
              {/* Technologies */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  Tech Stack Integration
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {project.technologies.map((tech: string, i: number) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="px-4 py-2 bg-white/10 rounded-xl text-gray-300 text-sm font-medium text-center backdrop-blur-sm border border-white/5"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Key features */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400" />
                  Key Features
                </h3>
                <div className="space-y-3">
                  {project.features.map((feature: string, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-start gap-3 group"
                    >
                      <div className={`
                        w-2 h-2 rounded-full mt-2 flex-shrink-0
                        bg-gradient-to-r ${project.gradient}
                        group-hover:scale-125 transition-transform duration-300
                      `} />
                      <span className="text-gray-300 leading-relaxed">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

 const Projects = memo(() => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [activeProject, setActiveProject] = useState(projectsData[0]);

  return (
     <section id="projects" ref={ref} className="section-container relative bg-background">
       <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background -z-10" />
      <div className="projects-section">
        {/* Enhanced background elements */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
           <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delay" />
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-primary/5 via-transparent to-transparent rounded-full animate-pulse" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iNyIgY3k9IjciIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
             className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 mb-6"
              whileHover={{ scale: 1.05 }}
            >
             <Code2 className="w-5 h-5 text-primary" />
             <span className="text-primary font-bold uppercase tracking-widest text-xs">Featured Work</span>
            </motion.div>

           <h2 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent mb-6">
              My Portfolio
            </h2>
           <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Showcasing my journey in development, education, and innovation. Each project represents
              a unique challenge solved through creativity and technical expertise.
            </p>
          </motion.div>

          {/* Project navigation */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {projectsData.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isActive={activeProject.id === project.id}
                onClick={() => setActiveProject(project)}
              />
            ))}
          </motion.div>

          {/* Active project details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <ProjectDetails project={activeProject} />
          </motion.div>
        </div>
      </div>
    </section>
  );
 });
 
 Projects.displayName = 'Projects';

export default Projects;
