'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  type Variants,
} from 'framer-motion';
import { setIntroReady } from '@/lib/intro';
import { lockScroll, scrollToTarget } from '@/lib/scroll';
import { useSiteLang } from '../LocaleProvider';
import { useSettings } from '../SettingsProvider';
import LogoMark from '../LogoMark';
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
const HOLD_MS = 1600;

/**
 * Jumps to the very top, ignoring the smooth easing declared for <html> —
 * the page has to be at the top the instant the curtain lifts, not gliding
 * there afterwards.
 */
function jumpToTop() {
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  root.style.scrollBehavior = previous;
  // Lenis keeps its own target position — reset that as well.
  scrollToTarget(0, { immediate: true });
}

const letter: Variants = {
  hidden: { y: '110%', rotateZ: 4 },
  visible: (i: number) => ({
    y: '0%',
    rotateZ: 0,
    transition: { duration: 0.7, ease: EASE, delay: 0.2 + i * 0.03 },
  }),
};

/** 000 → 100 while the frame holds. */
function Counter() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, 100, {
      duration: HOLD_MS / 1000 - 0.35,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, []);

  return <span className="tabular-nums">{String(value).padStart(3, '0')}</span>;
}

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
  const [show, setShow] = useState(true);
  // Skipping must bypass AnimatePresence — otherwise the curtain would
  // replay its exit animation on every in-session reload.
  const [skipped, setSkipped] = useState(false);
  // Only a played intro forces the top; a skipped one leaves the browser's
  // own scroll handling (restore on reload, jump to #hash) alone.
  const played = useRef(false);

  useIsomorphicLayoutEffect(() => {
    // Repeat visit in this session, or reduced motion: remove before paint.
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      sessionStorage.getItem(SEEN_KEY)
    ) {
      setSkipped(true);
      setShow(false);
      setIntroReady(true);
      return;
    }

    played.current = true;
    // The hero waits for the curtain before it plays its entrance.
    setIntroReady(false);
    // The browser would otherwise restore the offset from the previous visit
    // once the page is scrollable again, dropping the visitor into the middle
    // of the catalogue the moment the curtain lifts.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    jumpToTop();
    lockScroll(true);

    const timer = setTimeout(() => {
      sessionStorage.setItem(SEEN_KEY, '1');
      setShow(false);
    }, HOLD_MS);

    return () => {
      clearTimeout(timer);
      lockScroll(false);
      setIntroReady(true);
      if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
    };
    // Mount-only: re-running on a media-query flip would re-lock the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Release the scroll lock the moment the curtain starts to leave.
  useEffect(() => {
    if (show) return;
    lockScroll(false);
    if (!played.current) return;

    // Behind the still-closed curtain: undo anything that moved the page
    // while the intro ran — a restored offset, a #hash target — so the
    // reveal always lands on the top of the page.
    jumpToTop();
    if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
    setIntroReady(true);
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
          className="fixed inset-0 z-[100] overflow-hidden"
        >
          {/* Runs while the HTML is still parsing, so returning visitors
              never see the overlay — not even before React hydrates. The
              rule goes into <head>, which React never diffs, instead of
              touching this element's style (that would warn on hydration). */}
          <script
            dangerouslySetInnerHTML={{
              __html: `try{if(sessionStorage.getItem('${SEEN_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches){var s=document.createElement('style');s.textContent='[data-intro-overlay]{display:none!important}';document.head.appendChild(s);}else if('scrollRestoration' in history){history.scrollRestoration='manual';}}catch(e){}`,
            }}
          />
          {/* Back curtain — leaves last, so the wipe reads as two layers. */}
          <motion.div
            className="absolute inset-0 rounded-b-[4rem] bg-espresso"
            exit={{
              y: '-100%',
              transition: { duration: 1, ease: EASE, delay: 0.25 },
            }}
          />
          {/* Front curtain — lifts first and shows the darker layer behind. */}
          <motion.div
            className="absolute inset-0 rounded-b-[4rem] bg-chocolate-gradient"
            exit={{
              y: '-100%',
              transition: { duration: 0.9, ease: EASE, delay: 0.1 },
            }}
          />

          <motion.div
            className="absolute inset-0 grid place-items-center px-6 text-center"
            exit={{
              opacity: 0,
              y: -30,
              transition: { duration: 0.35, ease: 'easeIn' },
            }}
          >
            <div>
              <motion.span
                initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 180,
                  damping: 16,
                  delay: 0.05,
                }}
                className="mx-auto mb-8 block h-14 w-14 text-caramel-300 sm:h-16 sm:w-16"
              >
                <LogoMark className="h-full w-full" />
              </motion.span>

              {/* Brand name — each letter rises out of its own clip window. */}
              <h1 className="flex flex-wrap items-baseline justify-center gap-x-[0.3em] font-display text-[clamp(2.75rem,8vw,6.5rem)] font-medium leading-none text-cream-100">
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
                transition={{ duration: 0.7, ease: EASE, delay: 0.6 }}
                className="mx-auto mt-7 h-px w-24 bg-caramel-gradient"
              />

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.7 }}
                className="mt-5 text-[11px] uppercase tracking-[0.4em] text-cream-300/80"
              >
                {t.konditorei}
              </motion.p>
            </div>
          </motion.div>

          {/* Frame meta: counter and the filling hairline. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute inset-x-6 bottom-6 flex items-end justify-between text-[11px] uppercase tracking-[0.25em] text-cream-300/60 sm:inset-x-10 sm:bottom-8"
          >
            <Counter />
            <span>{name}</span>
          </motion.div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: HOLD_MS / 1000 - 0.3,
              ease: [0.65, 0, 0.35, 1],
              delay: 0.2,
            }}
            className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-caramel-400"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
