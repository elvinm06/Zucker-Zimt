'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

/**
 * Hydration-safe `prefers-reduced-motion`.
 *
 * Framer's own hook reads the media query during the first client render,
 * so a reduced-motion visitor hydrates markup that differs from the server
 * HTML (plain text instead of split words, the static marquee, …) and React
 * throws the whole tree away. This one answers `false` until hydration is
 * done, then re-renders with the real preference.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
