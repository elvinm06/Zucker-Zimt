'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import { useSiteLang } from '../LocaleProvider';
import { useSettings } from '../SettingsProvider';
import { EASE } from './Reveal';

/**
 * useLayoutEffect fires before the browser paints, so returning visitors
 * never see the overlay flash — but it warns when rendered on the server,
 * hence the isomorphic fallback.
 */
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const SEEN_KEY = 'bakery_intro_seen';

/** How long the brand frame holds before the curtain lifts. */
const HOLD_MS = 2100;

const letter: Variants = {
  hidden: { y: '115%', rotateZ: 5 },
  visible: (i: number) => ({
    y: '0%',
    rotateZ: 0,
    transition: { duration: 0.85, ease: EASE, delay: 0.35 + i * 0.04 },
  }),
};

/**
 * Cinematic first-load sequence: the brand name rises letter by letter out
 * of a chocolate curtain, then the curtain lifts in two layers to reveal
 * the hero. Plays once per browser session.
 *
 * The overlay is part of the server HTML on purpose — it covers the page
 * from the very first byte instead of popping in after hydration.
 */
export default function IntroLoader() {
  const { name } = useSettings();
  const { t } = useSiteLang();
  const prefersReduced = useReducedMotion();
  const [show, setShow] = useState(true);
  // Skipping must bypass AnimatePresence — otherwise the curtain would
  // replay its exit animation on every in-session reload.
  const [skipped, setSkipped] = useState(false);

  useIsomorphicLayoutEffect(() => {
    // Repeat visit in this session, or reduced motion: remove before paint.
    if (prefersReduced || sessionStorage.getItem(SEEN_KEY)) {
      setSkipped(true);
      setShow(false);
      return;
    }

    document.documentElement.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      sessionStorage.setItem(SEEN_KEY, '1');
      setShow(false);
    }, HOLD_MS);

    return () => {
      clearTimeout(timer);
      document.documentElement.style.overflow = '';
    };
    // Mount-only: re-running on a media-query flip would re-lock the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Release the scroll lock the moment the curtain starts to leave.
  useEffect(() => {
    if (!show) document.documentElement.style.overflow = '';
  }, [show]);

  const words = name.split(' ');
  let letterIndex = 0;

  if (skipped) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden
          data-intro-overlay=""
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden"
        >
          {/* Runs while the HTML is still parsing, so returning visitors
              never see the overlay — not even before React hydrates. The
              rule goes into <head>, which React never diffs, instead of
              touching this element's style (that would warn on hydration). */}
          <script
            dangerouslySetInnerHTML={{
              __html: `try{if(sessionStorage.getItem('${SEEN_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches){var s=document.createElement('style');s.textContent='[data-intro-overlay]{display:none!important}';document.head.appendChild(s);}}catch(e){}`,
            }}
          />
          {/* Back curtain — leaves last, so the wipe reads as two layers. */}
          <motion.div
            className="absolute inset-0 rounded-b-[3.5rem] bg-chocolate-800"
            exit={{
              y: '-100%',
              transition: { duration: 0.9, ease: EASE, delay: 0.22 },
            }}
          />
          {/* Front curtain — lifts first and shows the darker layer behind. */}
          <motion.div
            className="absolute inset-0 rounded-b-[3.5rem] bg-chocolate-gradient"
            exit={{
              y: '-100%',
              transition: { duration: 0.8, ease: EASE, delay: 0.08 },
            }}
          />

          <motion.div
            className="relative px-6 text-center"
            exit={{
              opacity: 0,
              y: -28,
              transition: { duration: 0.3, ease: 'easeIn' },
            }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.15,
              }}
              className="mb-6 inline-block text-caramel-300"
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                className="block text-2xl"
              >
                ✦
              </motion.span>
            </motion.span>

            {/* Brand name — each letter rises out of its own clip window. */}
            <h1 className="flex flex-wrap items-baseline justify-center gap-x-[0.35em] font-display text-4xl font-semibold text-cream-100 sm:text-6xl">
              {words.map((word, w) => (
                <span key={`${word}-${w}`} className="whitespace-nowrap">
                  {Array.from(word).map((char, c) => {
                    const i = letterIndex++;
                    return (
                      <span
                        key={`${char}-${c}`}
                        className="inline-block overflow-hidden pb-[0.12em] align-bottom"
                      >
                        <motion.span
                          custom={i}
                          variants={letter}
                          initial="hidden"
                          animate="visible"
                          className="inline-block"
                        >
                          {char}
                        </motion.span>
                      </span>
                    );
                  })}
                </span>
              ))}
            </h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 1.05 }}
              className="mx-auto mt-6 h-px w-28 bg-caramel-gradient"
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 1.2 }}
              className="mt-5 text-[11px] uppercase tracking-[0.4em] text-cream-300/80"
            >
              {t.konditorei}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
