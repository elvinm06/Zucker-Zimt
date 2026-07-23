'use client';

import { useId, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { EASE } from './Reveal';

/**
 * The signature scene: a knife drops into the frame, cuts the cake, and a
 * slice springs loose — crumbs, flash and sparkles included. Pure SVG in
 * the site palette, so it costs nothing to load and scales crisply.
 *
 * The whole cake is drawn once in <defs>; two clip paths split it into
 * "rest of the cake" and "the slice", so the cut line is always pixel-true.
 *
 * With reduced motion the scene renders in its final state: slice out,
 * knife gone, nothing moves.
 */

const CUT_AT = 1.15; // seconds until the blade reaches the plate

const knife: Variants = {
  whole: { opacity: 0, y: -70, rotate: -10 },
  cut: {
    opacity: [0, 1, 1, 1, 0],
    y: [-70, -20, 105, 105, -90],
    rotate: [-10, -4, 0, 0, 6],
    transition: {
      duration: 1.7,
      delay: 0.25,
      times: [0, 0.22, 0.5, 0.68, 1],
      ease: ['easeOut', 'easeIn', 'linear', 'easeIn'],
    },
  },
};

const flash: Variants = {
  whole: { opacity: 0 },
  cut: {
    opacity: [0, 0, 0.9, 0],
    transition: { duration: 1.7, delay: 0.25, times: [0, 0.45, 0.55, 0.72] },
  },
};

const slice: Variants = {
  whole: { x: 0, y: 0, rotate: 0 },
  cut: {
    x: 36,
    y: 3,
    rotate: 5,
    transition: {
      type: 'spring',
      stiffness: 110,
      damping: 12,
      delay: CUT_AT,
    },
  },
};

const cutFace: Variants = {
  whole: { opacity: 0 },
  cut: { opacity: 0.45, transition: { duration: 0.4, delay: CUT_AT + 0.1 } },
};

const crumb = (dx: number, dy: number, delay: number): Variants => ({
  whole: { opacity: 0, x: 0, y: 0 },
  cut: {
    opacity: [0, 1, 0],
    x: [0, dx, dx * 1.4],
    y: [0, dy * 0.4, dy],
    transition: { duration: 0.8, delay: CUT_AT + delay, ease: 'easeOut' },
  },
});

const sparkle = (delay: number): Variants => ({
  whole: { opacity: 0, scale: 0 },
  cut: {
    opacity: [0, 1, 0],
    scale: [0, 1.2, 0],
    rotate: [0, 40],
    transition: { duration: 0.9, delay: CUT_AT + delay, ease: 'easeOut' },
  },
});

const STAR =
  'M0 -6 L1.6 -1.6 L6 0 L1.6 1.6 L0 6 L-1.6 1.6 L-6 0 L-1.6 -1.6 Z';

export default function CakeCutScene({ className }: { className?: string }) {
  const prefersReduced = useReducedMotion();
  const [done, setDone] = useState(false);
  // useId may contain ":" which is not valid inside url(#…) references.
  const id = useId().replace(/:/g, '');

  return (
    <motion.div
      aria-hidden
      initial={prefersReduced ? 'cut' : 'whole'}
      whileInView="cut"
      viewport={{ once: true, amount: 0.45 }}
      variants={{
        whole: { opacity: 0, y: 22 },
        cut: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      }}
      className={className}
    >
      <svg viewBox="0 0 320 250" className="h-auto w-full">
        <defs>
          <linearGradient id={`${id}-caramel`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E8B888" />
            <stop offset="100%" stopColor="#C67C3C" />
          </linearGradient>

          <clipPath id={`${id}-main`}>
            <rect x="0" y="0" width="196" height="250" />
          </clipPath>
          <clipPath id={`${id}-slice`}>
            <rect x="196" y="0" width="124" height="250" />
          </clipPath>

          {/* The complete cake — referenced twice through the clip paths. */}
          <g id={`${id}-cake`}>
            {/* Sponge and cream layers */}
            <rect x="78" y="184" width="164" height="26" rx="3" fill="#5E3E23" />
            <rect x="78" y="174" width="164" height="10" fill="#F5EBDD" />
            <rect x="78" y="148" width="164" height="26" fill="#9C6F43" />
            <rect x="78" y="138" width="164" height="10" fill="#FBF6EF" />
            <rect x="78" y="120" width="164" height="18" fill="#7B532F" />

            {/* Caramel frosting cap with drips */}
            <rect
              x="74"
              y="98"
              width="172"
              height="26"
              rx="12"
              fill={`url(#${id}-caramel)`}
            />
            {[
              { x: 80, h: 16 },
              { x: 99, h: 24 },
              { x: 121, h: 14 },
              { x: 142, h: 26 },
              { x: 163, h: 15 },
              { x: 184, h: 22 },
              { x: 207, h: 17 },
              { x: 228, h: 25 },
            ].map((drip) => (
              <rect
                key={drip.x}
                x={drip.x}
                y="116"
                width="9"
                height={drip.h}
                rx="4.5"
                fill={`url(#${id}-caramel)`}
                opacity="0.95"
              />
            ))}

            {/* Cream dollops */}
            {[
              { x: 110, y: 94 },
              { x: 160, y: 90 },
              { x: 210, y: 94 },
            ].map((d) => (
              <g key={d.x}>
                <ellipse cx={d.x} cy={d.y} rx="8" ry="6" fill="#FFFDFA" />
                <circle cx={d.x} cy={d.y - 6} r="4" fill="#FFFDFA" />
              </g>
            ))}

            {/* Berries — one stays on the cake, one rides the slice */}
            {[120, 214].map((x) => (
              <g key={x}>
                <path
                  d={`M${x} 80 Q${x + 3} 73 ${x + 8} 71`}
                  stroke="#5E3E23"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx={x} cy="86" r="6.5" fill="#BE4A4E" />
                <circle cx={x - 2} cy="84" r="1.8" fill="#F5EBDD" opacity="0.7" />
              </g>
            ))}
          </g>
        </defs>

        {/* Plate */}
        <ellipse cx="160" cy="219" rx="118" ry="10" fill="#452D19" opacity="0.07" />
        <ellipse
          cx="160"
          cy="212"
          rx="112"
          ry="13"
          fill="#FFFDFA"
          stroke="#EDDDC7"
        />
        <ellipse cx="160" cy="211" rx="86" ry="8" fill="#F5EBDD" opacity="0.6" />

        {/* Rest of the cake */}
        <g clipPath={`url(#${id}-main)`}>
          <use href={`#${id}-cake`} />
        </g>

        {/* Exposed cut face once the slice is gone */}
        <motion.rect
          variants={cutFace}
          x="192.5"
          y="104"
          width="3.5"
          height="106"
          rx="1.75"
          fill="#FBF6EF"
        />

        {/* The slice — pivots around its bottom-left corner as it settles. */}
        <motion.g
          variants={slice}
          onAnimationComplete={(definition) =>
            definition === 'cut' && !prefersReduced && setDone(true)
          }
          style={{ transformBox: 'fill-box', transformOrigin: '0% 100%' }}
        >
          {/* Gentle breathing once the cut is finished. */}
          <motion.g
            animate={done ? { y: [0, -3.5, 0] } : undefined}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <g clipPath={`url(#${id}-slice)`}>
              <use href={`#${id}-cake`} />
            </g>
          </motion.g>
        </motion.g>

        {/* Cut flash */}
        <motion.rect
          variants={flash}
          x="194"
          y="100"
          width="3"
          height="112"
          rx="1.5"
          fill="#FFFDFA"
        />

        {/* Crumbs at the cut */}
        <g>
          <motion.circle variants={crumb(6, 14, 0)} cx="204" cy="204" r="2.6" fill="#7B532F" />
          <motion.circle variants={crumb(12, 10, 0.08)} cx="212" cy="208" r="2" fill="#9C6F43" />
          <motion.circle variants={crumb(-5, 12, 0.14)} cx="200" cy="200" r="1.7" fill="#5E3E23" />
          <motion.circle variants={crumb(9, 16, 0.2)} cx="220" cy="205" r="2.2" fill="#7B532F" />
        </g>

        {/* Sparkles */}
        <motion.path
          variants={sparkle(0.3)}
          d={STAR}
          fill="#D99A5B"
          style={{ x: 258, y: 118 }}
        />
        <motion.path
          variants={sparkle(0.5)}
          d={STAR}
          fill="#E8B888"
          style={{ x: 186, y: 82, scale: 0.7 }}
        />

        {/* Knife — enters from above, plunges at the cut line, exits. */}
        <g transform="translate(196, 88)">
          <motion.g variants={knife}>
            <rect x="-7" y="-96" width="14" height="36" rx="7" fill="#452D19" />
            <circle cx="0" cy="-88" r="1.7" fill="#E8B888" />
            <circle cx="0" cy="-72" r="1.7" fill="#E8B888" />
            <rect x="-6" y="-60" width="12" height="6" rx="3" fill="#9C6F43" />
            <path
              d="M-5.5 -54 L5.5 -54 L3.8 4 Q0 12 -2.6 4 Z"
              fill="#FFFDFA"
              stroke="#D6B896"
              strokeWidth="1"
            />
          </motion.g>
        </g>
      </svg>
    </motion.div>
  );
}
