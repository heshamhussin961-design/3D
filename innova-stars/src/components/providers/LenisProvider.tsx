'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface LenisProviderProps {
  children: ReactNode;
}

const LenisContext = createContext<Lenis | null>(null);

/**
 * Access the active Lenis instance for programmatic scrolling
 * (e.g. Nav links, back-to-top).
 */
export function useLenisInstance(): Lenis | null {
  return useContext(LenisContext);
}

/**
 * Smooth-scroll provider built on Lenis, synced with GSAP ScrollTrigger.
 */
export function LenisProvider({ children }: LenisProviderProps): JSX.Element {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Skip Lenis on touch devices: native momentum scroll is smoother on
    // mobile and avoids the well-known fight with ScrollTrigger pin.
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches
    ) {
      return;
    }

    const instance = new Lenis({
      duration: 1.2,
      easing: (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = instance;
    setLenis(instance);

    // GSAP's ticker emits time in SECONDS; Lenis.raf expects MILLISECONDS.
    function raf(time: number): void {
      instance.raf(time * 1000);
    }

    instance.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
