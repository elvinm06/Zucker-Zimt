import { SITE_DICTIONARIES, isSiteLang } from './site-i18n';
import type { SiteLang } from './site-i18n';

export const DEFAULT_LANG: SiteLang = 'de';

/**
 * Narrows the `[lang]` route segment to a supported language.
 *
 * The segment never shows up in the address bar: the middleware reads the
 * switcher's cookie and rewrites every request to `/<lang>/…` internally.
 * Keeping the language out of `cookies()` is what lets the pages be cached
 * as static HTML instead of being rendered on every request.
 */
export function toLocale(value: string | undefined): SiteLang {
  return isSiteLang(value) ? value : DEFAULT_LANG;
}

/** Dictionary for the given `[lang]` segment. */
export function getDictionary(lang: string | undefined) {
  return SITE_DICTIONARIES[toLocale(lang)];
}
