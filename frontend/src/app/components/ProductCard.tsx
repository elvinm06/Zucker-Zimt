'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from 'framer-motion';
import { formatPrice } from '@/config/app.config';
import type { Product } from '@/types/product';
import AllergenBadge from './AllergenBadge';
import { useSiteLang } from './LocaleProvider';
import { EASE } from './motion/Reveal';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 48, scale: 0.94, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: EASE },
  },
};

export default function ProductCard({ product }: { product: Product }) {
  const cover = product.images?.[0];
  const { t } = useSiteLang();
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const springs = { stiffness: 180, damping: 18, mass: 0.5 };
  const rotateX = useSpring(useMotionValue(0), springs);
  const rotateY = useSpring(useMotionValue(0), springs);
  // Image drifts opposite to the tilt, which sells the depth.
  const imageX = useSpring(useMotionValue(0), springs);
  const imageY = useSpring(useMotionValue(0), springs);
  const glareX = useSpring(useMotionValue(50), springs);
  const glareY = useSpring(useMotionValue(50), springs);

  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,253,250,0.35), transparent 60%)`;

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    rotateY.set((px - 0.5) * 12);
    rotateX.set((0.5 - py) * 12);
    imageX.set((0.5 - px) * 18);
    imageY.set((0.5 - py) * 18);
    glareX.set(px * 100);
    glareY.set(py * 100);
  }

  function reset() {
    setHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    imageX.set(0);
    imageY.set(0);
    glareX.set(50);
    glareY.set(50);
  }

  return (
    <motion.div
      variants={cardVariants}
      style={{ perspective: 1000 }}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={reset}
    >
      <motion.article
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={prefersReduced ? undefined : { y: -10 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="card group h-full overflow-hidden transition-shadow duration-500 hover:shadow-lift focus-within:ring-4 focus-within:ring-accent/30"
      >
        <Link href={`/torte/${product.id}`} className="block focus:outline-none">
          <div className="relative aspect-[4/3] overflow-hidden bg-cream-200">
            {/* Oversized so the parallax drift never exposes an edge. */}
            <motion.div
              style={{ x: imageX, y: imageY }}
              className="absolute -inset-[6%]"
            >
              {cover ? (
                <Image
                  src={cover}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.1]"
                />
              ) : (
                <div className="grid h-full place-items-center text-5xl opacity-60">
                  🍰
                </div>
              )}
            </motion.div>

            {!prefersReduced && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                style={{ background: glare, opacity: hovered ? 1 : 0 }}
              />
            )}

            {/* Shine sweeps across once per hover. */}
            {!prefersReduced && hovered && (
              <motion.div
                aria-hidden
                initial={{ x: '-160%' }}
                animate={{ x: '260%' }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
                className="pointer-events-none absolute inset-y-0 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-cream-50/45 to-transparent"
              />
            )}

            <motion.span
              style={{ z: 40 }}
              className="absolute right-4 top-4 rounded-full bg-cream-50/95 px-3.5 py-1.5 text-sm font-semibold text-primary shadow-soft backdrop-blur"
            >
              {formatPrice(product.price)}
            </motion.span>

            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-chocolate-800/55 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <motion.span
              initial={false}
              animate={
                hovered && !prefersReduced
                  ? { y: 0, opacity: 1 }
                  : { y: 14, opacity: 0 }
              }
              transition={{ duration: 0.45, ease: EASE }}
              style={{ z: 40 }}
              className="absolute bottom-4 left-4 rounded-full bg-cream-50/95 px-4 py-1.5 text-xs font-medium text-primary shadow-soft"
            >
              {t.cardCta}
            </motion.span>
          </div>

          <div className="space-y-3 p-6">
            <h3 className="text-xl font-semibold leading-snug text-primary">
              {product.name}
            </h3>

            <p className="line-clamp-2 text-sm leading-relaxed text-muted">
              {product.description}
            </p>

            {product.allergens?.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                {product.allergens.slice(0, 3).map((allergen, i) => (
                  <motion.span
                    key={allergen}
                    initial={false}
                    animate={hovered && !prefersReduced ? { y: -2 } : { y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3, ease: EASE }}
                  >
                    <AllergenBadge allergen={allergen} size="sm" />
                  </motion.span>
                ))}
                {product.allergens.length > 3 && (
                  <span className="text-[11px] text-muted">
                    {t.moreAllergens(product.allergens.length - 3)}
                  </span>
                )}
              </div>
            )}
          </div>
        </Link>
      </motion.article>
    </motion.div>
  );
}
