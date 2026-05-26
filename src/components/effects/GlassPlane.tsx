import { ReactNode } from 'react';
import { useTheme } from '@/components/theme-provider';

interface GlassPlaneProps {
    children: ReactNode;
    className?: string;
    blur?: number;
    opacity?: number;
    holographic?: boolean;
}

export function GlassPlane({
    children,
    className = '',
    blur = 24,
    opacity = 0.7,
    holographic = true
}: GlassPlaneProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const baseClasses = 'glass-plane';
    const themeClasses = isDark ? 'glass-plane-dark' : 'glass-plane-light';

    return (
        <div
            className={`${baseClasses} ${themeClasses} ${className}`}
            style={{
                backdropFilter: `blur(${blur}px) saturate(180%)`,
                WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
            }}
        >
            {children}
            {holographic && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `linear-gradient(
              45deg,
              transparent 0%,
              ${isDark ? 'hsla(199, 89%, 48%, 0.03)' : 'hsla(217, 91%, 50%, 0.03)'} 25%,
              ${isDark ? 'hsla(175, 80%, 50%, 0.03)' : 'hsla(45, 100%, 51%, 0.03)'} 50%,
              transparent 100%
            )`,
                        animation: 'glass-sheen 8s linear infinite',
                    }}
                />
            )}
        </div>
    );
}
