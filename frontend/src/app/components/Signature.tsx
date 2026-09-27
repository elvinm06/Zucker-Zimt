'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { formatPrice } from '@/config/app.config';
import { useReducedMotion } from '@/lib/motion';
import { scrollToTarget } from '@/lib/scroll';
import type { Product } from '@/types/product';
import { ArrowRight, ArrowUpRight, Cake } from './icons';
import { useSiteLang } from './LocaleProvider';
import Reveal from './motion/Reveal';
import SplitText from './motion/SplitText';

function ShowcaseCard({
  product,
  index,
  className = '',
}: {
  product: Product;
  index: number;
  className?: string;
}) {
  const { t } = useSiteLang();
  const cover = product.images?.[0];

  return (
    <Link
      href={`/torte/${product.id}`}
      data-cursor="view"
      data-cursor-label={t.cursorView}
      className={`group relative block shrink-0 overflow-hidden rounded-4xl bg-cream-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 ${className}`}
    >
      {cover ? (
        <Image
          src={cover}
          alt={product.name}
          fill
          sizes="(max-width: 1024px) 80vw, 44vw"
          className="object-cover transition-transform duration-[1400ms] ease-expo group-hover:scale-105"
        />
      ) : (
        <div className="grid h-full place-items-center text-chocolate-300">
          <Cake className="h-12 w-12" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-chocolate-900/80 via-chocolate-900/10 to-transparent" />

      <span className="label-mono absolute left-6 top-6 rounded-full bg-chocolate-900/35 px-2.5 py-1 text-cream-100 backdrop-blur-sm">
        0{index + 1}
      </span>
      <span
        aria-hidden
        className="absolute right-6 top-6 grid h-11 w-11 translate-y-2 place-items-center rounded-full bg-cream-50/90 text-primary opacity-0 transition-[opacity,transform] duration-500 ease-expo group-hover:translate-y-0 group-hover:opacity-100"
      >
        <ArrowUpRight className="h-4 w-4" />
      </span>

      <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4 text-cream-50">
        <div className="min-w-0">
          <h3 className="font-display text-2xl leading-tight sm:text-3xl lg:text-4xl">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 max-w-md text-sm text-cream-200/80">
            {product.description}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-cream-50/95 px-4 py-2 text-sm font-medium text-primary">
          {formatPrice(product.price)}
        </span>
      </div>
    </Link>
  );
}

/**
 * Four cakes shown large. On desktop the section pins and the row slides
 * sideways as the visitor scrolls down; on touch screens (and with reduced
 * motion) it is a plain snap carousel — pinning fights native inertia.
 */
export default function Signature({ products }: { products: Product[] }) {
  const { t } = useSiteLang();
  const prefersReduced = useReducedMotion();
  const items = products.slice(0, 4);

  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  // How far the track must travel: its own width minus the viewport.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () =>
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [items.length]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const x = useTransform(scrollYProgress, (v) => -v * distance);
  const progress = useTransform(scrollYProgress, (v) => `${v * 100}%`);

  if (items.length === 0) return null;

  const pinned = !prefersReduced;

  const heading = (
    <>
      <Reveal direction="none">
        <span className="eyebrow">{t.signatureEyebrow}</span>
      </Reveal>
      <h2 className="mt-6 text-display-md font-medium text-primary">
        <SplitText text={t.signatureTitle} />
      </h2>
      <Reveal delay={0.2}>
        <p className="mt-5 max-w-sm text-pretty leading-relaxed text-muted">
          {t.signatureLead}
        </p>
      </Reveal>
    </>
  );

  return (
    <section aria-label={t.signatureTitle} className="relative">
      {/* Desktop: pinned, scroll-driven horizontal track. */}
      <div
        ref={sectionRef}
        className={pinned ? 'relative hidden lg:block' : 'hidden'}
        style={{ height: distance ? `calc(100vh + ${distance}px)` : '100vh' }}
      >
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex w-max items-center gap-6 pl-10 pr-[10vw]"
          >
            <div className="w-[32vw] shrink-0 pr-12">
              {heading}
              <Reveal delay={0.35}>
                <span className="mt-10 inline-flex items-center gap-3 text-muted">
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-line">
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="block"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </span>
                  <span className="label-mono">{t.signatureHint}</span>
                </span>
              </Reveal>
            </div>

            {items.map((product, i) => (
              <ShowcaseCard
                key={product.id}
                product={product}
                index={i}
                className="h-[68vh] w-[42vw] min-w-[30rem]"
              />
            ))}

            <a
              href="#katalog"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget('#katalog', { offset: -80 });
              }}
              className="group grid h-[68vh] w-[24vw] min-w-[18rem] shrink-0 place-items-center rounded-4xl border border-line transition-colors duration-500 hover:border-primary/40"
            >
              <span className="flex flex-col items-center gap-5 text-center">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-primary text-cream-100 transition-transform duration-500 ease-expo group-hover:scale-110">
                  <ArrowUpRight className="h-6 w-6" />
                </span>
                <span className="max-w-[10rem] font-display text-2xl leading-tight text-primary">
                  {t.signatureAll}
                </span>
              </span>
            </a>
          </motion.div>

          {/* Progress hairline along the bottom. */}
          <div className="absolute inset-x-10 bottom-8 h-px bg-line">
            <motion.div style={{ width: progress }} className="h-full bg-accent" />
          </div>
        </div>
      </div>

      {/* Phones, tablets and reduced motion: a native snap carousel. */}
      <div className={`py-20 ${pinned ? 'lg:hidden' : ''}`}>
        <div className="wrap">{heading}</div>
        <div
          data-lenis-prevent
          className="scrollbar-hide mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:px-8"
        >
          {items.map((product, i) => (
            <ShowcaseCard
              key={product.id}
              product={product}
              index={i}
              className="aspect-[4/5] w-[78vw] snap-center sm:w-[48vw]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
