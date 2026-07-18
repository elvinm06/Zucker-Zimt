'use client';

import { createContext, useContext } from 'react';
import { FALLBACK_SETTINGS } from '@/config/fallback-settings';
import type { SiteSettings } from '@/types/settings';

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
