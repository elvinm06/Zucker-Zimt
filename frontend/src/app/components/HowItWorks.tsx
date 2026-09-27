'use client';

import { useRef } from 'react';
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import type { IconProps } from './icons';
import { Check, MessageCircle, Search } from './icons';
import { useSiteLang } from './LocaleProvider';
import CakeCutScene from './motion/CakeCutScene';
import Reveal, { EASE } from './motion/Reveal';
import SplitText from './motion/SplitText';

function Step({
  index,
  title,
  text,
  Icon,
}: {
  index: number;
  title: string;
  text: string;
  Icon: (props: IconProps) => JSX.Element;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // The step in the middle band of the viewport is the "current" one.
  const active = useInView(ref, { margin: '-45% 0px -45% 0px' });

  return (
    <li
      ref={ref}
      className="grid grid-cols-[3rem_1fr] gap-5 border-b border-line py-9 last:border-b-0 sm:gap-8 sm:py-12"
    >
      <motion.span
        animate={{
          backgroundColor: active ? '#452D19' : 'rgba(251,246,239,1)',
          color: active ? '#FBF6EF' : '#452D19',
          borderColor: active ? '#452D19' : 'rgba(69,45,25,0.2)',
          scale: active ? 1.06 : 1,
        }}
        transition={{ duration: 0.5, ease: EASE }}
        className="relative z-10 grid h-12 w-12 place-items-center rounded-full border font-display text-lg"
      >
        0{index}
      </motion.span>

      <Reveal className="min-w-0">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-caramel-300/20 text-accent">
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="mt-4 font-display text-2xl text-primary sm:text-3xl">
          {title}
        </h3>
        <p className="mt-3 max-w-md text-pretty leading-relaxed text-muted">
          {text}
        </p>
      </Reveal>
    </li>
  );
}

export default function HowItWorks() {
  const listRef = useRef<HTMLOListElement>(null);
  const { t } = useSiteLang();
  const prefersReduced = useReducedMotion();

  const steps = [
    { Icon: Search, title: t.step1Title, text: t.step1Text },
    { Icon: Check, title: t.step2Title, text: t.step2Text },
    { Icon: MessageCircle, title: t.step3Title, text: t.step3Text },
  ];

  // The connecting line draws itself as the list scrolls through.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 0.8', 'end 0.55'],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="ablauf" className="wrap py-20 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal direction="none">
              <span className="eyebrow">{t.howEyebrow}</span>
            </Reveal>
            <h2 className="mt-6 text-display-md font-medium text-primary">
              <SplitText text={t.howTitle} />
            </h2>
            <Reveal delay={0.2}>
              <p className="mt-5 max-w-sm text-pretty leading-relaxed text-muted">
                {t.howLead}
              </p>
            </Reveal>
            {/* Signature moment: the cake gets cut when it scrolls in. */}
            <CakeCutScene className="mt-10 w-60 sm:w-72" />
          </div>
        </div>

        <ol ref={listRef} className="relative lg:col-span-7">
          {/* Track + the progress line running through the numerals. */}
          <span
            aria-hidden
            className="absolute bottom-12 left-6 top-12 w-px bg-line"
          />
          <motion.span
            aria-hidden
            style={prefersReduced ? undefined : { scaleY: lineScale }}
            className="absolute bottom-12 left-6 top-12 w-px origin-top bg-accent"
          />

          {steps.map((step, i) => (
            <Step key={step.title} index={i + 1} {...step} />
          ))}
        </ol>
      </div>
    </section>
  );
}
