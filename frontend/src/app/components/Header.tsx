'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AnimatePresence,
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
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 20);
    // Hide when scrolling down past the hero, reveal on any upward scroll.
    // Keep the bar pinned while the mobile menu is open.
    setHidden(!menuOpen && latest > previous && latest > 260);
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
            className="btn-primary hidden px-5 py-2.5 text-sm sm:inline-flex"
          >
            {t.orderNow}
          </motion.a>
        </Magnetic>

        {/* Hamburger — only below md, where the inline nav is hidden. */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? t.menuClose : t.menuOpen}
          className="grid h-10 w-10 place-items-center rounded-full border border-cream-300/70 bg-cream-50/70 text-primary transition-colors hover:bg-cream-200 md:hidden"
        >
          <span className="relative block h-4 w-5" aria-hidden>
            <span
              className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${
                menuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 bg-current transition-opacity duration-300 ${
                menuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${
                menuOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0'
              }`}
            />
          </span>
        </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.3, ease: EASE }}
            className="overflow-hidden border-t border-cream-300/70 bg-cream-50/95 backdrop-blur-xl md:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-base text-primary transition-colors hover:bg-cream-200"
                >
                  {t[item.key]}
                </Link>
              ))}
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="btn-primary mt-2 w-full"
              >
                {t.orderNow}
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
