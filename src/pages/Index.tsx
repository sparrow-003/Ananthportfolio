import { useEffect, useState, lazy, Suspense, memo } from "react";
import SmoothScroll from "../components/SmoothScroll";
import MatrixLoader from "../components/MatrixLoader";
import { AnimatePresence } from "framer-motion";

// Lazy load heavy components for better performance
const Hero = lazy(() => import("../components/Hero"));
const About = lazy(() => import("../components/About"));
const Skills = lazy(() => import("../components/Skills"));
const Projects = lazy(() => import("../components/Projects"));
const Contact = lazy(() => import("../components/Contact"));

// Minimal loading placeholder
const SectionLoader = memo(() => (
  <div className="min-h-[40vh] flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-primary/50 border-t-primary rounded-full animate-spin" />
  </div>
));

SectionLoader.displayName = 'SectionLoader';

const Index = memo(() => {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Fast initial load
  useEffect(() => {
    // Check if document is already loaded
    if (document.readyState === 'complete') {
      setIsLoading(false);
      requestAnimationFrame(() => setIsReady(true));
      return;
    }

    // Quick timeout for fast loading
    const quickTimer = setTimeout(() => {
      setIsLoading(false);
      requestAnimationFrame(() => setIsReady(true));
    }, 400);

    // Also listen for window load
    const handleLoad = () => {
      clearTimeout(quickTimer);
      setIsLoading(false);
      requestAnimationFrame(() => setIsReady(true));
    };

    window.addEventListener('load', handleLoad);

    return () => {
      clearTimeout(quickTimer);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  // Prefetch components after initial render
  useEffect(() => {
    if (isReady) {
      // Preload other sections in the background
      const prefetchTimeout = setTimeout(() => {
        import("../components/About");
        import("../components/Skills");
        import("../components/Projects");
        import("../components/Contact");
      }, 100);

      return () => clearTimeout(prefetchTimeout);
    }
  }, [isReady]);

  return (
    <div className="w-full min-h-screen relative overflow-x-hidden bg-transparent text-foreground">
      <AnimatePresence>
        {isLoading && <MatrixLoader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      <main className="relative w-full">
        <SmoothScroll>
          <Suspense fallback={<SectionLoader />}>
            <Hero />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <About />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <Skills />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <Projects />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <Contact />
          </Suspense>
        </SmoothScroll>
      </main>
    </div>
  );
});

Index.displayName = 'Index';

export default Index;
