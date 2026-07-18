/** Admin-side configuration; everything else lives in the database. */
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api',
  /** Public storefront — its cache is flushed after every change. */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  currency: process.env.NEXT_PUBLIC_CURRENCY ?? 'EUR',
  locale: process.env.NEXT_PUBLIC_LOCALE ?? 'de-DE',
};

/** 34.9 -> "34,90 €" */
export const formatPrice = (value: number) =>
  new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
  }).format(value);
