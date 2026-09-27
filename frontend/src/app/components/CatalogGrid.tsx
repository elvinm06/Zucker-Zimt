'use client';

import { filterProducts } from '@/lib/catalog';
import type { Product } from '@/types/product';
import { Cake, Search } from './icons';
import { useSiteLang } from './LocaleProvider';
import { useSearch } from './SearchProvider';
import ProductCard from './ProductCard';

function EmptyState({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-line bg-cream-50/70 p-10 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-line text-chocolate-400">
        {icon}
      </span>
      <p className="mt-5 font-display text-2xl text-primary">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
    </div>
  );
}

export default function CatalogGrid({ products }: { products: Product[] }) {
  const { t } = useSiteLang();
  const { query } = useSearch();

  const visible = filterProducts(products, query);

  // No products at all — the catalogue itself is empty.
  if (products.length === 0) {
    return (
      <EmptyState
        icon={<Cake className="h-6 w-6" />}
        title={t.catalogEmptyTitle}
        text={t.catalogEmptyText}
      />
    );
  }

  // Products exist, but the search matched none.
  if (visible.length === 0) {
    return (
      <EmptyState
        icon={<Search className="h-6 w-6" />}
        title={t.searchNoResults(query.trim())}
        text={t.catalogEmptyText}
      />
    );
  }

  return (
    <div
      // Re-run the reveals whenever the filtered set changes.
      key={query.trim().toLowerCase()}
      className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8"
    >
      {visible.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
