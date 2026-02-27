import { useEffect, useRef } from 'react';
import { useAnimationPreference } from '@/contexts/AnimationContext';
import { useTheme } from '@/components/theme-provider';
import { getRecommendedParticleCount } from '@/utils/deviceDetection';
import { SimplexNoise } from '@/utils/animationHelpers';

interface FloatingOrbsProps {
    count?: number;
    minSize?: number;
    maxSize?: number;
    speed?: number;
}

export function FloatingOrbs({
    count,
    minSize = 40,
    maxSize = 120,
    speed = 0.0005,
}: FloatingOrbsProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { effectiveMode } = useAnimationPreference();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        if (effectiveMode === 'off') return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Responsive sizing
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const orbCount = count || getRecommendedParticleCount();
        const noise = new SimplexNoise();
        const orbs: Array<{
            x: number;
            y: number;
            z: number;
            size: number;
            baseX: number;
            baseY: number;
            offset: number;
        }> = [];

        // Initialize orbs
        for (let i = 0; i < orbCount; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            orbs.push({
                x,
                y,
                z: Math.random(),
                size: minSize + Math.random() * (maxSize - minSize),
                baseX: x,
                baseY: y,
                offset: Math.random() * Math.PI * 2,
            });
        }

        let time = 0;
        let rafId: number;

        const animate = () => {
            time += speed;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            orbs.forEach((orb, i) => {
                // Use noise for organic movement
                const noiseX = noise.noise3D(orb.baseX * 0.001, orb.baseY * 0.001, time + orb.offset);
                const noiseY = noise.noise3D(orb.baseY * 0.001, orb.baseX * 0.001, time + orb.offset + 100);

                orb.x = orb.baseX + noiseX * 100;
                orb.y = orb.baseY + noiseY * 100;

                // Create gradient for orb
                const gradient = ctx.createRadialGradient(
                    orb.x,
                    orb.y,
                    0,
                    orb.x,
                    orb.y,
                    orb.size / 2
                );

                if (isDark) {
                    gradient.addColorStop(0, 'hsla(199, 89%, 48%, 0.4)');
                    gradient.addColorStop(0.5, 'hsla(175, 80%, 50%, 0.2)');
                    gradient.addColorStop(1, 'transparent');
                } else {
                    gradient.addColorStop(0, 'hsla(217, 91%, 50%, 0.3)');
                    gradient.addColorStop(0.5, 'hsla(45, 100%, 51%, 0.15)');
                    gradient.addColorStop(1, 'transparent');
                }

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(orb.x, orb.y, orb.size / 2, 0, Math.PI * 2);
                ctx.fill();

                // Add rim highlight
                ctx.strokeStyle = isDark
                    ? 'hsla(199, 89%, 48%, 0.6)'
                    : 'hsla(45, 100%, 51%, 0.4)';
                ctx.lineWidth = 2;
                ctx.stroke();
            });

            if (effectiveMode === 'full') {
                rafId = requestAnimationFrame(animate);
            }
        };

        rafId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [effectiveMode, theme, count, minSize, maxSize, speed, isDark]);

    if (effectiveMode === 'off') return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ opacity: effectiveMode === 'reduced' ? 0.3 : 0.6 }}
        />
    );
}
