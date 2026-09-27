'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WhatsAppIcon } from './BrandIcons';
import { EASE } from './motion/Reveal';

/**
 * Sticky order bar for phones: price plus the WhatsApp button, shown while
 * the real order panel (`anchorId`) is still further down the page.
 * Desktop never needs it — the panel sits next to the photo there.
 */
export default function MobileOrderBar({
  price,
  href,
  label,
  anchorId,
}: {
  price: string;
  href: string;
  label: string;
  anchorId: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const panel = document.getElementById(anchorId);
    if (!panel) return;

    const observer = new IntersectionObserver(
      // Only while the panel is still ahead: once it has scrolled past, the
      // visitor has seen the buttons and the bar would just cover content.
      ([entry]) =>
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top > 0),
      { threshold: 0.15 },
    );
    observer.observe(panel);
    return () => observer.disconnect();
  }, [anchorId]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          exit={{ y: '110%' }}
          transition={{ duration: 0.5, ease: EASE }}
          className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden"
        >
          <div className="flex items-center justify-between gap-4 rounded-full border border-line bg-cream-50/90 py-2 pl-6 pr-2 shadow-lift backdrop-blur-xl">
            <span className="font-display text-xl text-primary">{price}</span>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-[#25D366] px-5 py-3 text-sm text-[#0B3B22]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {label}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
