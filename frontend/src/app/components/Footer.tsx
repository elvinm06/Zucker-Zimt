'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import { scrollToTarget } from '@/lib/scroll';
import { ArrowUp } from './icons';
import Logo from './Logo';
import { useSiteLang } from './LocaleProvider';
import { useSettings } from './SettingsProvider';
import { EASE } from './motion/Reveal';

export default function Footer() {
  const settings = useSettings();
  const { t } = useSiteLang();
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();

  /** Same-page anchors glide; from other pages they navigate normally. */
  function handleAnchor(e: React.MouseEvent<HTMLAnchorElement>, hash: string) {
    if (pathname !== '/') return;
    e.preventDefault();
    scrollToTarget(hash, { offset: -80 });
    window.history.replaceState(null, '', hash);
  }

  const range = [
    { hash: '#katalog', label: t.footerAllCakes },
    { hash: '#ablauf', label: t.footerHowToOrder },
    { hash: '#kontakt', label: t.footerCustom },
  ];

  const social = [
    { label: 'WhatsApp', href: `https://wa.me/${settings.whatsapp}` },
    { label: 'Telegram', href: `https://t.me/${settings.telegram}` },
    { label: 'Instagram', href: settings.instagram },
  ];

  return (
    <footer className="relative overflow-hidden bg-espresso text-cream-200">
      <div className="wrap">
        <div className="grid gap-12 border-t border-cream-200/10 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:py-20">
          <div className="sm:col-span-2 lg:col-span-5">
            <Logo size="sm" showSub={false} tone="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream-300/70">
              {t.footerDescription}
            </p>
          </div>

          <div className="lg:col-span-2">
            <h3 className="label-mono text-cream-300/60">{t.footerRange}</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {range.map((item) => (
                <li key={item.hash}>
                  <Link
                    href={`/${item.hash}`}
                    onClick={(e) => handleAnchor(e, item.hash)}
                    className="text-cream-100/85 transition-colors hover:text-caramel-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="label-mono text-cream-300/60">{t.footerContact}</h3>
            <ul className="mt-5 space-y-3 text-sm text-cream-100/85">
              <li>{settings.address}</li>
              <li>{settings.hours}</li>
              <li>
                <a
                  href={`tel:${settings.phone.replace(/\s/g, '')}`}
                  className="transition-colors hover:text-caramel-300"
                >
                  {settings.phone}
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="label-mono text-cream-300/60">{t.footerFollow}</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream-100/85 transition-colors hover:text-caramel-300"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-cream-200/10 py-6 text-xs text-cream-300/60 sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} {settings.name}. {t.footerRights}
          </span>
          <button
            type="button"
            onClick={() => scrollToTarget(0)}
            className="group inline-flex items-center gap-3 text-cream-100/85 transition-colors hover:text-caramel-300"
          >
            <span className="label-mono text-inherit">{t.backToTop}</span>
            <span className="grid h-9 w-9 place-items-center rounded-full border border-cream-200/15 transition-colors group-hover:border-caramel-300/60">
              <ArrowUp className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:-translate-y-0.5" />
            </span>
          </button>
        </div>
      </div>

      {/* Giant wordmark, sunk into the bottom edge — the sign-off. */}
      <motion.div
        aria-hidden
        initial={prefersReduced ? undefined : { y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, ease: EASE }}
        className="wrap select-none overflow-hidden pt-4"
      >
        <div className="translate-y-[0.22em] whitespace-nowrap font-display text-[clamp(4rem,16.5vw,17rem)] font-medium leading-[0.8] tracking-tight text-cream-100/[0.06]">
          {settings.name}
        </div>
      </motion.div>
    </footer>
  );
}
