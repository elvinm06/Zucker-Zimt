'use client';

import { allergenMeta } from '@/lib/allergens';
import { AllergenIcon } from './icons';
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

  return (
    <span
      title={t.containsAllergen(label)}
      className={`inline-flex items-center gap-1.5 rounded-full border border-caramel-400/35 bg-caramel-300/15 font-medium text-chocolate-600 ${
        size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3.5 py-1.5 text-sm'
      }`}
    >
      <AllergenIcon
        allergen={allergen}
        className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'}
      />
      {label}
    </span>
  );
}
