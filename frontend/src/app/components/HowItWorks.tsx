'use client';

import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion';
import { useSiteLang } from './LocaleProvider';
import Reveal, { EASE } from './motion/Reveal';
import SplitText from './motion/SplitText';



const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16 } },
};

const stepCard: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.94, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE },
  },
};

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useSiteLang();
  const prefersReduced = useReducedMotion();

  const steps = [
    { step: '01', title: t.step1Title, text: t.step1Text },
    { step: '02', title: t.step2Title, text: t.step2Text },
    { step: '03', title: t.step3Title, text: t.step3Text },
  ];

  // The connecting line draws itself as the section scrolls through.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'center 0.5'],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} id="ablauf" className="mx-auto max-w-6xl px-5 py-20">
      <div className="mb-12 text-center">
        <Reveal direction="none">
          <span className="eyebrow">{t.howEyebrow}</span>
        </Reveal>
        <h2 className="mt-5 text-3xl font-semibold text-primary sm:text-4xl">
          <SplitText text={t.howTitle} />
        </h2>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="relative grid gap-6 md:grid-cols-3"
      >
        <motion.div
          aria-hidden
          style={prefersReduced ? undefined : { scaleX: lineScale }}
          className="absolute left-0 right-0 top-16 hidden h-px origin-left bg-gradient-to-r from-transparent via-caramel-400 to-transparent md:block"
        />

        {steps.map((item) => (
          <motion.div
            key={item.step}
            variants={stepCard}
            whileHover={prefersReduced ? undefined : { y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="card group relative p-7 text-center"
          >
            <motion.span
              whileHover={prefersReduced ? undefined : { scale: 1.1, rotate: -6 }}
              transition={{ type: 'spring', stiffness: 320, damping: 16 }}
              className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-chocolate-gradient font-display text-lg text-cream-100 shadow-soft"
            >
              {item.step}
            </motion.span>
            <h3 className="mt-5 text-lg font-semibold text-primary">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {item.text}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
