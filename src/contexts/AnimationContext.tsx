import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type AnimationPreference = 'full' | 'reduced' | 'off';
type EffectiveMode = 'full' | 'reduced' | 'off';

interface AnimationContextType {
  userPreference: AnimationPreference;
  setUserPreference: (pref: AnimationPreference) => void;
  effectiveMode: EffectiveMode;
  reducedMotion: boolean;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

const STORAGE_KEY = 'animation-preference';

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(() => 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  
  const [userPreference, setUserPreferenceState] = useState<AnimationPreference>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as AnimationPreference) || 'full';
  });

  // Listen for OS preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Persist user preference
  const setUserPreference = (pref: AnimationPreference) => {
    setUserPreferenceState(pref);
    localStorage.setItem(STORAGE_KEY, pref);
  };

  // Compute effective mode
  const effectiveMode: EffectiveMode = 
    reducedMotion ? 'reduced' : 
    userPreference === 'off' ? 'off' :
    userPreference === 'reduced' ? 'reduced' : 
    'full';

  return (
    <AnimationContext.Provider value={{ 
      userPreference, 
      setUserPreference, 
      effectiveMode, 
      reducedMotion 
    }}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimationPreference() {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimationPreference must be used within AnimationProvider');
  }
  return context;
}
