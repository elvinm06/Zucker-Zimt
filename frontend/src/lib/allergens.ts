/**
 * Allergen catalogue — icon and labels per allergen key.
 * Keys are stored in the database; labels are display-only, so renaming
 * a label never breaks existing product records.
 *
 * `label` is German (the public site); `labelEn` is only used by the
 * bilingual admin panel.
 */
export interface AllergenMeta {
  key: string;
  label: string;
  labelEn: string;
  icon: string;
}

export const ALLERGENS: AllergenMeta[] = [
  { key: 'gluten', label: 'Gluten', labelEn: 'Gluten', icon: '🌾' },
  { key: 'lactose', label: 'Laktose', labelEn: 'Lactose', icon: '🥛' },
  { key: 'egg', label: 'Ei', labelEn: 'Egg', icon: '🥚' },
  { key: 'nuts', label: 'Schalenfrüchte', labelEn: 'Tree nuts', icon: '🌰' },
  { key: 'peanut', label: 'Erdnuss', labelEn: 'Peanut', icon: '🥜' },
  { key: 'soy', label: 'Soja', labelEn: 'Soy', icon: '🌱' },
  { key: 'sesame', label: 'Sesam', labelEn: 'Sesame', icon: '🫘' },
  { key: 'cocoa', label: 'Kakao', labelEn: 'Cocoa', icon: '🍫' },
  { key: 'honey', label: 'Honig', labelEn: 'Honey', icon: '🍯' },
  { key: 'alcohol', label: 'Alkohol', labelEn: 'Alcohol', icon: '🍷' },
];

const BY_KEY = new Map(ALLERGENS.map((a) => [a.key, a]));

/** Unknown keys are shown as-is so no data silently disappears. */
export const allergenMeta = (key: string): AllergenMeta =>
  BY_KEY.get(key) ?? { key, label: key, labelEn: key, icon: '⚠️' };

/** Frequently used ingredients — quick-pick chips in the admin form. */
export const COMMON_INGREDIENTS = [
  'Mehl',
  'Zucker',
  'Eier',
  'Butter',
  'Milch',
  'Sahne',
  'Zartbitterschokolade',
  'Weiße Schokolade',
  'Kakao',
  'Vanille',
  'Erdbeeren',
  'Himbeeren',
  'Banane',
  'Walnüsse',
  'Haselnüsse',
  'Mandelmehl',
  'Karamell',
  'Mascarpone',
  'Kaffee',
  'Zitrone',
];
