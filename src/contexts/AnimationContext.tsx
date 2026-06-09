import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getDeviceCapabilities } from '../utils/deviceDetection';

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

const getDefaultPreference = (): AnimationPreference => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as AnimationPreference | null;
    if (stored === 'full' || stored === 'reduced' || stored === 'off') return stored;

    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    const cores = navigator.hardwareConcurrency ?? 4;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;

    if (saveData || memory <= 2 || cores <= 4) return 'reduced';
    return 'full';
  } catch {
    return 'reduced';
  }
};

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [capabilities] = useState(() => getDeviceCapabilities());
  const [reducedMotion, setReducedMotion] = useState(() => 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  
  const [userPreference, setUserPreferenceState] = useState<AnimationPreference>(getDefaultPreference);

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

  // Compute effective mode with hardware capability checks (1GB RAM Target)
  const effectiveMode: EffectiveMode = (() => {
    if (reducedMotion) return 'reduced';
    if (userPreference === 'off') return 'off';
    if (userPreference === 'reduced') return 'reduced';
    
    // Auto-disable animations for devices with <= 1.5GB RAM, <= 2 CPU cores, or low GPU tier
    if (capabilities.deviceMemory <= 1 || capabilities.hardwareConcurrency <= 2 || capabilities.gpuTier === 'low') {
      return 'off';
    }

    if (capabilities.deviceMemory <= 2 || capabilities.hardwareConcurrency <= 4 || capabilities.isMobile) {
      return 'reduced';
    }
    
    return 'full';
  })();

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
