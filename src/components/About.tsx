 import { motion } from "framer-motion";
 import { useRef, memo } from "react";
 import { useInView } from "framer-motion";
 import AnimatedAvatar from "./AnimatedAvatar";
 
 const fadeInUp = (delay = 0) => ({
   hidden: { opacity: 0, y: 60 },
   visible: {
     opacity: 1,
     y: 0,
     transition: { duration: 0.9, delay, ease: "easeOut" },
   },
 });
 
 const slideIn = (direction: "left" | "right" = "left", delay = 0) => ({
   hidden: { opacity: 0, x: direction === "left" ? -80 : 80 },
   visible: {
     opacity: 1,
     x: 0,
     transition: { duration: 1, delay, ease: "easeOut" },
   },
 });
 
 const scaleIn = (delay = 0) => ({
   hidden: { opacity: 0, scale: 0.9 },
   visible: {
     opacity: 1,
     scale: 1,
     transition: { duration: 1, delay, ease: "easeOut" },
   },
 });
 
 const About = memo(() => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="about"
      className="min-h-screen py-20 relative w-full"
     style={{ backgroundColor: 'hsl(var(--background))' }}
      ref={ref}
    >
       <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Title with Avatar */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
          {/* Animated Avatar */}
          <motion.div
            className="flex-shrink-0"
            variants={scaleIn(0)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <AnimatedAvatar variant="about" className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80" />
          </motion.div>

          {/* Title content */}
          <motion.div
            className="text-center lg:text-left flex-1"
            variants={fadeInUp(0)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
           <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-foreground mb-6 drop-shadow-md uppercase italic">
              About Me
            </h2>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed"
              variants={fadeInUp(0.2)}
            >
              I'm Ananth — a developer, educator, and innovator driven by curiosity
              and a desire to make technology more human, accessible, and impactful.
            </motion.p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Journey */}
          <motion.div
            className="space-y-6"
            variants={slideIn("left", 0.2)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
           <div className="bg-card/40 backdrop-blur-xl rounded-2xl p-8 border border-primary/10 shadow-2xl hover:border-primary/30 transition-all duration-500 group">
              <h3 className="text-3xl font-semibold text-foreground mb-6">
                My Journey
              </h3>
              <div className="space-y-5 text-muted-foreground">
                <p>
                  My path began as a <span className="font-semibold text-primary">B.Com graduate</span> with a deep interest in problem-solving. That interest grew into a passion for development and education.
                </p>
                <motion.p variants={fadeInUp(0.4)}>
                  I currently mentor <span className="text-primary font-bold">150+ students</span> in AI & BI through the Naan Mudhalvan program, while also serving as a Campus Ambassador at Averixis Solutions.
                </motion.p>
                <motion.p variants={fadeInUp(0.6)}>
                  I thrive on <span className="font-semibold">building, sharing, and growing</span> — every challenge is an opportunity to innovate.
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            className="space-y-6"
            variants={slideIn("right", 0.4)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
           <div className="bg-card/40 backdrop-blur-xl rounded-2xl p-8 border border-primary/10 shadow-2xl hover:border-primary/30 transition-all duration-500 group">
              <h3 className="text-3xl font-semibold text-foreground mb-6">
                What I Do
              </h3>
              <div className="space-y-5">
                {[
                  {
                    "title": "Mastery in Full Stack Development",
                    "desc": "Spearheading the end-to-end creation of high-performance, scalable web applications, leveraging a comprehensive stack that includes React, TypeScript, Python, and Node.js to deliver exceptional digital experiences."
                  },
                  {
                    "title": "Cutting-Edge AI Integration & Prompt Engineering",
                    "desc": "Architecting intelligent, scalable workflows by expertly integrating AI solutions and pioneering innovative prompt engineering techniques to maximize model performance and utility."
                  },
                  {
                    "title": "Expertise in Large Language Model (LLM) Development",
                    "desc": "Innovating at the forefront of AI by developing, training, and fine-tuning next-generation language models to create sophisticated, intelligent, and human-like conversational systems."
                  },
                  {
                    "title": "Strategic Leadership & Mentorship",
                    "desc": "Inspiring and leading a community of learners, serving as a Campus Ambassador to cultivate professional growth and foster a collaborative, knowledge-driven environment."
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4"
                    variants={fadeInUp(0.2 * index)}
                  >
                   <div className="w-3 h-3 bg-primary rounded-full mt-2 shadow-glow"></div>
                    <div>
                     <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Vision + Beyond */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={fadeInUp(0.6)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div
           className="bg-card/40 backdrop-blur-md rounded-2xl p-8 border border-primary/10 shadow-xl hover:border-primary/20 transition duration-500"
            variants={scaleIn(0.2)}
          >
           <h3 className="text-2xl font-semibold text-foreground mb-4">My Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              I aim to create platforms that combine AI, creativity, and real-world problem-solving to empower people globally.
            </p>
          </motion.div>

          <motion.div
           className="bg-card/40 backdrop-blur-md rounded-2xl p-8 border border-primary/10 shadow-xl hover:border-primary/20 transition duration-500"
            variants={scaleIn(0.4)}
          >
           <h3 className="text-2xl font-semibold text-foreground mb-4">Beyond Tech</h3>
            <p className="text-muted-foreground leading-relaxed">
              Outside development, I explore storytelling, mentoring, and personal growth — bringing creativity into everything I do.
            </p>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-20"
          variants={fadeInUp(0.8)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "2+", label: "Years of AI Agents" },
              { number: "3+", label: "Years of Coding" },
              { number: "∞", label: "Lines of Code & AI Agents" },
            ].map((stat, i) => (
              <motion.div
                key={i}
               className="bg-card/50 backdrop-blur-xl rounded-2xl p-8 border border-primary/10 text-center shadow-xl hover:border-primary/30 transition duration-500"
                variants={scaleIn(0.2 * i)}
              >
               <div className="text-4xl font-black text-primary mb-3">
                  {stat.number}
                </div>
                <div className="text-muted-foreground text-lg">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
 });
 
 About.displayName = 'About';

export default About;
