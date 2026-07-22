'use client';

import { motion } from 'framer-motion';
import type { Product } from '@/types/product';
import { useSiteLang } from './LocaleProvider';
import { useSearch } from './SearchProvider';
import ProductCard from './ProductCard';

/** Container variant so the cards appear one after another. */
const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

export default function CatalogGrid({ products }: { products: Product[] }) {
  const { t } = useSiteLang();
  const { query } = useSearch();

  const q = query.trim().toLowerCase();
  const visible = q
    ? products.filter((p) => p.name.toLowerCase().includes(q))
    : products;

  // No products at all — the catalogue itself is empty.
  if (products.length === 0) {
    return (
      <div className="card mx-auto max-w-md p-10 text-center">
        <span className="text-4xl">🍰</span>
        <p className="mt-4 font-display text-lg text-primary">
          {t.catalogEmptyTitle}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {t.catalogEmptyText}
        </p>
      </div>
    );
  }

  // Products exist, but the search matched none.
  if (visible.length === 0) {
    return (
      <div className="card mx-auto max-w-md p-10 text-center">
        <span className="text-4xl">🔍</span>
        <p className="mt-4 font-display text-lg text-primary">
          {t.searchNoResults(query.trim())}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {t.catalogEmptyText}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      // Re-run the stagger whenever the filtered set changes.
      key={q}
      variants={gridVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"
    >
      {visible.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </motion.div>
  );
}
