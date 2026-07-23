'use client';

import { useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion';
import { useSiteLang } from './LocaleProvider';
import { useSettings } from './SettingsProvider';
import AnimatedNumber from './AnimatedNumber';
import CakeSearch from './CakeSearch';
import FloatingDecor from './motion/FloatingDecor';
import Magnetic from './motion/Magnetic';
import { EASE } from './motion/Reveal';
import SplitText from './motion/SplitText';



const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.075, delayChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { y: 26, opacity: 0, filter: 'blur(6px)' },
  visible: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE },
  },
};

export default function Hero() {
  const settings = useSettings();
  const { t } = useSiteLang();

  const stats = [
    { value: 500, suffix: '+', label: t.statCustomers },
    { value: 100, suffix: ' %', label: t.statHomemade },
    { value: 48, suffix: t.statLeadTimeValue, label: t.statLeadTime },
  ];
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // --- Scroll parallax: image and blobs drift at different speeds ---
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '32%']);
  const heroFade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  // --- Pointer-driven 3D tilt, smoothed by springs ---
  const tiltX = useSpring(useMotionValue(0), {
    stiffness: 150,
    damping: 18,
    mass: 0.6,
  });
  const tiltY = useSpring(useMotionValue(0), {
    stiffness: 150,
    damping: 18,
    mass: 0.6,
  });
  // The highlight follows the pointer so the card looks lit from that side.
  const glareX = useSpring(useMotionValue(50), { stiffness: 120, damping: 20 });
  const glareY = useSpring(useMotionValue(50), { stiffness: 120, damping: 20 });
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,253,250,0.38), transparent 55%)`;

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (prefersReduced || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    // Max 9° of rotation keeps it elegant rather than gimmicky.
    tiltY.set((px - 0.5) * 18);
    tiltX.set((0.5 - py) * 18);
    glareX.set(px * 100);
    glareY.set(py * 100);
  }

  function handlePointerLeave() {
    tiltX.set(0);
    tiltY.set(0);
    glareX.set(50);
    glareY.set(50);
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-cream-gradient">
      {/* Slowly drifting blobs — each on its own loop so they never sync up. */}
      <motion.div
        aria-hidden
        className="blob -left-32 -top-24 h-96 w-96 bg-caramel-300/30"
        animate={
          prefersReduced ? {} : { x: [0, 40, -20, 0], y: [0, -30, 20, 0] }
        }
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="blob -bottom-40 right-[-10%] h-[28rem] w-[28rem] bg-chocolate-300/25"
        animate={
          prefersReduced ? {} : { x: [0, -50, 25, 0], y: [0, 25, -20, 0] }
        }
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="blob left-1/2 top-1/3 h-64 w-64 bg-cream-500/30"
        animate={prefersReduced ? {} : { scale: [1, 1.18, 0.95, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Bakery bits at different depths, following the pointer. */}
      <FloatingDecor />

      <motion.div
        style={prefersReduced ? undefined : { opacity: heroFade }}
        initial="hidden"
        animate="visible"
        variants={container}
        className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 sm:py-28 lg:grid-cols-[1.05fr_0.95fr]"
      >
        {/* --- Copy --- */}
        <motion.div
          style={prefersReduced ? undefined : { y: copyY }}
          className="text-center lg:text-left"
        >
          <motion.span variants={fadeUp} className="eyebrow">
            <motion.span
              aria-hidden
              animate={prefersReduced ? {} : { rotate: [0, 180, 360] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
              className="inline-block"
            >
              ✦
            </motion.span>
            {t.heroEyebrow}
          </motion.span>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] text-primary sm:text-6xl">
            <SplitText
              text={settings.name}
              trigger="mount"
              delay={0.15}
              className="block"
            />
            <SplitText
              text={t.heroSubline}
              trigger="mount"
              delay={0.5}
              className="mt-3 block bg-gradient-to-r from-caramel-500 to-chocolate-400 bg-clip-text text-2xl font-normal italic text-transparent sm:text-3xl"
            />
          </h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted lg:mx-0"
          >
            {settings.tagline}. {t.heroLead}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
          >
            <Magnetic className="w-full sm:w-auto">
            <motion.a
              href="#katalog"
              className="btn-primary w-full sm:w-auto"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              {t.heroCtaCatalog}
            </motion.a>
            </Magnetic>
            <Magnetic className="w-full sm:w-auto">
            <motion.a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost w-full sm:w-auto"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              {t.heroCtaAdvice}
            </motion.a>
            </Magnetic>
          </motion.div>

          {/* Search the catalogue by cake name. */}
          <motion.div
            variants={fadeUp}
            className="mt-6 flex justify-center lg:justify-start"
          >
            <CakeSearch />
          </motion.div>

          <motion.dl
            variants={fadeUp}
            className="mt-12 grid grid-cols-3 gap-4 border-t border-cream-300/80 pt-8"
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-2xl font-semibold text-primary sm:text-3xl">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </dt>
                <dd className="mt-1 text-xs text-muted sm:text-sm">
                  {stat.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* --- Image with tilt, parallax and a sweeping shine --- */}
        <motion.div
          variants={fadeUp}
          style={prefersReduced ? undefined : { y: imageY }}
          className="relative mx-auto hidden aspect-square w-full max-w-md lg:block"
          // Perspective must sit on the parent for the child rotation to read as 3D.
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <div style={{ perspective: 1200 }} className="h-full w-full">
            <motion.div
              ref={imageRef}
              style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }}
              className="relative h-full w-full"
            >
              <motion.div
                aria-hidden
                className="absolute inset-0 rotate-3 rounded-4xl bg-caramel-gradient opacity-30 blur-2xl"
                animate={prefersReduced ? {} : { opacity: [0.22, 0.4, 0.22] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />

              <motion.div
                initial={
                  prefersReduced
                    ? undefined
                    : { clipPath: 'inset(12% 12% 12% 12% round 2.75rem)', scale: 1.12 }
                }
                animate={
                  prefersReduced
                    ? undefined
                    : { clipPath: 'inset(0% 0% 0% 0% round 2.75rem)', scale: 1 }
                }
                transition={{ duration: 1.3, ease: EASE, delay: 0.25 }}
                className="absolute inset-0 overflow-hidden rounded-4xl border border-cream-300/80 bg-cream-200 bg-cover bg-center shadow-lift"
                style={{
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&q=80)',
                }}
              >
                {/* Pointer-following highlight. */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                  style={prefersReduced ? undefined : { background: glare }}
                />

                {/* Slow shine sweep across the surface. */}
                {!prefersReduced && (
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-cream-50/35 to-transparent"
                    animate={{ x: ['-150%', '400%'] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      repeatDelay: 5,
                      ease: 'easeInOut',
                    }}
                  />
                )}
              </motion.div>

              {/* Floating badge — lifted toward the viewer on the Z axis. */}
              <motion.div
                // `z` must go through Framer, not a raw CSS transform —
                // Framer owns the transform property and would overwrite it.
                initial={{ opacity: 0, y: 30, scale: 0.9, z: 60 }}
                animate={{ opacity: 1, y: 0, scale: 1, z: 60 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 18,
                  delay: 1.1,
                }}
                className="absolute -bottom-6 -left-8 w-56 rounded-3xl border border-cream-300/80 bg-cream-50/95 p-4 shadow-lift backdrop-blur"
              >
                <motion.div
                  animate={prefersReduced ? {} : { y: [0, -9, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <p className="text-sm font-medium text-primary">
                    {t.heroBadgeTitle}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {t.heroBadgeText}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue — a dot runs down the track; fades once scrolling starts. */}
      <motion.div
        aria-hidden
        style={prefersReduced ? { x: '-50%' } : { opacity: heroFade, x: '-50%' }}
        className="absolute bottom-10 left-1/2 hidden lg:block"
      >
        <motion.a
          href="#katalog"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 1.7 }}
          className="pointer-events-auto flex flex-col items-center gap-2 text-muted transition-colors hover:text-primary"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">
            {t.scrollHint.replace('↓', '').trim()}
          </span>
          <span className="relative block h-8 w-px overflow-hidden rounded-full bg-chocolate-200/70">
            <motion.span
              className="absolute left-0 top-0 h-3 w-px bg-caramel-500"
              animate={prefersReduced ? undefined : { y: [-12, 36] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                repeatDelay: 0.4,
                ease: 'easeInOut',
              }}
            />
          </span>
        </motion.a>
      </motion.div>
    </section>
  );
}
