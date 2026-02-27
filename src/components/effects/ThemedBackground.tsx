import { lazy, Suspense, memo } from 'react';
import { useTheme } from '@/components/theme-provider';
import { Canvas } from '@react-three/fiber';

// Lazy load backgrounds for performance
const ParticleBackground = lazy(() => import('../ParticleBackground'));
const LightThemeBackground = lazy(() => import('./LightThemeBackground'));
const FallingStars = lazy(() => import('../FallingStars'));

const ThemedBackground = memo(() => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <>
      <Suspense fallback={null}>
        {/* If dark mode, the FallingStars component handles the entire background (nebula + stars).
            If light mode, we show the LightThemeBackground. */}
        {isDark ? null : <LightThemeBackground />}
      </Suspense>

      {/* Falling stars / Real Space effect for dark mode */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none -z-10 bg-[#030508]">
          {/* Cinematic Vignette & Depth Gradient */}
          <div
            className="absolute inset-0 z-[1] opacity-60"
            style={{
              background: 'radial-gradient(circle at center, transparent 0%, rgba(3, 5, 8, 0.8) 70%, #030508 100%)'
            }}
          />
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 20], fov: 60 }}
              style={{ background: 'transparent' }}
              gl={{ alpha: true, antialias: false }}
              dpr={[1, 1.5]}
            >
              <FallingStars />
            </Canvas>
          </Suspense>
        </div>
      )}
    </>
  );
});

ThemedBackground.displayName = 'ThemedBackground';

export default ThemedBackground;