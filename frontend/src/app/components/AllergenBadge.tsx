'use client';

import { allergenMeta } from '@/lib/allergens';
import { useSiteLang } from './LocaleProvider';

export default function AllergenBadge({
  allergen,
  size = 'md',
}: {
  allergen: string;
  size?: 'sm' | 'md';
}) {
  const { lang, t } = useSiteLang();
  const meta = allergenMeta(allergen);
  const label = lang === 'en' ? meta.labelEn : meta.label;
  const icon = meta.icon;

  return (
    <span
      title={t.containsAllergen(label)}
      className={`inline-flex items-center gap-1.5 rounded-full bg-caramel-300/20 font-medium text-chocolate-600 ring-1 ring-inset ring-caramel-400/35 ${
        size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3.5 py-1.5 text-sm'
      }`}
    >
      <span aria-hidden>{icon}</span>
      {label}
    </span>
  );
}
