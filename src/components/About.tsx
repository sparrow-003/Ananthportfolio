import { memo, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedAvatar from "./AnimatedAvatar";
import { useReveal } from '@/hooks/useReveal';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const About = memo(() => {
  const [sectionRef, isInView] = useReveal<HTMLDivElement>(0.08, 300);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimatedRef.current || !sectionRef.current) return;
    hasAnimatedRef.current = true;

    const ctx = gsap.context(() => {
      gsap.from('.gsap-about-text', {
        opacity: 0,
        y: 40,
        duration: 0.65,
        stagger: 0.2,
        ease: 'power3.out',
      });

      gsap.from('.gsap-about-journey', {
        opacity: 0,
        x: -36,
        duration: 0.65,
        ease: 'power3.out',
      });

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      tl.from('.gsap-about-do', {
        opacity: 0,
        x: 36,
        duration: 0.65,
      }).from('.gsap-about-do-item', {
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.45,
        ease: 'power2.out'
      }, '-=0.5');

      gsap.from('.gsap-about-vision-card', {
        opacity: 0,
        scale: 0.95,
        y: 35,
        duration: 0.55,
        stagger: 0.2,
        ease: 'back.out(1.1)',
      });

      gsap.from('.gsap-about-stat-card', {
        opacity: 0,
        scale: 0.85,
        y: 35,
        duration: 0.65,
        stagger: 0.15,
        ease: 'back.out(1.15)',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isInView, sectionRef]);

  return (
    <section
      id="about"
      className="min-h-screen py-20 relative w-full bg-transparent"
      style={{ backgroundColor: 'transparent' }}
      ref={sectionRef}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Title with Avatar */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
          {/* Animated Avatar */}
          <div className="flex-shrink-0">
            <AnimatedAvatar variant="about" isInView={isInView} className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80" />
          </div>

          {/* Title content */}
          <div className="text-center lg:text-left flex-1">
            <h2 className="gsap-about-text text-3xl md:text-5xl font-extrabold tracking-tighter text-foreground mb-6 drop-shadow-md uppercase italic">
              About Me
            </h2>
            <p className="gsap-about-text text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
              I'm Ananth — a developer, educator, and innovator driven by curiosity
              and a desire to make technology more human, accessible, and impactful.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Journey */}
          <div className="gsap-about-journey space-y-6">
            <div className="bg-card/40 backdrop-blur-xl rounded-2xl p-8 border border-primary/10 shadow-2xl hover:border-primary/30 transition-all duration-500 group">
              <h3 className="text-3xl font-semibold text-foreground mb-6">
                My Journey
              </h3>
              <div className="space-y-5 text-muted-foreground">
                <p>
                  My path began as a <span className="font-semibold text-primary">B.Com graduate</span> with a deep interest in problem-solving. That interest grew into a passion for development and education.
                </p>
                <p>
                  I currently mentor <span className="text-primary font-bold">150+ students</span> in AI & BI through the Naan Mudhalvan program, while also serving as a Campus Ambassador at Averixis Solutions.
                </p>
                <p>
                  I thrive on <span className="font-semibold">building, sharing, and growing</span> — every challenge is an opportunity to innovate.
                </p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="gsap-about-do space-y-6">
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
                  <div
                    key={index}
                    className="gsap-about-do-item flex items-start space-x-4"
                  >
                    <div className="w-3 h-3 bg-primary rounded-full mt-2 shadow-glow"></div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Vision + Beyond */}
        <div className="gsap-about-vision-container mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="gsap-about-vision-card bg-card/40 backdrop-blur-md rounded-2xl p-8 border border-primary/10 shadow-xl hover:border-primary/20 transition duration-500">
            <h3 className="text-2xl font-semibold text-foreground mb-4">My Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              I aim to create platforms that combine AI, creativity, and real-world problem-solving to empower people globally.
            </p>
          </div>

          <div className="gsap-about-vision-card bg-card/40 backdrop-blur-md rounded-2xl p-8 border border-primary/10 shadow-xl hover:border-primary/20 transition duration-500">
            <h3 className="text-2xl font-semibold text-foreground mb-4">Beyond Tech</h3>
            <p className="text-muted-foreground leading-relaxed">
              Outside development, I explore storytelling, mentoring, and personal growth — bringing creativity into everything I do.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="gsap-about-stats-container mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "2+", label: "Years of AI Agents" },
              { number: "3+", label: "Years of Coding" },
              { number: "∞", label: "Lines of Code & AI Agents" },
            ].map((stat, i) => (
              <div
                key={i}
                className="gsap-about-stat-card bg-card/50 backdrop-blur-xl rounded-2xl p-8 border border-primary/10 text-center shadow-xl hover:border-primary/30 transition duration-500"
              >
                <div className="text-4xl font-black text-primary mb-3">
                  {stat.number}
                </div>
                <div className="text-muted-foreground text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default About;
