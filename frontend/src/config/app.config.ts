/**
 * The single source of truth for branding and contact details.
 *
 * Usage:
 *   import { appConfig, buildWhatsAppLink } from '@/config/app.config';
 *   <h1>{appConfig.name}</h1>
 *   <a href={buildWhatsAppLink('Schokoladentorte')}>Bestellen</a>
 *
 * Values come from `.env.local`; the defaults below keep the app running
 * without any configuration. The NEXT_PUBLIC_ prefix is mandatory —
 * only those variables are exposed to the browser.
 */
export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? 'Zucker & Zimt',
  tagline:
    process.env.NEXT_PUBLIC_APP_TAGLINE ??
    'Handgemachte Torten — jeder Bissen ein kleines Fest',
  description:
    'Feine Torten aus natürlichen Zutaten, täglich frisch gebacken. Bestellen Sie bequem per WhatsApp oder Telegram.',
  /** ISO 4217 code — drives both the symbol and the number formatting. */
  currency: process.env.NEXT_PUBLIC_CURRENCY ?? 'EUR',
  locale: process.env.NEXT_PUBLIC_LOCALE ?? 'de-DE',

  contact: {
    /** International format, without "+" or spaces: 4915112345678 */
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '4915112345678',
    telegram: process.env.NEXT_PUBLIC_TELEGRAM_USERNAME ?? 'zuckerundzimt',
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '+49 151 1234 5678',
    instagram:
      process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
      'https://instagram.com/zuckerundzimt',
    address:
      process.env.NEXT_PUBLIC_ADDRESS ?? 'Bäckerstraße 12, 10115 Berlin',
    hours: process.env.NEXT_PUBLIC_OPENING_HOURS ?? 'Mo–Sa, 09:00 – 19:00 Uhr',
  },

  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api',
  },
} as const;

/**
 * Formats a price for display: 34.9 -> "34,90 €" in de-DE.
 * Always use this instead of interpolating the raw number, so decimals and
 * the symbol position stay correct in every locale.
 */
export const formatPrice = (value: number) =>
  new Intl.NumberFormat(appConfig.locale, {
    style: 'currency',
    currency: appConfig.currency,
  }).format(value);

import { SITE_DICTIONARIES, type SiteLang } from '@/lib/site-i18n';

/**
 * Link builders take the live settings (editable in the admin panel) and the
 * visitor's language, so the prepared chat message is written in the language
 * they were browsing in.
 */
export const orderMessageTemplate = (
  settings: { name: string },
  productName: string,
  lang: SiteLang = 'de',
) => SITE_DICTIONARIES[lang].orderMessage(settings.name, productName);

export const buildWhatsAppLink = (
  settings: { name: string; whatsapp: string },
  productName: string,
  lang: SiteLang = 'de',
) =>
  `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
    orderMessageTemplate(settings, productName, lang),
  )}`;

export const buildTelegramLink = (
  settings: { name: string; telegram: string },
  productName: string,
  lang: SiteLang = 'de',
) =>
  `https://t.me/${settings.telegram}?text=${encodeURIComponent(
    orderMessageTemplate(settings, productName, lang),
  )}`;
