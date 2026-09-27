'use client';

import { useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from 'framer-motion';

type Mode = 'hidden' | 'default' | 'link' | 'view';

/** Ring diameter per state, in px. */
const SIZE: Record<Mode, number> = {
  hidden: 24,
  default: 28,
  link: 44,
  view: 96,
};

/**
 * Pointer companion: a caramel dot that keeps up with the pointer and a
 * ring that lags behind it. The ring grows over interactive elements and
 * turns into a labelled disc ("Ansehen") over product images tagged with
 * data-cursor="view".
 *
 * The native cursor stays visible — hiding it costs more in usability
 * than the effect gains. Pointer-and-hover devices only; touch screens and
 * reduced-motion users never mount it.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>('hidden');
  const [label, setLabel] = useState('');
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const ringX = useSpring(x, { stiffness: 220, damping: 24, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 220, damping: 24, mass: 0.6 });
  const dotX = useSpring(x, { stiffness: 900, damping: 50, mass: 0.3 });
  const dotY = useSpring(y, { stiffness: 900, damping: 50, mass: 0.3 });

  useEffect(() => {
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!pointer.matches || reduced.matches) return;
    setEnabled(true);

    function resolve(target: EventTarget | null) {
      const element = target instanceof Element ? target : null;
      const tagged = element?.closest<HTMLElement>('[data-cursor]');

      if (tagged?.dataset.cursor === 'view') {
        setLabel(tagged.dataset.cursorLabel ?? '');
        setMode('view');
        return;
      }
      if (tagged?.dataset.cursor === 'none') {
        setMode('hidden');
        return;
      }
      if (
        element?.closest(
          'a, button, [role="button"], input, textarea, select, label, summary',
        )
      ) {
        setMode('link');
        return;
      }
      setMode('default');
    }

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      resolve(e.target);
    };
    const onOver = (e: PointerEvent) => resolve(e.target);
    const onLeave = () => setMode('hidden');
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('blur', onLeave);
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('blur', onLeave);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  const size = SIZE[mode];
  const isView = mode === 'view';
  const hidden = mode === 'hidden';

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[85] overflow-hidden"
    >
      {/* Ring */}
      <motion.div style={{ x: ringX, y: ringY }} className="absolute left-0 top-0">
        <motion.div
          initial={false}
          animate={{
            width: size,
            height: size,
            x: -size / 2,
            y: -size / 2,
            opacity: hidden ? 0 : 1,
            scale: pressed ? 0.85 : 1,
            backgroundColor: isView
              ? 'rgba(251,246,239,1)'
              : 'rgba(251,246,239,0)',
            borderColor: isView
              ? 'rgba(251,246,239,1)'
              : mode === 'link'
                ? 'rgba(198,124,60,0.9)'
                : 'rgba(198,124,60,0.55)',
            boxShadow: isView
              ? '0 14px 34px -14px rgba(69,45,25,0.5)'
              : '0 0 0 0 rgba(69,45,25,0)',
          }}
          transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.6 }}
          className="grid place-items-center rounded-full border"
        >
          <AnimatePresence>
            {isView && label && (
              <motion.span
                key="label"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="text-[10px] font-medium uppercase tracking-[0.22em] text-primary"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Dot */}
      <motion.div style={{ x: dotX, y: dotY }} className="absolute left-0 top-0">
        <motion.div
          initial={false}
          animate={{
            x: '-50%',
            y: '-50%',
            opacity: hidden || isView ? 0 : 1,
            scale: mode === 'link' ? 0.6 : 1,
          }}
          transition={{ duration: 0.25 }}
          className="h-1.5 w-1.5 rounded-full bg-caramel-500"
        />
      </motion.div>
    </div>
  );
}
