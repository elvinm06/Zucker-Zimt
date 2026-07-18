/**
 * Public site translations.
 *
 * As with the admin dictionary, the English one is typed against the German
 * one, so a missing key fails the build instead of rendering blank.
 *
 * Product names, descriptions and ingredients are NOT translated — they are
 * data entered in the admin panel, not interface copy.
 */
export type SiteLang = 'de' | 'en';

export const SITE_LANG_COOKIE = 'bakery_lang';

const de = {
  // --- Header ---
  konditorei: 'Konditorei',
  navCakes: 'Torten',
  navHow: 'So geht’s',
  navContact: 'Kontakt',
  orderNow: 'Jetzt bestellen',

  // --- Hero ---
  heroEyebrow: 'Handgemacht · Natürliche Zutaten',
  heroSubline: 'feine Torten aus der Backstube',
  heroLead:
    'Keine Anmeldung, kein Warenkorb — Sie wählen Ihre Torte und schreiben uns direkt per WhatsApp oder Telegram.',
  heroCtaCatalog: 'Torten entdecken',
  heroCtaAdvice: 'Beratung per WhatsApp',
  statCustomers: 'glückliche Kunden',
  statHomemade: 'hausgemacht',
  statLeadTime: 'Vorlaufzeit',
  statLeadTimeValue: ' Std',
  heroBadgeTitle: 'Täglich frisch gebacken',
  heroBadgeText: 'Ohne Konservierungsstoffe, nach Familienrezept.',
  scrollHint: '↓ scrollen',

  // --- Features ---
  featureCraftTitle: 'Handarbeit',
  featureCraftText:
    'Jede Torte wird einzeln von Hand gefertigt — keine Fertigmischungen.',
  featureNaturalTitle: 'Natürliche Zutaten',
  featureNaturalText:
    'Butter, Eier und Sahne aus der Region, ohne Konservierungsstoffe.',
  featureChatTitle: 'Bestellung per Chat',
  featureChatText: 'Kein Konto, kein Warenkorb — eine Nachricht genügt.',
  featureCustomTitle: 'Nach Wunsch',
  featureCustomText:
    'Motive, Größe und Schrift stimmen wir persönlich mit Ihnen ab.',

  // --- Catalogue ---
  catalogEyebrow: 'Unser Sortiment',
  catalogTitle: 'Torten aus unserer Backstube',
  catalogLead:
    'Wählen Sie Ihre Lieblingstorte, prüfen Sie Zutaten und Allergene und schreiben Sie uns direkt — ganz ohne Anmeldung.',
  catalogEmptyTitle: 'Noch keine Torten im Katalog',
  catalogEmptyText:
    'Wir stellen gerade unser Sortiment zusammen — schauen Sie bald wieder vorbei.',
  catalogDownTitle: 'Der Katalog ist gerade nicht erreichbar',
  catalogDownText:
    'Bitte versuchen Sie es in Kürze noch einmal oder schreiben Sie uns direkt per WhatsApp.',
  cardCta: 'Zur Torte →',
  moreAllergens: (n: number) => `+${n} weitere`,

  // --- How it works ---
  howEyebrow: 'In drei Schritten',
  howTitle: 'So einfach bestellen Sie',
  step1Title: 'Torte aussuchen',
  step1Text:
    'Stöbern Sie im Katalog und öffnen Sie die Torte, die Ihnen gefällt.',
  step2Title: 'Details prüfen',
  step2Text: 'Zutaten und Allergene sind bei jeder Torte klar gekennzeichnet.',
  step3Title: 'Per Chat bestellen',
  step3Text:
    'Ein Klick auf WhatsApp oder Telegram — die Nachricht ist vorbereitet.',

  // --- Contact CTA ---
  ctaEyebrow: 'Individuelle Wünsche',
  ctaTitle: 'Sie haben eine besondere Feier geplant?',
  ctaText:
    'Hochzeit, Geburtstag oder Firmenfeier — schreiben Sie uns Ihre Idee, und wir backen sie. Beratung ist selbstverständlich kostenlos.',
  ctaWhatsapp: 'WhatsApp schreiben',

  // --- Footer ---
  footerDescription:
    'Feine Torten aus natürlichen Zutaten, täglich frisch gebacken. Bestellen Sie bequem per WhatsApp oder Telegram.',
  footerRange: 'Sortiment',
  footerAllCakes: 'Alle Torten',
  footerHowToOrder: 'So bestellen Sie',
  footerCustom: 'Sonderanfertigung',
  footerContact: 'Kontakt',
  footerFollow: 'Folgen Sie uns',
  footerRights: 'Alle Rechte vorbehalten.',

  // --- Product page ---
  breadcrumbHome: 'Startseite',
  breadcrumbCakes: 'Torten',
  productEyebrow: 'Hausgemacht',
  ingredients: 'Zutaten',
  allergens: 'Allergene',
  allergenNote:
    'Alle Torten entstehen in einer Backstube, in der auch Gluten, Nüsse und Milch verarbeitet werden. Spuren sind daher nicht auszuschließen.',
  orderTitle: 'Diese Torte bestellen',
  orderText:
    'Kein Warenkorb, keine Anmeldung — Ihre Nachricht ist bereits vorbereitet, Sie müssen sie nur noch abschicken.',
  orderWhatsapp: 'Per WhatsApp bestellen',
  orderTelegram: 'Per Telegram bestellen',
  messagePreview: (message: string) => `Ihre Nachricht lautet: „${message}"`,
  backToOverview: '← Zurück zur Übersicht',
  relatedEyebrow: 'Passt auch dazu',
  relatedTitle: 'Weitere Torten',
  imageLabel: (name: string, index: number) => `${name} — Bild ${index}`,
  containsAllergen: (label: string) => `Enthält ${label}`,

  // --- 404 ---
  notFoundTitle: 'Diese Seite gibt es leider nicht',
  notFoundText:
    'Vielleicht wurde die Torte aus dem Sortiment genommen oder die Adresse hat sich geändert. Schauen Sie sich in Ruhe im Katalog um.',
  notFoundCta: 'Zum Katalog',

  // --- Order message sent to WhatsApp / Telegram ---
  orderMessage: (brand: string, product: string) =>
    `Hallo ${brand}! Ich interessiere mich für „${product}" und möchte gerne bestellen.`,
};

