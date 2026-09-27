'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import { useSiteLang } from './LocaleProvider';
import { useSettings } from './SettingsProvider';
import LogoMark from './LogoMark';

/**
 * Full lockup: mark + wordmark + "KONDITOREI" rule.
 * The wordmark is HTML rather than SVG text so it uses the loaded display
 * face and follows the name set in the admin panel. `tone` flips it for
 * dark surfaces (menu overlay, footer).
 */
export default function Logo({
  size = 'md',
  showSub = true,
  tone = 'dark',
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  showSub?: boolean;
  tone?: 'dark' | 'light';
  className?: string;
}) {
  const settings = useSettings();
  const { t } = useSiteLang();
  const prefersReduced = useReducedMotion();

  const dimensions = {
    sm: { mark: 'h-9 w-9', name: 'text-lg', sub: 'text-[9px]' },
    md: { mark: 'h-11 w-11', name: 'text-xl', sub: 'text-[10px]' },
    lg: { mark: 'h-16 w-16', name: 'text-3xl', sub: 'text-[11px]' },
  }[size];

  const colors =
    tone === 'light'
      ? { mark: 'text-caramel-300', name: 'text-cream-100', sub: 'text-cream-300/70' }
      : { mark: 'text-chocolate-500', name: 'text-primary', sub: 'text-muted' };

  return (
    <span className={`flex items-center gap-3 ${className ?? ''}`}>
      <motion.span
        whileHover={prefersReduced ? undefined : { rotate: -8, scale: 1.06 }}
        transition={{ type: 'spring', stiffness: 320, damping: 16 }}
        className={`${dimensions.mark} shrink-0 ${colors.mark}`}
      >
        <LogoMark className="h-full w-full" />
      </motion.span>

      <span className="leading-tight">
        <span
          className={`block font-display font-medium tracking-tight ${colors.name} ${dimensions.name}`}
        >
          {settings.name}
        </span>
        {showSub && (
          <span
            className={`hidden items-center gap-2 uppercase tracking-[0.28em] sm:flex ${colors.sub} ${dimensions.sub}`}
          >
            {t.konditorei}
          </span>
        )}
      </span>
    </span>
  );
}
