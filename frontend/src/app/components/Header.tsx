'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import { lockScroll, scrollToTarget } from '@/lib/scroll';
import { WhatsAppIcon } from './BrandIcons';
import { Close } from './icons';
import LangToggle from './LangToggle';
import Logo from './Logo';
import { useSiteLang } from './LocaleProvider';
import { useSettings } from './SettingsProvider';
import Magnetic from './motion/Magnetic';
import { EASE } from './motion/Reveal';

// Absolute hrefs so the links also work from a product detail page —
// a bare "#katalog" would look for the anchor on the current page.
const NAV = [
  { hash: '#katalog', key: 'navCakes' },
  { hash: '#ablauf', key: 'navHow' },
  { hash: '#kontakt', key: 'navContact' },
] as const;

export default function Header() {
  const settings = useSettings();
  const { t } = useSiteLang();
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 24);
    // Hide when scrolling down past the hero, reveal on any upward scroll.
    // Keep the bar pinned while the mobile menu is open.
    setHidden(!menuOpen && latest > previous && latest > 320);
  });

  // The overlay menu freezes the page behind it and closes on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  /**
   * On the home page the sections are right here — glide to them instead
   * of navigating. Elsewhere the link works as a normal route change.
   */
  function handleAnchor(e: React.MouseEvent<HTMLAnchorElement>, hash: string) {
    if (menuOpen) {
      setMenuOpen(false);
      // Unlock synchronously: a stopped Lenis would ignore the scroll below.
      lockScroll(false);
    }
    if (pathname !== '/') return;
    e.preventDefault();
    scrollToTarget(hash, { offset: -80 });
    window.history.replaceState(null, '', hash);
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden && !prefersReduced ? -120 : 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="sticky top-0 z-40"
      >
        <div
          className={`transition-[padding] duration-500 ease-expo ${
            scrolled ? 'px-3 pt-3 sm:px-5' : 'px-0 pt-0'
          }`}
        >
          <div
            className={`mx-auto flex items-center justify-between gap-6 border transition-[background-color,box-shadow,border-color,padding,max-width] duration-500 ease-expo ${
              scrolled
                ? 'max-w-[76rem] rounded-full border-line bg-cream-50/80 py-2 pl-4 pr-2 shadow-soft backdrop-blur-xl sm:pl-5 sm:pr-3'
                : 'max-w-[80rem] rounded-none border-transparent bg-transparent px-5 py-4 sm:px-8 lg:px-10'
            }`}
          >
            <Link href="/" aria-label={settings.name} className="shrink-0">
              <Logo size={scrolled ? 'sm' : 'md'} showSub={!scrolled} />
            </Link>

            <nav
              aria-label={t.menuLabel}
              className="hidden items-center gap-1 md:flex"
              onPointerLeave={() => setHoveredNav(null)}
            >
              {NAV.map((item) => (
                <Link
                  key={item.hash}
                  href={`/${item.hash}`}
                  onClick={(e) => handleAnchor(e, item.hash)}
                  onPointerEnter={() => setHoveredNav(item.hash)}
                  className="relative rounded-full px-4 py-2 text-sm text-chocolate-600 transition-colors duration-300 hover:text-primary"
                >
                  {/* A single pill slides between items instead of one per link. */}
                  {hoveredNav === item.hash && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-cream-200/90"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {t[item.key]}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <LangToggle />
              <Magnetic strength={0.2}>
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary hidden px-5 py-2.5 text-sm sm:inline-flex"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  {t.orderNow}
                </a>
              </Magnetic>

              {/* Hamburger — only below md, where the inline nav is hidden. */}
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={t.menuOpen}
                className="btn-icon md:hidden"
              >
                <span className="relative block h-3 w-5" aria-hidden>
                  <span className="absolute left-0 top-0 block h-px w-5 bg-current" />
                  <span className="absolute left-0 top-1/2 block h-px w-3.5 -translate-y-1/2 bg-current" />
                  <span className="absolute bottom-0 left-0 block h-px w-5 bg-current" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Full-screen menu — rendered outside the header so the transformed
          header never becomes its containing block. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu"
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t.menuLabel}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{
              duration: prefersReduced ? 0 : 0.7,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="fixed inset-0 z-50 flex flex-col bg-espresso text-cream-100 md:hidden"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <Logo tone="light" />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label={t.menuClose}
                className="btn-icon border-cream-200/20 bg-transparent text-cream-100 hover:border-cream-100/60 hover:bg-cream-50/10"
              >
                <Close className="h-5 w-5" />
              </button>
            </div>

            <nav
              aria-label={t.menuLabel}
              className="flex flex-1 flex-col justify-center px-6"
            >
              {NAV.map((item, i) => (
                <motion.div
                  key={item.hash}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.07, duration: 0.7, ease: EASE }}
                  className="border-b border-cream-200/10"
                >
                  <Link
                    href={`/${item.hash}`}
                    onClick={(e) => handleAnchor(e, item.hash)}
                    className="flex items-center justify-between py-5 font-display text-4xl text-cream-100"
                  >
                    <span>{t[item.key]}</span>
                    <span className="label-mono text-cream-300/60">0{i + 1}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="space-y-5 px-6 pb-8"
            >
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="btn-light w-full"
              >
                <WhatsAppIcon className="h-5 w-5" />
                {t.orderNow}
              </a>
              <div className="flex items-center justify-between gap-4 text-sm text-cream-300/70">
                <span>{settings.hours}</span>
                <LangToggle tone="light" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
