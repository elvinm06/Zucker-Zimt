'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { setLenis } from '@/lib/scroll';

/**
 * Inertia scrolling on pointer devices. Touch screens already have their
 * own physics, and reduced-motion users keep the browser's native scroll.
 *
 * Lenis scrolls the real window, so sticky elements, IntersectionObserver
 * and Framer's useScroll all keep working unchanged.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!pointer.matches || reduced.matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.09,
      wheelMultiplier: 1,
      // Same-page "#…" links glide instead of jumping.
      anchors: { offset: -88 },
    });
    setLenis(lenis);

    return () => {
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
