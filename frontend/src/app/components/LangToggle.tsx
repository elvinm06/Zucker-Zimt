'use client';

import { useId, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { SITE_LANGUAGES, SITE_LANG_COOKIE, type SiteLang } from '@/lib/site-i18n';
import { useSiteLang } from './LocaleProvider';

/**
 * Writes the language cookie and refreshes the route, so Server Components
 * re-render in the new language without a full page reload.
 */
export default function LangToggle({
  tone = 'dark',
}: {
  tone?: 'dark' | 'light';
}) {
  const { lang } = useSiteLang();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  // The header and the menu overlay each render a toggle; the sliding pill
  // must not try to animate between the two.
  const id = useId();

  function choose(next: SiteLang) {
    if (next === lang) return;
    // One year, site-wide.
    document.cookie = `${SITE_LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  }

  const light = tone === 'light';

  return (
    <div
      role="group"
      aria-label="Sprache / Language"
      className={`flex items-center gap-0.5 rounded-full border p-1 transition-opacity ${
        light ? 'border-cream-200/20' : 'border-line bg-cream-50/60'
      } ${pending ? 'opacity-60' : ''}`}
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
              active
                ? light
                  ? 'text-espresso'
                  : 'text-cream-50'
                : light
                  ? 'text-cream-300/80 hover:text-cream-50'
                  : 'text-muted hover:text-primary'
            }`}
          >
            {active && (
              <motion.span
                layoutId={`lang-pill-${id}`}
                className={`absolute inset-0 -z-10 rounded-full ${
                  light ? 'bg-cream-100' : 'bg-primary'
                }`}
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
