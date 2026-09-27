'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import { Cake, ChevronLeft, ChevronRight } from './icons';
import { useSiteLang } from './LocaleProvider';
import { EASE } from './motion/Reveal';
import RotatingBadge from './motion/RotatingBadge';

/**
 * Product images: reveals with a clip-path wipe, drifts against the scroll
 * and cross-fades between thumbnails (arrows and ←/→ keys as well). The
 * optional rotating sticker sits on the image corner.
 */
export default function ProductGallery({
  images,
  name,
  badgeRing,
  badgeCenter,
}: {
  images: string[];
  name: string;
  badgeRing?: string;
  badgeCenter?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useSiteLang();
  const prefersReduced = useReducedMotion();
  const [active, setActive] = useState(0);
  // Per-image error tracking so a broken URL shows the placeholder, not a
  // torn-image icon on top of the frame.
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const parallax = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  const count = images.length;
  const step = useCallback(
    (delta: number) => setActive((i) => (i + delta + count) % count),
    [count],
  );

  // Arrow keys while the gallery is focused.
  useEffect(() => {
    if (count < 2) return;
    const node = ref.current;
    if (!node) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    node.addEventListener('keydown', onKey);
    return () => node.removeEventListener('keydown', onKey);
  }, [count, step]);

  const current = images[active];

  return (
    <div className="space-y-3 lg:sticky lg:top-28 lg:self-start">
      <div
        ref={ref}
        tabIndex={count > 1 ? 0 : -1}
        aria-roledescription={count > 1 ? 'carousel' : undefined}
        className="group relative rounded-4xl focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/30"
      >
        {/* Slowly orbiting sticker — anchored here, not on the frame. */}
        {badgeRing && (
          <RotatingBadge
            ring={badgeRing}
            className="absolute -bottom-5 -right-3 z-10 w-24 sm:-right-5 sm:w-28"
          >
            {badgeCenter}
          </RotatingBadge>
        )}

        <motion.div
          // Same keys whatever the motion preference — a key that disappears
          // from `animate` would snap back to its initial (clipped) value.
          initial={{ clipPath: 'inset(0 0 100% 0 round 2.75rem)', opacity: 0 }}
          animate={{ clipPath: 'inset(0 0 0% 0 round 2.75rem)', opacity: 1 }}
          transition={{ duration: prefersReduced ? 0.01 : 1.1, ease: EASE }}
          className="relative aspect-[4/5] overflow-hidden rounded-4xl bg-cream-200 shadow-lift sm:aspect-[4/3] lg:aspect-[4/5]"
        >
          {current && !failed[active] ? (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="absolute inset-0"
              >
                <motion.div
                  style={prefersReduced ? undefined : { y: parallax }}
                  className="absolute -inset-[6%]"
                >
                  <Image
                    src={current}
                    alt={t.imageLabel(name, active + 1)}
                    fill
                    sizes="(max-width: 1024px) 100vw, 600px"
                    onError={() => setFailed((f) => ({ ...f, [active]: true }))}
                    className="object-cover transition-transform duration-[1400ms] ease-expo group-hover:scale-[1.03]"
                    priority
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="grid h-full place-items-center text-chocolate-300">
              <Cake className="h-14 w-14" />
            </div>
          )}

          {count > 1 && (
            <>
              <span className="absolute bottom-4 left-4 rounded-full bg-cream-50/90 px-3 py-1 text-xs font-medium tabular-nums text-primary shadow-soft backdrop-blur">
                {active + 1} / {count}
              </span>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={t.galleryPrev}
                className="btn-icon absolute left-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={t.galleryNext}
                className="btn-icon absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </motion.div>
      </div>

      {/* Thumbnails only make sense from the second image onward. */}
      {count > 1 && (
        <div className="flex gap-2 pt-2">
          {images.map((url, index) => (
            <motion.button
              key={url}
              type="button"
              onClick={() => setActive(index)}
              whileHover={prefersReduced ? undefined : { y: -3 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 20 }}
              aria-label={t.imageLabel(name, index + 1)}
              aria-current={index === active}
              className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-colors duration-300 ${
                index === active
                  ? 'border-accent'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image src={url} alt="" fill sizes="80px" className="object-cover" />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
