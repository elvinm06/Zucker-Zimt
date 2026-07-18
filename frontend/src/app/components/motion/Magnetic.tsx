'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

/**
 * Pulls its child toward the pointer while hovered, then springs back.
 * `strength` is the fraction of the pointer offset that is followed —
 * anything above ~0.4 starts to feel unstable rather than premium.
 */
export default function Magnetic({
  children,
  strength = 0.32,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const x = useSpring(useMotionValue(0), {
    stiffness: 260,
    damping: 20,
    mass: 0.5,
  });
  const y = useSpring(useMotionValue(0), {
    stiffness: 260,
    damping: 20,
    mass: 0.5,
  });

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      className={className}
    >
      {children}
    </motion.div>
  );
}
