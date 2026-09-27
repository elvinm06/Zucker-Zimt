'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { formatPrice } from '@/config/app.config';
import { allergenMeta } from '@/lib/allergens';
import type { Product } from '@/types/product';
import { AllergenIcon, ArrowUpRight, Cake } from './icons';
import { useSiteLang } from './LocaleProvider';
import { EASE } from './motion/Reveal';

// Each card reveals on its own as it scrolls in; `custom` carries the column
// index so cards in the same row cascade left to right.
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: (column: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE, delay: column * 0.08 },
  }),
};

// Variants propagate to motion children, so the photo can settle from a
// zoom while the card itself rises — no extra state needed.
const photoVariants: Variants = {
  hidden: { scale: 1.15 },
  visible: { scale: 1, transition: { duration: 1.3, ease: EASE } },
};

export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const cover = product.images?.[0];
  const { t, lang } = useSiteLang();
  // Track load/error so the image fades in over a skeleton instead of popping,
  // and a broken URL falls back to the placeholder instead of a torn icon.
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const allergens = product.allergens ?? [];

  return (
    <motion.article
      variants={cardVariants}
      custom={index % 3}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      className="group relative"
    >
      <Link
        href={`/torte/${product.id}`}
        data-cursor="view"
        data-cursor-label={t.cursorView}
        className="block rounded-[1.75rem] focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/30"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-cream-200">
          {cover && !failed && !loaded && (
            <div className="absolute inset-0 animate-pulse bg-cream-300/60" />
          )}

          <motion.div variants={photoVariants} className="absolute inset-0">
            {cover && !failed ? (
              <Image
                src={cover}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                onLoad={() => setLoaded(true)}
                onError={() => setFailed(true)}
                className={`object-cover transition-[transform,opacity] duration-[1400ms] ease-expo group-hover:scale-[1.06] ${
                  loaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ) : (
              <div className="grid h-full place-items-center text-chocolate-300">
                <Cake className="h-12 w-12" />
              </div>
            )}
          </motion.div>

          {/* Soft shade at the bottom so the price pill always reads. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-chocolate-900/45 to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-100" />

          <span className="absolute bottom-4 left-4 rounded-full bg-cream-50/95 px-3.5 py-1.5 text-sm font-medium text-primary shadow-soft backdrop-blur">
            {formatPrice(product.price)}
          </span>

          <span
            aria-hidden
            className="absolute right-4 top-4 grid h-11 w-11 translate-y-2 place-items-center rounded-full bg-cream-50/95 text-primary opacity-0 shadow-soft transition-[opacity,transform] duration-500 ease-expo group-hover:translate-y-0 group-hover:opacity-100"
          >
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:rotate-45" />
          </span>
        </div>

        <div className="mt-5 px-1">
          <h3 className="font-display text-2xl leading-tight text-primary transition-colors duration-300 group-hover:text-chocolate-500">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
            {product.description}
          </p>

          {allergens.length > 0 && (
            <ul
              className="mt-4 flex items-center gap-1.5"
              aria-label={t.allergens}
            >
              {allergens.slice(0, 4).map((allergen) => {
                const meta = allergenMeta(allergen);
                const label = lang === 'en' ? meta.labelEn : meta.label;
                return (
                  <li
                    key={allergen}
                    title={t.containsAllergen(label)}
                    className="grid h-7 w-7 place-items-center rounded-full border border-line text-chocolate-500 transition-colors duration-300 group-hover:border-caramel-400/50"
                  >
                    <AllergenIcon allergen={allergen} className="h-3.5 w-3.5" />
                    <span className="sr-only">{label}</span>
                  </li>
                );
              })}
              {allergens.length > 4 && (
                <li className="pl-1 text-[11px] text-muted">
                  {t.moreAllergens(allergens.length - 4)}
                </li>
              )}
            </ul>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
