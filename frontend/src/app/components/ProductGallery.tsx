'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useSiteLang } from './LocaleProvider';
import { EASE } from './motion/Reveal';
import RotatingBadge from './motion/RotatingBadge';

/**
 * Product images: reveals with a clip-path wipe, tilts toward the pointer,
 * drifts against the scroll and cross-fades between thumbnails. The
 * optional rotating sticker sits on the image corner, outside the tilt.
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

  const springs = { stiffness: 160, damping: 18, mass: 0.5 };
  const rotateX = useSpring(useMotionValue(0), springs);
  const rotateY = useSpring(useMotionValue(0), springs);
  const glareX = useSpring(useMotionValue(50), springs);
  const glareY = useSpring(useMotionValue(50), springs);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,253,250,0.32), transparent 58%)`;

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 14);
    rotateX.set((0.5 - py) * 14);
    glareX.set(px * 100);
    glareY.set(py * 100);
  }

  function reset() {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
  }

  const current = images[active];

  return (
    <div className="space-y-3 lg:sticky lg:top-28 lg:self-start">
      <div
        ref={ref}
        onPointerMove={handlePointerMove}
        onPointerLeave={reset}
        style={{ perspective: 1200 }}
        className="relative"
      >
        {/* Slowly orbiting sticker — anchored here, not on the tilting
            card, so it stays put while the image leans. */}
        {badgeRing && (
          <RotatingBadge
            ring={badgeRing}
            className="absolute -bottom-5 -right-3 z-10 w-24 sm:-right-5 sm:w-28"
          >
            {badgeCenter}
          </RotatingBadge>
        )}
        <motion.div
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          initial={
            prefersReduced
              ? { opacity: 0 }
              : { clipPath: 'inset(0 0 100% 0 round 2.75rem)', opacity: 0 }
          }
          animate={
            prefersReduced
              ? { opacity: 1 }
              : { clipPath: 'inset(0 0 0% 0 round 2.75rem)', opacity: 1 }
          }
          transition={{ duration: 1.1, ease: EASE }}
          className="relative aspect-[4/3] overflow-hidden rounded-4xl border border-cream-300/70 bg-cream-200 shadow-lift"
        >
          {current && !failed[active] ? (
            <AnimatePresence mode="wait">
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
                    alt={name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 600px"
                    onError={() => setFailed((f) => ({ ...f, [active]: true }))}
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="grid h-full place-items-center text-6xl opacity-60">
              🍰
            </div>
          )}

          {images.length > 1 && (
            <span className="absolute bottom-4 right-4 rounded-full bg-cream-50/90 px-3 py-1 text-xs font-medium text-primary shadow-soft backdrop-blur">
              {active + 1} / {images.length}
            </span>
          )}

          {!prefersReduced && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 mix-blend-soft-light"
              style={{ background: glare }}
            />
          )}

          {/* One shine sweep after the reveal — not looped, the photo
              should stay calm afterwards. */}
          {!prefersReduced && (
            <motion.div
              aria-hidden
              initial={{ x: '-160%' }}
              animate={{ x: '420%' }}
              transition={{ duration: 1.3, ease: 'easeInOut', delay: 1.15 }}
              className="pointer-events-none absolute inset-y-0 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-cream-50/40 to-transparent"
            />
          )}
        </motion.div>
      </div>

      {/* Thumbnails only make sense from the second image onward. */}
      {images.length > 1 && (
        <div className="flex gap-2">
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
