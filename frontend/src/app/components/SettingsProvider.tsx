'use client';

import { createContext, useContext } from 'react';
import { appConfig } from '@/config/app.config';
import type { SiteSettings } from '@/types/settings';

/** Values from the database; falls back to the compiled-in defaults. */
export const FALLBACK_SETTINGS: SiteSettings = {
  name: appConfig.name,
  tagline: appConfig.tagline,
  whatsapp: appConfig.contact.whatsapp,
  telegram: appConfig.contact.telegram,
  instagram: appConfig.contact.instagram,
  phone: appConfig.contact.phone,
  address: appConfig.contact.address,
  hours: appConfig.contact.hours,
};

const SettingsContext = createContext<SiteSettings>(FALLBACK_SETTINGS);

export function SettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

/** Client components read branding and contact details through this hook. */
export const useSettings = () => useContext(SettingsContext);
