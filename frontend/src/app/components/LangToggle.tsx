'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { SITE_LANGUAGES, SITE_LANG_COOKIE, type SiteLang } from '@/lib/site-i18n';
import { useSiteLang } from './LocaleProvider';

/**
 * Writes the language cookie and refreshes the route, so Server Components
 * re-render in the new language without a full page reload.
 */
export default function LangToggle() {
  const { lang } = useSiteLang();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(next: SiteLang) {
    if (next === lang) return;
    // One year, site-wide.
    document.cookie = `${SITE_LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div
      role="group"
      aria-label="Sprache / Language"
      className={`flex items-center gap-0.5 rounded-full border border-cream-300/80 bg-cream-100/70 p-1 transition-opacity ${
        pending ? 'opacity-60' : ''
      }`}
    >
      {SITE_LANGUAGES.map((option) => {
        const active = option.code === lang;
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => choose(option.code)}
            aria-pressed={active}
            className={`relative rounded-full px-2.5 py-1 text-xs font-medium transition-colors duration-300 ${
              active ? 'text-cream-50' : 'text-muted hover:text-primary'
            }`}
          >
            {active && (
              <motion.span
                layoutId="site-lang-pill"
                className="absolute inset-0 -z-10 rounded-full bg-chocolate-gradient"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
