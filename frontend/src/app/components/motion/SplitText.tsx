'use client';

import { motion, type Variants } from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import { EASE } from './Reveal';

const word: Variants = {
  hidden: { y: '110%', opacity: 0, rotateZ: 2.5 },
  visible: {
    y: '0%',
    opacity: 1,
    rotateZ: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

/**
 * Reveals a line word by word: each word is clipped by its own wrapper and
 * rises out of it. `trigger` decides whether it runs on mount, when
 * scrolled into view (section headings), or under the caller's control
 * (`manual` + `play`, used by the hero to wait for the intro curtain).
 */
export default function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.075,
  trigger = 'view',
  play = true,
  as: Tag = 'span',
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  trigger?: 'mount' | 'view' | 'manual';
  play?: boolean;
  as?: 'span' | 'div';
}) {
  const prefersReduced = useReducedMotion();
  const words = text.split(' ');

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  // Without motion preference, render plain text — no clipping wrappers.
  if (prefersReduced) return <Tag className={className}>{text}</Tag>;

  const animationProps =
    trigger === 'mount'
      ? { animate: 'visible' as const }
      : trigger === 'manual'
        ? { animate: play ? ('visible' as const) : ('hidden' as const) }
        : {
            whileInView: 'visible' as const,
            viewport: { once: true, amount: 0.4 },
          };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      {...animationProps}
      className={className}
    >
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="inline-block overflow-hidden pb-[0.14em] align-bottom"
        >
          <motion.span variants={word} className="inline-block">
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
