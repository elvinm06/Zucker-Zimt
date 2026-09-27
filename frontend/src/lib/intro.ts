'use client';

import { useEffect, useState } from 'react';

/**
 * Tells the hero when the intro curtain has lifted, so its entrance plays
 * in front of the visitor instead of behind the overlay.
 *
 * Pages without an intro (product detail) never touch the store, so the
 * default is "ready". The loader flips it to false in a layout effect —
 * before the hero's own effect subscribes — and back to true as the
 * curtain starts to rise.
 */
type Listener = (ready: boolean) => void;

let ready = true;
const listeners = new Set<Listener>();

export function setIntroReady(next: boolean) {
  ready = next;
  listeners.forEach((listener) => listener(next));
}

export function subscribeIntro(listener: Listener) {
  listeners.add(listener);
  listener(ready);
  return () => {
    listeners.delete(listener);
  };
}

export function useIntroReady() {
  // Starts false so the server HTML and the first client paint agree.
  const [state, setState] = useState(false);
  useEffect(() => subscribeIntro(setState), []);
  return state;
}
