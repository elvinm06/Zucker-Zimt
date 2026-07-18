import { cookies } from 'next/headers';
import { SITE_LANG_COOKIE, SITE_DICTIONARIES, isSiteLang } from './site-i18n';
import type { SiteLang } from './site-i18n';

/**
 * Reads the visitor's language from the cookie set by the switcher.
 * Server Components use this; client components use `useSiteLang()`.
 */
export function getLocale(): SiteLang {
  const value = cookies().get(SITE_LANG_COOKIE)?.value;
  return isSiteLang(value) ? value : 'de';
}

/** Dictionary for the current request. */
export function getDictionary() {
  return SITE_DICTIONARIES[getLocale()];
}
