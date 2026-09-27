'use client';

import { filterProducts } from '@/lib/catalog';
import type { Product } from '@/types/product';
import CakeSearch from './CakeSearch';
import { useSiteLang } from './LocaleProvider';
import { useSearch } from './SearchProvider';

/** Search box plus a live result count, above the grid. */
export default function CatalogToolbar({ products }: { products: Product[] }) {
  const { t } = useSiteLang();
  const { query } = useSearch();
  const count = filterProducts(products, query).length;

  return (
    <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
      <CakeSearch className="sm:max-w-sm" />
      <span className="label-mono shrink-0" aria-live="polite">
        {t.catalogCount(count)}
      </span>
    </div>
  );
}
