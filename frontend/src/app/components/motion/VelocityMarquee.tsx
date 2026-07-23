'use client';

import { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { useSiteLang } from '../LocaleProvider';

/** Keeps `v` inside [min, max) so the four copies loop seamlessly. */
function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

function MarqueeRow({ words }: { words: string[] }) {
  return (
    <span className="flex shrink-0 items-center">
      {words.map((word, i) => (
        <span key={word} className="flex items-center">
          <span
            className={`px-5 font-display text-5xl font-semibold italic leading-tight sm:px-7 sm:text-7xl ${
              i % 2 ? 'text-transparent' : 'text-chocolate-300/70'
            }`}
            style={
              i % 2
                ? { WebkitTextStroke: '1.5px rgba(155,111,67,0.45)' }
                : undefined
            }
          >
            {word}
          </span>
          <span className="text-2xl text-caramel-400/80 sm:text-3xl">✦</span>
        </span>
      ))}
    </span>
  );
}

/**
 * Infinite text band that drifts on its own and reacts to scrolling:
 * scroll speed multiplies the drift, scroll direction flips it, and the
 * whole band skews with the velocity — so the page feels physically
 * connected to the pointer.
 */
export default function VelocityMarquee({
  baseVelocity = -2.2,
}: {
  baseVelocity?: number;
}) {
  const { t } = useSiteLang();
  const prefersReduced = useReducedMotion();

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 55,
    stiffness: 380,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, 4], {
    clamp: false,
  });
  const skewX = useSpring(useTransform(smoothVelocity, [-1500, 1500], [-9, 9]), {
    stiffness: 220,
    damping: 32,
  });

  // Four identical copies → one copy is exactly 25% of the track.
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  const directionRef = useRef(1);
  useAnimationFrame((_, delta) => {
    let moveBy = directionRef.current * baseVelocity * (delta / 1000);

    // Scrolling up reverses the band; scrolling down restores it.
    const vf = velocityFactor.get();
    if (vf < 0) directionRef.current = -1;
    else if (vf > 0) directionRef.current = 1;

    moveBy += directionRef.current * moveBy * Math.abs(vf);
    baseX.set(baseX.get() + moveBy);
  });

  const words = t.marqueeWords;

  // Static, centered band — no drift, no skew.
  if (prefersReduced) {
    return (
      <section aria-hidden className="overflow-hidden py-12">
        <div className="flex justify-center">
          <MarqueeRow words={words} />
        </div>
      </section>
    );
  }

  return (
    <section aria-hidden className="relative overflow-hidden py-10 sm:py-14">
      {/* Slight tilt sells the "sticker across the page" look. */}
      <div className="-mx-[3%] -rotate-[1.2deg]">
        <div className="border-y border-chocolate-200/40 bg-gradient-to-r from-transparent via-cream-200/70 to-transparent py-5 sm:py-7">
          <motion.div
            style={{ x, skewX }}
            className="flex whitespace-nowrap will-change-transform"
          >
            <MarqueeRow words={words} />
            <MarqueeRow words={words} />
            <MarqueeRow words={words} />
            <MarqueeRow words={words} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
