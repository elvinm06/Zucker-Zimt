'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from './components/motion/Reveal';

/**
 * Survives route changes but resets on a full page load — that is exactly
 * the difference between "navigating inside the site" (play the sweep)
 * and "arriving from outside" (show the page immediately).
 */
let hasNavigated = false;

/**
 * Runs on every route change (unlike layout.tsx, which persists).
 *
 * Two jobs:
 * 1. A quick opacity fade on the page itself. Only opacity — a transform
 *    or filter here would create a new containing block and break the
 *    sticky header on the pages below.
 * 2. On client-side navigations, a two-layer curtain (same family as the
 *    intro loader) sweeps up and reveals the new page.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();
  const [done, setDone] = useState(false);

  // Decided once per mount. The window check keeps the module flag off the
  // server, where it would leak between requests and break SSR for
  // first-time visitors.
  const [sweep] = useState(() => {
    if (typeof window === 'undefined') return false;
    const play = hasNavigated;
    hasNavigated = true;
    return play;
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        {children}
      </motion.div>

      {sweep && !prefersReduced && !done && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
          {/* Back layer — finishes last and unmounts the whole overlay. */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: '-100%' }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
            onAnimationComplete={() => setDone(true)}
            className="absolute inset-0 rounded-b-[3rem] bg-cream-100"
          />
          {/* Front layer — lifts first, revealing the cream behind it. */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: '-100%' }}
            transition={{ duration: 0.6, ease: EASE }}
            className="absolute inset-0 rounded-b-[3rem] bg-chocolate-gradient"
          />
        </div>
      )}
    </>
  );
}
