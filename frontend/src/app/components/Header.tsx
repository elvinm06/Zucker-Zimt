'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion';
import LangToggle from './LangToggle';
import Logo from './Logo';
import { useSiteLang } from './LocaleProvider';
import { useSettings } from './SettingsProvider';
import Magnetic from './motion/Magnetic';
import { EASE } from './motion/Reveal';

// Absolute hrefs so the links also work from a product detail page —
// a bare "#katalog" would look for the anchor on the current page.
const NAV = [
  { href: '/#katalog', key: 'navCakes' },
  { href: '/#ablauf', key: 'navHow' },
  { href: '/#kontakt', key: 'navContact' },
] as const;

export default function Header() {
  const { whatsapp } = useSettings();
  const { t } = useSiteLang();
  const prefersReduced = useReducedMotion();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 20);
    // Hide when scrolling down past the hero, reveal on any upward scroll.
    setHidden(latest > previous && latest > 260);
  });

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{
        y: hidden && !prefersReduced ? -110 : 0,
        opacity: 1,
      }}
      transition={{ duration: 0.5, ease: EASE }}
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter,box-shadow] duration-500 ${
        scrolled
          ? 'border-cream-300/70 bg-cream-50/85 shadow-soft backdrop-blur-xl'
          : 'border-transparent bg-cream-50/40 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4">
        <Link href="/" className="group">
          <Logo />
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          onPointerLeave={() => setHoveredNav(null)}
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onPointerEnter={() => setHoveredNav(item.href)}
              className="relative rounded-full px-4 py-2 text-sm text-muted transition-colors duration-300 hover:text-primary"
            >
              {/* A single pill slides between items instead of one per link. */}
              {hoveredNav === item.href && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-cream-200/80"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {t[item.key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
        <LangToggle />
        <Magnetic strength={0.25}>
          <motion.a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="btn-primary px-5 py-2.5 text-sm"
          >
            {t.orderNow}
          </motion.a>
        </Magnetic>
        </div>
      </div>
    </motion.header>
  );
}
