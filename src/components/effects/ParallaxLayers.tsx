import { useEffect, useRef, ReactNode } from 'react';
import { useAnimationPreference } from '@/contexts/AnimationContext';
import { debounce } from '@/utils/animationHelpers';

interface ParallaxLayersProps {
    children: ReactNode[];
    speeds?: number[]; // Parallax multipliers for each layer [0.02, 0.05, 0.08]
    className?: string;
}

export function ParallaxLayers({
    children,
    speeds = [0.02, 0.05, 0.08],
    className = ''
}: ParallaxLayersProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
    const { effectiveMode } = useAnimationPreference();

    useEffect(() => {
        if (effectiveMode !== 'full') return;

        const handleScroll = () => {
            const scrollY = window.scrollY;

            layerRefs.current.forEach((layer, index) => {
                if (layer) {
                    const speed = speeds[index] || 0.05;
                    layer.style.transform = `translateY(${scrollY * speed}px)`;
                }
            });
        };

        const debouncedScroll = debounce(handleScroll, 10);

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', debouncedScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', debouncedScroll);
        };
    }, [effectiveMode, speeds]);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {children.map((child, index) => (
                <div
                    key={index}
                    ref={(el) => { layerRefs.current[index] = el; }}
                    className="parallax-layer"
                    style={{
                        willChange: effectiveMode === 'full' ? 'transform' : 'auto',
                        transform: `translateZ(${index * 20}px)`,
                    }}
                >
                    {child}
                </div>
            ))}
        </div>
    );
}
