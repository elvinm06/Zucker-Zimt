import type Lenis from 'lenis';

/**
 * One place that knows whether Lenis is running.
 *
 * Lenis is created in the layout (SmoothScroll) but the intro overlay, the
 * search box and the nav all need to scroll or lock the page — and some of
 * them run their effects before Lenis exists. So the lock state lives here
 * and is applied to the instance whenever it shows up.
 */
let instance: Lenis | null = null;
let locked = false;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
  if (lenis && locked) lenis.stop();
}

export const getLenis = () => instance;

/** Freezes the page (intro, mobile menu) — Lenis and the native scroll. */
export function lockScroll(next: boolean) {
  locked = next;
  if (instance) {
    if (next) instance.stop();
    else instance.start();
  }
  document.documentElement.style.overflow = next ? 'hidden' : '';
}

/**
 * Glides to a target through Lenis, or natively where Lenis is off
 * (touch devices, reduced motion). `immediate` jumps without easing.
 */
export function scrollToTarget(
  target: string | number | HTMLElement,
  options: { immediate?: boolean; offset?: number } = {},
) {
  const { immediate = false, offset = 0 } = options;

  if (instance) {
    instance.scrollTo(target, {
      offset,
      immediate,
      // A stopped Lenis ignores scrollTo unless forced — needed for the
      // jump-to-top behind the intro curtain.
      force: immediate,
    });
    return;
  }

  const behavior: ScrollBehavior = immediate ? 'auto' : 'smooth';
  if (typeof target === 'number') {
    window.scrollTo({ top: target + offset, behavior });
    return;
  }

  const element =
    typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return;
  const top = element.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior });
}
