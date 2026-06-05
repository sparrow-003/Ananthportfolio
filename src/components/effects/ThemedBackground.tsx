import { memo } from 'react';
import { useTheme } from '@/components/theme-provider';

/**
 * Socia HRM themed background — light/dark aware.
 * Uses the design tokens from src/index.css :root / .dark.
 */
const ThemedBackground = memo(() => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 transition-colors duration-500"
      style={{
        background: isDark
          ? 'linear-gradient(160deg, hsl(240 20% 4%) 0%, hsl(199 50% 7%) 50%, hsl(240 20% 4%) 100%)'
          : 'linear-gradient(160deg, hsl(0 0% 100%) 0%, hsl(199 60% 97%) 50%, hsl(0 0% 100%) 100%)',
      }}
    >
      {/* Subtle brand ambient glows */}
      <div
        className="absolute -top-1/3 -left-1/4 w-1/2 h-2/3 rounded-full blur-3xl"
        style={{
          background: isDark
            ? 'radial-gradient(circle, hsl(199 100% 50% / 0.10) 0%, transparent 70%)'
            : 'radial-gradient(circle, hsl(199 100% 40% / 0.06) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute -bottom-1/3 -right-1/4 w-1/2 h-2/3 rounded-full blur-3xl"
        style={{
          background: isDark
            ? 'radial-gradient(circle, hsl(36 100% 57% / 0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, hsl(36 100% 57% / 0.05) 0%, transparent 70%)',
        }}
      />
    </div>
  );
});

ThemedBackground.displayName = 'ThemedBackground';

export default ThemedBackground;
