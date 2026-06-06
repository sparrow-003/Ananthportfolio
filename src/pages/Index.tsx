import { Suspense, memo, lazy } from "react";
import SmoothScroll from "../components/SmoothScroll";
import Seo from "../components/Seo";
import Hero from "../components/Hero";
import { SectionSkeleton } from "../components/skeletons/SectionSkeleton";

const About = lazy(() => import("../components/About"));
const Skills = lazy(() => import("../components/Skills"));
const AIGallery = lazy(() => import("../components/AIGallery"));
const Projects = lazy(() => import("../components/Projects"));
const Contact = lazy(() => import("../components/Contact"));

const Index = memo(() => {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-transparent text-foreground">
      <Seo
        title="ANANTH.DEV | Full-Stack Developer & AI Engineer Portfolio"
        description="Ananth N — Full-stack developer & AI engineer crafting seamless web and AI solutions. Python, React, TypeScript, prompt engineering. Hire me for your next project."
        path="/"
        type="profile"
      />
      <SmoothScroll>
        <Hero />
        <Suspense fallback={<SectionSkeleton />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Skills />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <AIGallery />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Contact />
        </Suspense>
      </SmoothScroll>
    </div>
  );
});

Index.displayName = 'Index';

export default Index;
