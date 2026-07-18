'use client';

import { motion } from 'framer-motion';

/**
 * Runs on every route change (unlike layout.tsx, which persists).
 * Only opacity is animated: a transform or filter here would create a new
 * containing block and break the sticky header on the pages below.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
