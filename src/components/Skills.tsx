import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { Code, BrainCircuit, Database, Globe, Layers, Cpu, PencilRuler, CheckCircle } from 'lucide-react';

const Skills = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="skills" className="py-24 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10 -z-10" />
      {/* 3D Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-2xl"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:44px_44px]"></div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-primary/10 rounded-full animate-pulse-slow opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-primary/10 rounded-full animate-reverse-pulse opacity-20"></div>
      </div>

      <div className="section-container relative z-10">
        <motion.h2
          className="section-title text-3xl md:text-5xl text-center text-gradient"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Technical Expertise
        </motion.h2>

        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          A comprehensive toolbox of cutting-edge technologies I've mastered through continuous learning
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              className="bg-dark/40 backdrop-blur-sm p-6 border border-white/10 hover:border-white/20 transition-all h-full rounded-xl"
              variants={itemVariants}
              transition={{ duration: 0.5, delay: 0.3 + (categoryIndex * 0.1) }}
              whileHover={{
                y: -5,
                borderColor: "rgba(255, 255, 255, 0.25)"
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-dark/80 rounded-lg border border-white/10">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{category.title}</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                {category.skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    className="flex flex-col items-center justify-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + (0.05 * index) }}
                  >
                    <motion.div
                      className="w-12 h-12 lg:w-16 lg:h-16 bg-dark/60 rounded-lg flex items-center justify-center mb-2 group hover:bg-white/5 transition-all border border-white/10 hover:border-white/20"
                      whileHover={{
                        scale: 1.05,
                        rotate: 2
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        className="w-6 h-6 lg:w-8 lg:h-8 object-contain filter saturate-0 opacity-80 group-hover:saturate-100 group-hover:opacity-100 transition-all"
                      />
                    </motion.div>
                    <span className="text-center text-xs lg:text-sm text-gray-300 group-hover:text-white">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 bg-black/40 backdrop-blur-md rounded-2xl p-8 text-center relative overflow-hidden border border-emerald-500/10 shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-teal-500/5 z-0"></div>

          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4 text-white">Always Learning & Growing</h3>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              As a passionate technologist, I'm constantly expanding my skillset through continuous learning,
              hands-on projects, and collaboration with industry experts. I believe in staying ahead of emerging
              technologies and applying them to build innovative solutions that solve real-world problems.
            </p>

            <motion.div
              className="mt-8 flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.div
                className="flex items-center gap-2 px-4 py-2 bg-dark/60 rounded-full border border-white/10"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
                <span>Quick Learner</span>
              </motion.div>

              <motion.div
                className="flex items-center gap-2 px-4 py-2 bg-dark/60 rounded-full border border-white/10"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                  <path d="M18 8h1a4 4 0 1 1 0 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                  <line x1="6" y1="1" x2="6" y2="4"></line>
                  <line x1="10" y1="1" x2="10" y2="4"></line>
                  <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>
                <span>Problem Solver</span>
              </motion.div>

              <motion.div
                className="flex items-center gap-2 px-4 py-2 bg-dark/60 rounded-full border border-white/10"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400">
                  <path d="M12 2v4"></path>
                  <path d="M12 18v4"></path>
                  <path d="M4.93 4.93l2.83 2.83"></path>
                  <path d="M16.24 16.24l2.83 2.83"></path>
                  <path d="M2 12h4"></path>
                  <path d="M18 12h4"></path>
                  <path d="M4.93 19.07l2.83-2.83"></path>
                  <path d="M16.24 7.76l2.83-2.83"></path>
                </svg>
                <span>Innovative Thinker</span>
              </motion.div>

              <motion.div
                className="flex items-center gap-2 px-4 py-2 bg-dark/60 rounded-full border border-white/10"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span>Modular Approach</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
