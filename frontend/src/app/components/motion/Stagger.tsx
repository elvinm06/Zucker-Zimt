'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { EASE } from './Reveal';

/**
 * Container + item pair for cascading small elements (chips, badges).
 * Server Components can compose them freely — only these two are client.
 */
export function Stagger({
  children,
  className,
  delay = 0,
  stagger = 0.055,
  amount = 0.3,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  amount?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'span';
}) {
  const prefersReduced = useReducedMotion();
  const Comp = as === 'span' ? motion.span : motion.div;

  const item: Variants = {
    hidden: prefersReduced
      ? { opacity: 0 }
      : { opacity: 0, y: 14, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: EASE },
    },
  };

  return (
    <Comp variants={item} className={className}>
      {children}
    </Comp>
  );
}
