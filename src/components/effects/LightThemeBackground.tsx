 import { useEffect, useRef, memo } from 'react';
 
 const LightThemeBackground = memo(() => {
   const canvasRef = useRef<HTMLCanvasElement | null>(null);
   const animationRef = useRef<number>();
   
   useEffect(() => {
     if (!canvasRef.current) return;
     
     const canvas = canvasRef.current;
     const ctx = canvas.getContext('2d', { alpha: true });
     if (!ctx) return;
     
     const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
     
     const resize = () => {
       canvas.width = window.innerWidth * dpr;
       canvas.height = window.innerHeight * dpr;
       canvas.style.width = `${window.innerWidth}px`;
       canvas.style.height = `${window.innerHeight}px`;
       ctx.scale(dpr, dpr);
     };
     resize();
     
     // Floating orbs for light theme
     const orbCount = Math.min(15, Math.floor(window.innerWidth / 100));
     
     interface Orb {
       x: number;
       y: number;
       size: number;
       speedX: number;
       speedY: number;
       hue: number;
       opacity: number;
     }
     
     const orbs: Orb[] = [];
     
     // Create floating orbs with blue/cyan hues
     for (let i = 0; i < orbCount; i++) {
       orbs.push({
         x: Math.random() * window.innerWidth,
         y: Math.random() * window.innerHeight,
         size: Math.random() * 80 + 40,
         speedX: (Math.random() - 0.5) * 0.3,
         speedY: (Math.random() - 0.5) * 0.3,
         hue: 200 + Math.random() * 40, // Blue to cyan range
         opacity: Math.random() * 0.15 + 0.05,
       });
     }
     
     let lastTime = 0;
     const targetFPS = 30;
     const frameInterval = 1000 / targetFPS;
     
     function animate(currentTime: number) {
       const deltaTime = currentTime - lastTime;
       
       if (deltaTime >= frameInterval) {
         lastTime = currentTime - (deltaTime % frameInterval);
         
         // Clear with transparent
         ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
         
         // Draw and update orbs
         for (let i = 0; i < orbs.length; i++) {
           const orb = orbs[i];
           
           // Update position
           orb.x += orb.speedX;
           orb.y += orb.speedY;
           
           // Wrap around edges
           if (orb.x > window.innerWidth + orb.size) orb.x = -orb.size;
           if (orb.x < -orb.size) orb.x = window.innerWidth + orb.size;
           if (orb.y > window.innerHeight + orb.size) orb.y = -orb.size;
           if (orb.y < -orb.size) orb.y = window.innerHeight + orb.size;
           
           // Draw gradient orb
           const gradient = ctx.createRadialGradient(
             orb.x, orb.y, 0,
             orb.x, orb.y, orb.size
           );
           gradient.addColorStop(0, `hsla(${orb.hue}, 80%, 60%, ${orb.opacity})`);
           gradient.addColorStop(0.5, `hsla(${orb.hue}, 70%, 70%, ${orb.opacity * 0.5})`);
           gradient.addColorStop(1, `hsla(${orb.hue}, 60%, 80%, 0)`);
           
           ctx.fillStyle = gradient;
           ctx.beginPath();
           ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
           ctx.fill();
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
       style={{ opacity: 0.8 }}
     />
   );
 });
 
 LightThemeBackground.displayName = 'LightThemeBackground';
 
 export default LightThemeBackground;