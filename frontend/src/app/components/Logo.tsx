'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useSiteLang } from './LocaleProvider';
import { useSettings } from './SettingsProvider';
import LogoMark from './LogoMark';

/**
 * Full lockup: mark + wordmark + "KONDITOREI" rule.
 * The wordmark is HTML rather than SVG text so it uses the loaded Playfair
 * Display and follows the name set in the admin panel.
 */
export default function Logo({
  size = 'md',
  showSub = true,
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  showSub?: boolean;
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

  return (
    <span className={`flex items-center gap-3 ${className ?? ''}`}>
      <motion.span
        whileHover={prefersReduced ? undefined : { rotate: -8, scale: 1.06 }}
        transition={{ type: 'spring', stiffness: 320, damping: 16 }}
        className={`${dimensions.mark} shrink-0 text-chocolate-500`}
      >
        <LogoMark className="h-full w-full" />
      </motion.span>

      <span className="leading-tight">
        <span
          className={`block font-display font-semibold tracking-tight text-primary ${dimensions.name}`}
        >
          {settings.name}
        </span>
        {showSub && (
          <span
            className={`hidden items-center gap-2 uppercase tracking-[0.28em] text-muted sm:flex ${dimensions.sub}`}
          >
            {t.konditorei}
          </span>
        )}
      </span>
    </span>
  );
}
