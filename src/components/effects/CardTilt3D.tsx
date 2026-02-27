import { useEffect, useRef, ReactNode } from 'react';
import { useAnimationPreference } from '@/contexts/AnimationContext';
import { clamp } from '@/utils/animationHelpers';

interface CardTilt3DProps {
    children: ReactNode;
    className?: string;
    maxTilt?: number;
    scale?: number;
    glareEffect?: boolean;
}

export function CardTilt3D({
    children,
    className = '',
    maxTilt = 12,
    scale = 1.02,
    glareEffect = true
}: CardTilt3DProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const { effectiveMode } = useAnimationPreference();

    useEffect(() => {
        if (effectiveMode === 'off' || effectiveMode === 'reduced') return;

        const card = cardRef.current;
        if (!card) return;

        let rafId: number;
        let currentRotateX = 0;
        let currentRotateY = 0;
        let targetRotateX = 0;
        let targetRotateY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const percentX = (e.clientX - centerX) / (rect.width / 2);
            const percentY = (e.clientY - centerY) / (rect.height / 2);

            targetRotateY = clamp(percentX * maxTilt, -maxTilt, maxTilt);
            targetRotateX = clamp(-percentY * maxTilt, -maxTilt, maxTilt);
        };

        const handleMouseLeave = () => {
            targetRotateX = 0;
            targetRotateY = 0;
        };

        const animate = () => {
            // Smooth interpolation
            currentRotateX += (targetRotateX - currentRotateX) * 0.1;
            currentRotateY += (targetRotateY - currentRotateY) * 0.1;

            const scaleValue = targetRotateX !== 0 || targetRotateY !== 0 ? scale : 1;

            card.style.transform = `
        perspective(1000px) 
        rotateX(${currentRotateX}deg) 
        rotateY(${currentRotateY}deg)
        scale(${scaleValue})
      `;

            rafId = requestAnimationFrame(animate);
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
        rafId = requestAnimationFrame(animate);

        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(rafId);
        };
    }, [effectiveMode, maxTilt, scale]);

    return (
        <div className="card-tilt-3d-container">
            <div
                ref={cardRef}
                className={`card-tilt-3d ${className}`}
                style={{
                    transformStyle: 'preserve-3d',
                    willChange: effectiveMode === 'full' ? 'transform' : 'auto',
                }}
            >
                {children}
                {glareEffect && effectiveMode === 'full' && (
                    <div
                        className="absolute inset-0 pointer-events-none rounded-inherit"
                        style={{
                            background: 'linear-gradient(135deg, transparent 0%, hsla(255,255,255,0.1) 50%, transparent 100%)',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            transform: 'translateZ(1px)',
                        }}
                    />
                )}
            </div>
        </div>
    );
}
