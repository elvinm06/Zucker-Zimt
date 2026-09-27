'use client';

import { MotionConfig } from 'framer-motion';

/**
 * Framer respects the visitor's reduced-motion setting on its own:
 * transform and layout animations are skipped, opacity still fades.
 * Components that render different markup consult `useReducedMotion`
 * from `@/lib/motion` on top of this.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
