'use client';

import { motion } from 'framer-motion';
import { LANGUAGES } from '@/lib/admin-i18n';
import { useAdminLang } from './AdminLangProvider';

/** DE / EN segmented control with a sliding indicator. */
export default function LangSwitch() {
  const { lang, setLang, t } = useAdminLang();

  return (
    <div
      role="group"
      aria-label={t.language}
      className="flex items-center gap-0.5 rounded-full border border-cream-300/80 bg-cream-100/70 p-1"
    >
      {LANGUAGES.map((option) => {
        const active = option.code === lang;
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => setLang(option.code)}
            aria-pressed={active}
            className={`relative rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-300 ${
              active ? 'text-cream-50' : 'text-muted hover:text-primary'
            }`}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 -z-10 rounded-full bg-chocolate-gradient shadow-soft"
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
