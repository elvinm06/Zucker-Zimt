'use client';

import { createContext, useContext } from 'react';
import { SITE_DICTIONARIES, type SiteLang } from '@/lib/site-i18n';

interface LocaleValue {
  lang: SiteLang;
  t: (typeof SITE_DICTIONARIES)['de'];
}

const LocaleContext = createContext<LocaleValue>({
  lang: 'de',
  t: SITE_DICTIONARIES.de,
});

/** Fed from the layout, which reads the language cookie on the server. */
export function LocaleProvider({
  lang,
  children,
}: {
  lang: SiteLang;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={{ lang, t: SITE_DICTIONARIES[lang] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useSiteLang = () => useContext(LocaleContext);
