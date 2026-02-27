import { useEffect, useRef, memo } from 'react';

const ParticleBackground = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Use device pixel ratio capped at 1.5 for performance
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();

    // Reduced particle counts for better performance
    const particleCount = Math.min(40, Math.floor(window.innerWidth / 30));
    const starCount = Math.min(80, Math.floor(window.innerWidth / 15));

    const particles: Particle[] = [];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.2,
      });
    }

    let lastTime = 0;
    const targetFPS = 30; // Cap at 30 FPS for performance
    const frameInterval = 1000 / targetFPS;

    function animate(currentTime: number) {
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= frameInterval) {
        lastTime = currentTime - (deltaTime % frameInterval);

        // Clear with solid black - keeping it for contrast
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.speedX;
          p.y += p.speedY;

          // Wrap around edges
          if (p.x > window.innerWidth) p.x = 0;
          if (p.x < 0) p.x = window.innerWidth;
          if (p.y > window.innerHeight) p.y = 0;
          if (p.y < 0) p.y = window.innerHeight;

          // Use blue theme color
          ctx.fillStyle = `hsla(217, 91%, 50%, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Connect nearby particles (limit connections for performance)
        ctx.strokeStyle = 'hsla(217, 91%, 50%, 0.15)';
        ctx.lineWidth = 0.5;
        const maxDist = 100;
        const maxDistSq = maxDist * maxDist;

        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < Math.min(i + 10, particles.length); j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distSq = dx * dx + dy * dy;

            if (distSq < maxDistSq) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);
    window.addEventListener('resize', resize, { passive: true });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
});

ParticleBackground.displayName = 'ParticleBackground';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinklePhase: number;
}

export default ParticleBackground;
