'use client';

import { motion, type Variants } from 'framer-motion';
import { Cake, ChefHat, Leaf, MessageCircle } from './icons';
import { useSiteLang } from './LocaleProvider';
import Reveal, { EASE } from './motion/Reveal';
import SplitText from './motion/SplitText';

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

/** The four promises, laid out as a numbered editorial grid. */
export default function FeatureStrip() {
  const { t } = useSiteLang();

  const values = [
    { Icon: ChefHat, title: t.featureCraftTitle, text: t.featureCraftText },
    { Icon: Leaf, title: t.featureNaturalTitle, text: t.featureNaturalText },
    { Icon: MessageCircle, title: t.featureChatTitle, text: t.featureChatText },
    { Icon: Cake, title: t.featureCustomTitle, text: t.featureCustomText },
  ];

  return (
    <section className="wrap py-20 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Reveal direction="none">
            <span className="eyebrow">{t.valuesEyebrow}</span>
          </Reveal>
          <h2 className="mt-6 text-display-md font-medium text-primary">
            <SplitText text={t.valuesTitle} />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-sm text-pretty leading-relaxed text-muted">
              {t.valuesLead}
            </p>
          </Reveal>
        </div>

        {/* 1px gaps over a hairline background draw the grid lines. */}
        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:col-span-8"
        >
          {values.map(({ Icon, title, text }, i) => (
            <motion.li
              key={title}
              variants={item}
              className="group relative bg-surface p-7 sm:p-8"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-line text-primary transition-[background-color,color,border-color] duration-500 ease-expo group-hover:border-primary group-hover:bg-primary group-hover:text-cream-100">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="label-mono">0{i + 1}</span>
              </div>
              <h3 className="mt-8 font-display text-2xl text-primary">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>

              {/* Underline grows from the left on hover. */}
              <span
                aria-hidden
                className="absolute bottom-0 left-0 h-0.5 w-0 bg-accent transition-[width] duration-700 ease-expo group-hover:w-full"
              />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
