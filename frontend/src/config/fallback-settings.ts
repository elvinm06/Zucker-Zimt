import { appConfig } from '@/config/app.config';
import type { SiteSettings } from '@/types/settings';

/**
 * Values used until the database answers. Kept out of SettingsProvider on
 * purpose: that file is a client module, and a server component may not read
 * properties off a client module's exports.
 */
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