type Dictionary = typeof de;

const en: Dictionary = {
  konditorei: 'Patisserie',
  navCakes: 'Cakes',
  navHow: 'How it works',
  navContact: 'Contact',
  orderNow: 'Order now',

  heroEyebrow: 'Handmade · Natural ingredients',
  heroSubline: 'fine cakes from our bakery',
  heroLead:
    'No sign-up, no shopping cart — pick your cake and message us directly on WhatsApp or Telegram.',
  heroCtaCatalog: 'Explore our cakes',
  heroCtaAdvice: 'Ask us on WhatsApp',
  statCustomers: 'happy customers',
  statHomemade: 'homemade',
  statLeadTime: 'lead time',
  statLeadTimeValue: ' hrs',
  heroBadgeTitle: 'Baked fresh every day',
  heroBadgeText: 'No preservatives, made to a family recipe.',
  scrollHint: '↓ scroll',

  featureCraftTitle: 'Handmade',
  featureCraftText:
    'Every cake is made individually by hand — never from a ready mix.',
  featureNaturalTitle: 'Natural ingredients',
  featureNaturalText:
    'Regional butter, eggs and cream, without preservatives.',
  featureChatTitle: 'Order by chat',
  featureChatText: 'No account, no cart — a single message is enough.',
  featureCustomTitle: 'Made to order',
  featureCustomText:
    'We agree the design, size and lettering with you personally.',

  catalogEyebrow: 'Our selection',
  catalogTitle: 'Cakes from our bakery',
  catalogLead:
    'Choose your favourite, check the ingredients and allergens, and message us directly — no sign-up needed.',
  catalogEmptyTitle: 'No cakes in the catalogue yet',
  catalogEmptyText:
    'We are putting our selection together — please check back soon.',
  catalogDownTitle: 'The catalogue is currently unavailable',
  catalogDownText:
    'Please try again shortly, or message us directly on WhatsApp.',
  cardCta: 'View cake →',
  moreAllergens: (n: number) => `+${n} more`,

  howEyebrow: 'In three steps',
  howTitle: 'Ordering is simple',
  step1Title: 'Choose a cake',
  step1Text: 'Browse the catalogue and open the cake you like.',
  step2Title: 'Check the details',
  step2Text: 'Ingredients and allergens are clearly listed for every cake.',
  step3Title: 'Order by chat',
  step3Text:
    'One click on WhatsApp or Telegram — your message is already written.',

  ctaEyebrow: 'Custom orders',
  ctaTitle: 'Planning a special celebration?',
  ctaText:
    'Wedding, birthday or company party — tell us your idea and we will bake it. Advice is free, of course.',
  ctaWhatsapp: 'Message on WhatsApp',

  footerDescription:
    'Fine cakes from natural ingredients, baked fresh every day. Order conveniently via WhatsApp or Telegram.',
  footerRange: 'Selection',
  footerAllCakes: 'All cakes',
  footerHowToOrder: 'How to order',
  footerCustom: 'Custom orders',
  footerContact: 'Contact',
  footerFollow: 'Follow us',
  footerRights: 'All rights reserved.',

  breadcrumbHome: 'Home',
  breadcrumbCakes: 'Cakes',
  productEyebrow: 'Homemade',
  ingredients: 'Ingredients',
  allergens: 'Allergens',
  allergenNote:
    'All cakes are made in a bakery that also handles gluten, nuts and milk, so traces cannot be ruled out.',
  orderTitle: 'Order this cake',
  orderText:
    'No cart, no sign-up — your message is already prepared, you only need to send it.',
  orderWhatsapp: 'Order via WhatsApp',
  orderTelegram: 'Order via Telegram',
  messagePreview: (message: string) => `Your message reads: “${message}”`,
  backToOverview: '← Back to all cakes',
  relatedEyebrow: 'You might also like',
  relatedTitle: 'More cakes',
  imageLabel: (name: string, index: number) => `${name} — image ${index}`,
  containsAllergen: (label: string) => `Contains ${label}`,

  notFoundTitle: 'This page does not exist',
  notFoundText:
    'The cake may have been taken off the menu, or the address has changed. Have a look around the catalogue.',
  notFoundCta: 'To the catalogue',

  orderMessage: (brand: string, product: string) =>
    `Hello ${brand}! I am interested in “${product}” and would like to order.`,
};

export const SITE_DICTIONARIES: Record<SiteLang, Dictionary> = { de, en };

export const SITE_LANGUAGES: { code: SiteLang; label: string }[] = [
  { code: 'de', label: 'DE' },
  { code: 'en', label: 'EN' },
];

export const isSiteLang = (value: unknown): value is SiteLang =>
  value === 'de' || value === 'en';
