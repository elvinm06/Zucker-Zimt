'use client';

import { useEffect } from 'react';
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';

type DecorItem = {
  emoji: string;
  className: string;
  /** How many pixels the item follows the pointer — larger reads closer. */
  depth: number;
  /** Duration of the idle float loop, seconds. */
  float: number;
  /** Entrance delay, seconds. */
  delay: number;
  /** Idle rotation amplitude, degrees. */
  sway: number;
};

// Fixed positions (no randomness) so server and client render identically.
const ITEMS: DecorItem[] = [
  { emoji: '🍓', className: 'top-[18%] right-[6%] text-3xl', depth: 36, float: 8, delay: 1.1, sway: 8 },
  { emoji: '🫐', className: 'bottom-[26%] right-[27%] text-2xl', depth: 20, float: 7, delay: 1.25, sway: -6 },
  { emoji: '🍒', className: 'top-[56%] right-[3%] text-3xl', depth: 46, float: 9, delay: 1.4, sway: -9 },
  { emoji: '🧁', className: 'bottom-[10%] left-[7%] text-3xl', depth: 30, float: 10, delay: 1.55, sway: 7 },
  { emoji: '✦', className: 'top-[14%] left-[4%] text-xl text-caramel-400', depth: 16, float: 6, delay: 1.7, sway: 12 },
  { emoji: '✦', className: 'bottom-[32%] left-[40%] text-sm text-caramel-500', depth: 12, float: 5, delay: 1.85, sway: -12 },
];

function Item({
  item,
  mx,
  my,
}: {
  item: DecorItem;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  // Each depth turns the shared pointer position into its own drift.
  const x = useTransform(mx, (v) => v * item.depth);
  const y = useTransform(my, (v) => v * item.depth);

  return (
    <motion.div
      style={{ x, y }}
      className={`absolute opacity-70 drop-shadow-sm ${item.className}`}
    >
      <motion.span
        initial={{ opacity: 0, scale: 0, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 180,
          damping: 14,
          delay: item.delay,
        }}
        className="block"
      >
        <motion.span
          animate={{ y: [0, -12, 0], rotate: [0, item.sway, 0] }}
          transition={{
            duration: item.float,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: item.delay,
          }}
          className="block"
        >
          {item.emoji}
        </motion.span>
      </motion.span>
    </motion.div>
  );
}

/**
 * Decorative layer for the hero: little bakery bits floating at different
 * depths. They idle on slow loops and follow the pointer with a spring —
 * near items move more than far ones, which reads as real depth.
 */
export default function FloatingDecor() {
  const prefersReduced = useReducedMotion();

  // Normalised pointer position, -0.5 … 0.5, smoothed by soft springs.
  const mx = useSpring(0, { stiffness: 55, damping: 18, mass: 0.9 });
  const my = useSpring(0, { stiffness: 55, damping: 18, mass: 0.9 });

  useEffect(() => {
    if (prefersReduced) return;

    function onMove(e: PointerEvent) {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [prefersReduced, mx, my]);

  if (prefersReduced) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden md:block"
    >
      {ITEMS.map((item, i) => (
        <Item key={i} item={item} mx={mx} my={my} />
      ))}
    </div>
  );
}
