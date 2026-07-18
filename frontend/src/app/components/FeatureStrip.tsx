'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useSiteLang } from './LocaleProvider';
import { EASE } from './motion/Reveal';



const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 46, rotateX: -12, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: EASE },
  },
};

export default function FeatureStrip() {
  const { t } = useSiteLang();
  const prefersReduced = useReducedMotion();

  const features = [
    { icon: '🧁', title: t.featureCraftTitle, text: t.featureCraftText },
    { icon: '🌿', title: t.featureNaturalTitle, text: t.featureNaturalText },
    { icon: '💬', title: t.featureChatTitle, text: t.featureChatText },
    { icon: '🎂', title: t.featureCustomTitle, text: t.featureCustomText },
  ];

  return (
    <section className="mx-auto -mt-10 max-w-6xl px-5">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        style={{ perspective: 1200 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {features.map((feature) => (
          <motion.article
            key={feature.title}
            variants={card}
            whileHover={prefersReduced ? undefined : { y: -8, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="card group p-6 transition-shadow duration-500 hover:shadow-lift"
          >
            <motion.span
              whileHover={
                prefersReduced ? undefined : { rotate: [0, -14, 12, 0], scale: 1.12 }
              }
              transition={{ duration: 0.7, ease: 'easeInOut' }}
              className="grid h-12 w-12 place-items-center rounded-2xl bg-cream-200 text-xl shadow-inset"
            >
              {feature.icon}
            </motion.span>
            <h3 className="mt-4 text-lg font-semibold text-primary">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {feature.text}
            </p>

            {/* Underline grows from the left on hover. */}
            <span className="mt-4 block h-px w-0 bg-gradient-to-r from-accent to-transparent transition-all duration-500 group-hover:w-full" />
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
