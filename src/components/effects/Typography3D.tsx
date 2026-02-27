import { ReactNode } from 'react';
import { useTheme } from '@/components/theme-provider';
import { useAnimationPreference } from '@/contexts/AnimationContext';

interface Typography3DProps {
    children: ReactNode;
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
    animated?: boolean;
}

export function Typography3D({
    children,
    className = '',
    as: Component = 'h1',
    animated = true
}: Typography3DProps) {
    const { theme } = useTheme();
    const { effectiveMode } = useAnimationPreference();
    const isDark = theme === 'dark';

    const baseClasses = 'typography-3d';
    const themeClasses = isDark ? 'typography-3d-dark' : 'typography-3d-light';
    const animationClasses = animated && effectiveMode === 'full' ? 'typography-3d-animated' : '';

    return (
        <Component
            className={`${baseClasses} ${themeClasses} ${animationClasses} ${className}`}
            style={{
                transformStyle: 'preserve-3d',
            }}
        >
            {children}
        </Component>
    );
}
