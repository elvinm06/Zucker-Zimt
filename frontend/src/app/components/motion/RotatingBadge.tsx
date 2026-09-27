'use client';

import { useId } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';

/**
 * Circular sticker: the ring text slowly orbits the centre content.
 * `textLength` pins the text to the exact circumference, so any language
 * closes the loop perfectly without manual kerning.
 */
export default function RotatingBadge({
  ring,
  children,
  className,
  delay = 1.05,
}: {
  ring: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const prefersReduced = useReducedMotion();
  const id = useId().replace(/:/g, '');

  return (
    <motion.div
      aria-hidden
      initial={
        prefersReduced
          ? { opacity: 0 }
          : { opacity: 0, scale: 0, rotate: -40 }
      }
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 170, damping: 16, delay }}
      className={`pointer-events-none select-none ${className ?? ''}`}
    >
      <div className="relative aspect-square w-full rounded-full bg-cream-50/95 shadow-lift ring-1 ring-inset ring-line backdrop-blur">
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          animate={prefersReduced ? undefined : { rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        >
          <defs>
            {/* Circle path (r=38) the ring text runs along. */}
            <path
              id={`${id}-ring`}
              d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
            />
          </defs>
          <text fill="#7B532F" fontSize="9" letterSpacing="1.6">
            <textPath
              href={`#${id}-ring`}
              textLength="238"
              lengthAdjust="spacingAndGlyphs"
            >
              {ring.toUpperCase()}
            </textPath>
          </text>
        </motion.svg>

        <span className="absolute inset-0 grid place-items-center px-5 text-center font-display text-[15px] font-medium leading-tight text-primary">
          {children}
        </span>
      </div>
    </motion.div>
  );
}
