'use client';

import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useSiteLang } from './LocaleProvider';
import { useSettings } from './SettingsProvider';
import Magnetic from './motion/Magnetic';
import Reveal, { EASE } from './motion/Reveal';
import SplitText from './motion/SplitText';

export default function ContactCTA() {
  const ref = useRef<HTMLElement>(null);
  const settings = useSettings();
  const { t } = useSiteLang();
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // The panel settles as it enters and lifts slightly as it leaves.
  const y = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.98]);

  return (
    <section ref={ref} id="kontakt" className="mx-auto max-w-6xl px-5 py-16">
      <motion.div
        style={prefersReduced ? undefined : { y, scale }}
        className="relative overflow-hidden rounded-4xl bg-chocolate-gradient px-6 py-16 text-center shadow-lift sm:px-14"
      >
        <motion.div
          aria-hidden
          className="blob -left-20 -top-20 h-72 w-72 bg-caramel-400/30"
          animate={prefersReduced ? {} : { x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="blob -bottom-24 -right-16 h-80 w-80 bg-cream-300/20"
          animate={prefersReduced ? {} : { x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Slow light sweep across the whole panel. */}
        {!prefersReduced && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-1/4 skew-x-12 bg-gradient-to-r from-transparent via-cream-50/10 to-transparent"
            animate={{ x: ['-120%', '520%'] }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatDelay: 6,
              ease: 'easeInOut',
            }}
          />
        )}

        <div className="relative">
          <Reveal direction="none">
            <span className="inline-flex items-center gap-2 rounded-full border border-cream-200/25 bg-cream-50/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-cream-200">
              {t.ctaEyebrow}
            </span>
          </Reveal>

          <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-semibold leading-tight text-cream-50 sm:text-4xl">
            <SplitText text={t.ctaTitle} />
          </h2>

          <Reveal delay={0.15}>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-cream-200/90">
              {t.ctaText}
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Magnetic>
                <motion.a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cream-50 px-7 py-3.5 font-medium text-primary shadow-soft sm:w-auto"
                >
                  {t.ctaWhatsapp}
                </motion.a>
              </Magnetic>

              <Magnetic>
                <motion.a
                  href={`tel:${settings.phone.replace(/\s/g, '')}`}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-cream-200/35 px-7 py-3.5 font-medium text-cream-100 sm:w-auto"
                >
                  {settings.phone}
                </motion.a>
              </Magnetic>
            </div>
          </Reveal>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7, ease: EASE }}
            className="mt-8 text-sm text-cream-200/70"
          >
            {settings.hours} · {settings.address}
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
