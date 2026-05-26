import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * Reveal hook with safety fallback.
 * Returns [ref, isVisible]. Becomes true when element enters view OR after a
 * timeout — guarantees content never stays hidden on Vercel/prod hydration races.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  amount: number = 0.05,
  fallbackMs: number = 600
) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { amount, once: true });
  const [forced, setForced] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setForced(true), fallbackMs);
    return () => clearTimeout(t);
  }, [fallbackMs]);

  return [ref, inView || forced] as const;
}
