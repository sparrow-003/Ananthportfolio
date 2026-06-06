import { useEffect, useRef, memo } from 'react';

const StarFieldBackground = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const STAR_COUNT = 1200;
    const FALLING_COUNT = 40;
    
    const stars: Star[] = [];
    const fallingStars: FallingStar[] = [];

    interface Star {
      x: number;
      y: number;
      size: number;
      opacity: number;
      twinkleSpeed: number;
      twinklePhase: number;
      color: string;
    }

    interface FallingStar {
      x: number;
      y: number;
      speed: number;
      length: number;
      opacity: number;
      size: number;
      trail: { x: number; y: number }[];
      color: string;
    }

    const starColors = [
      '#ffffff',
      '#ffe4c9',
      '#c9e4ff',
      '#e8c9ff',
      '#c9fff0',
    ];

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.9 + 0.1,
        twinkleSpeed: Math.random() * 0.03 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    for (let i = 0; i < FALLING_COUNT; i++) {
      fallingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        speed: Math.random() * 4 + 2,
        length: Math.random() * 20 + 8,
        opacity: Math.random() * 0.7 + 0.3,
        size: Math.random() * 2 + 1,
        trail: [],
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    let animationId: number;
    let lastTime = 0;

    const animate = (currentTime: number) => {
      const delta = currentTime - lastTime;
      
      if (delta > 16) {
        lastTime = currentTime - (delta % 16);
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const time = currentTime * 0.001;

        stars.forEach((star) => {
          const twinkle = Math.sin(time * star.twinkleSpeed * 10 + star.twinklePhase) * 0.4 + 0.6;
          ctx.fillStyle = star.color === '#ffffff' 
            ? `rgba(255, 255, 255, ${star.opacity * twinkle})`
            : star.color.includes('ffe4c9')
            ? `rgba(255, 228, 201, ${star.opacity * twinkle})`
            : star.color.includes('c9e4ff')
            ? `rgba(201, 228, 255, ${star.opacity * twinkle})`
            : star.color.includes('e8c9ff')
            ? `rgba(232, 201, 255, ${star.opacity * twinkle})`
            : `rgba(201, 255, 240, ${star.opacity * twinkle})`;
          
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * twinkle, 0, Math.PI * 2);
          ctx.fill();
          
          if (star.size > 1.5) {
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle * 0.3})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * twinkle * 2, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        fallingStars.forEach((star) => {
          star.trail.unshift({ x: star.x, y: star.y });
          if (star.trail.length > 15) star.trail.pop();
          
          star.y += star.speed;
          star.x += star.speed * 0.2;

          if (star.y > canvas.height + 50) {
            star.y = -50;
            star.x = Math.random() * canvas.width;
            star.trail = [];
            star.speed = Math.random() * 4 + 2;
            star.length = Math.random() * 20 + 8;
          }

          if (star.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(star.trail[0].x, star.trail[0].y);
            for (let i = 1; i < star.trail.length; i++) {
              ctx.lineTo(star.trail[i].x, star.trail[i].y);
            }
            ctx.lineTo(star.x, star.y);
            
            const gradient = ctx.createLinearGradient(
              star.trail[0]?.x || star.x, star.trail[0]?.y || star.y,
              star.x, star.y
            );
            
            const alpha = star.opacity;
            gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
            gradient.addColorStop(0.3, `rgba(255, 255, 255, ${alpha * 0.3})`);
            gradient.addColorStop(0.7, `rgba(255, 255, 255, ${alpha * 0.7})`);
            gradient.addColorStop(1, `rgba(255, 255, 255, ${alpha})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = star.size;
            ctx.lineCap = 'round';
            ctx.stroke();
            
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * 0.8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.5})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-base"
    />
  );
});

StarFieldBackground.displayName = 'StarFieldBackground';

export default StarFieldBackground;