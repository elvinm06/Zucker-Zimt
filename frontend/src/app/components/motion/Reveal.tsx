'use client';

import { motion, type Variants } from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';

/** Shared easing across the whole site — soft, decelerating, no overshoot. */
export const EASE = [0.16, 1, 0.3, 1] as const;

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const OFFSET: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 32 },
  down: { y: -32 },
  left: { x: 32 },
  right: { x: -32 },
  none: {},
};

/**
 * Scroll-triggered reveal: the element rises and fades in.
 * Use `delay` to cascade siblings that are not inside a Stagger container.
 */
export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.9,
  className,
  once = true,
  amount = 0.25,
}: {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}) {
  const prefersReduced = useReducedMotion();

  const variants: Variants = {
    hidden: prefersReduced ? { opacity: 0 } : { opacity: 0, ...OFFSET[direction] },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, delay, ease: EASE },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
