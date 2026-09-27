'use client';

import { useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import { useIntroReady } from '@/lib/intro';
import { scrollToTarget } from '@/lib/scroll';
import { WhatsAppIcon } from './BrandIcons';
import { ArrowDown, ArrowRight, Sparkles } from './icons';
import AnimatedNumber from './AnimatedNumber';
import LogoMark from './LogoMark';
import { useSiteLang } from './LocaleProvider';
import { useSettings } from './SettingsProvider';
import Magnetic from './motion/Magnetic';
import { EASE } from './motion/Reveal';
import RotatingBadge from './motion/RotatingBadge';
import SplitText from './motion/SplitText';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80';
const HERO_IMAGE_SMALL =
  'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&q=80';

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
};

const fadeUp: Variants = {
  hidden: { y: 28, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

const imageReveal: Variants = {
  hidden: { clipPath: 'inset(100% 0 0 0 round 2.75rem)' },
  visible: {
    clipPath: 'inset(0% 0 0 0 round 2.75rem)',
    transition: { duration: 1.3, ease: EASE, delay: 0.35 },
  },
};

const imageZoom: Variants = {
  hidden: { scale: 1.25 },
  visible: { scale: 1, transition: { duration: 1.8, ease: EASE, delay: 0.35 } },
};

const secondary: Variants = {
  hidden: { opacity: 0, y: 40, rotate: -8 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: -4,
    transition: { duration: 1, ease: EASE, delay: 1 },
  },
};

export default function Hero() {
  const settings = useSettings();
  const { t } = useSiteLang();
  const prefersReduced = useReducedMotion();
  // Plays only once the intro curtain has lifted (or immediately when there
  // is no intro), so the entrance is seen instead of hidden.
  const ready = useIntroReady();
  const ref = useRef<HTMLElement>(null);

  const stats = [
    { value: 500, suffix: '+', label: t.statCustomers },
    { value: 100, suffix: ' %', label: t.statHomemade },
    { value: 48, suffix: t.statLeadTimeValue, label: t.statLeadTime },
  ];

  // --- Scroll parallax: copy, image and the rings drift at different speeds ---
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 60]);

  // --- Pointer parallax on the photo, smoothed by springs ---
  const pointerX = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });
  const pointerY = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(px * -16);
    pointerY.set(py * -16);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  const initial = prefersReduced ? 'visible' : 'hidden';
  const state = prefersReduced || ready ? 'visible' : 'hidden';

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Decorative dotted rings — turn slowly with the scroll. */}
      <motion.svg
        aria-hidden
        style={prefersReduced ? undefined : { rotate: ringRotate }}
        viewBox="0 0 600 600"
        fill="none"
        className="pointer-events-none absolute -right-52 -top-64 h-[46rem] w-[46rem] text-chocolate-300/40 lg:-right-36 lg:-top-56"
      >
        <circle cx="300" cy="300" r="290" stroke="currentColor" strokeDasharray="2 12" />
        <circle cx="300" cy="300" r="220" stroke="currentColor" strokeOpacity="0.5" />
        <circle
          cx="300"
          cy="300"
          r="120"
          stroke="currentColor"
          strokeDasharray="1 8"
          strokeOpacity="0.7"
        />
      </motion.svg>
      <div
        aria-hidden
        className="blob -left-40 top-1/3 h-[30rem] w-[30rem] bg-caramel-300/25"
      />

      <motion.div
        style={prefersReduced ? undefined : { opacity: fade }}
        className="wrap relative grid min-h-[calc(100svh-4.5rem)] items-center gap-14 py-14 lg:grid-cols-12 lg:gap-10 lg:py-20"
      >
        {/* --- Copy --- */}
        <motion.div
          variants={container}
          initial={initial}
          animate={state}
          style={prefersReduced ? undefined : { y: copyY }}
          className="lg:col-span-7"
        >
          <motion.span variants={fadeUp} className="eyebrow">
            {t.heroEyebrow}
          </motion.span>

          <h1 className="mt-7 text-display-xl font-medium text-primary">
            <SplitText
              text={settings.name}
              trigger="manual"
              play={state === 'visible'}
              delay={0.25}
              className="block"
            />
            <SplitText
              text={t.heroSubline}
              trigger="manual"
              play={state === 'visible'}
              delay={0.6}
              stagger={0.06}
              className="font-soft mt-4 block text-display-md font-normal italic text-accent"
            />
          </h1>

          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-muted"
          >
            {settings.tagline}. {t.heroLead}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Magnetic strength={0.2} className="w-full sm:w-auto">
              <a
                href="#katalog"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget('#katalog', { offset: -80 });
                }}
                className="btn-primary group w-full sm:w-auto"
              >
                {t.heroCtaCatalog}
                <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:translate-x-1" />
              </a>
            </Magnetic>
            <Magnetic strength={0.2} className="w-full sm:w-auto">
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost w-full sm:w-auto"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {t.heroCtaAdvice}
              </a>
            </Magnetic>
          </motion.div>

          <motion.dl
            variants={fadeUp}
            className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-line pt-8"
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-3xl text-primary sm:text-4xl">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </dt>
                <dd className="mt-1.5 text-xs text-muted sm:text-sm">
                  {stat.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* --- Photo: clip reveal, scroll parallax, pointer drift --- */}
        <motion.div
          initial={initial}
          animate={state}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none"
        >
          <motion.div
            variants={imageReveal}
            style={prefersReduced ? undefined : { y: imageY }}
            className="relative aspect-[4/5] overflow-hidden rounded-4xl bg-cream-200 shadow-lift"
          >
            <motion.div variants={imageZoom} className="absolute inset-0">
              <motion.div
                style={
                  prefersReduced
                    ? undefined
                    : { scale: imageScale, x: pointerX, y: pointerY }
                }
                className="absolute -inset-[4%]"
              >
                <Image
                  src={HERO_IMAGE}
                  alt={t.heroImageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </motion.div>
            </motion.div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-chocolate-900/40 via-transparent to-transparent" />

            {/* Freshness note, sitting on the photo. */}
            <motion.div
              variants={fadeUp}
              className="absolute bottom-5 left-5 right-5 flex items-center gap-4 rounded-2xl border border-cream-100/30 bg-cream-50/85 p-4 backdrop-blur-md sm:right-auto sm:max-w-[17rem]"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-cream-100">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-primary">
                  {t.heroBadgeTitle}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-muted">
                  {t.heroBadgeText}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Second photo, tucked behind the corner. */}
          <motion.div
            variants={secondary}
            className="absolute -left-6 top-10 hidden w-36 overflow-hidden rounded-3xl border-4 border-surface shadow-lift lg:block xl:-left-14 xl:w-44"
          >
            <div className="relative aspect-square">
              <Image
                src={HERO_IMAGE_SMALL}
                alt={t.heroSecondaryAlt}
                fill
                sizes="176px"
                className="object-cover"
              />
            </div>
          </motion.div>

          <RotatingBadge
            ring={t.badgeRing}
            delay={1.3}
            className="absolute -right-3 -top-6 w-28 sm:-right-6 sm:w-32"
          >
            <LogoMark className="h-9 w-9 text-primary" />
          </RotatingBadge>
        </motion.div>
      </motion.div>

      {/* Scroll cue — fades out as the hero scrolls away. */}
      <motion.div
        style={prefersReduced ? undefined : { opacity: fade }}
        className="absolute bottom-8 left-5 hidden sm:left-8 lg:left-10 lg:block"
      >
        <motion.button
          type="button"
          onClick={() => scrollToTarget('#katalog', { offset: -80 })}
          initial={{ opacity: 0 }}
          animate={{ opacity: state === 'visible' ? 1 : 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="group flex items-center gap-3 text-muted transition-colors hover:text-primary"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full border border-line transition-colors group-hover:border-primary/40">
            <motion.span
              animate={prefersReduced ? undefined : { y: [0, 4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="block"
            >
              <ArrowDown className="h-4 w-4" />
            </motion.span>
          </span>
          <span className="label-mono">{t.heroScroll}</span>
        </motion.button>
      </motion.div>
    </section>
  );
}
