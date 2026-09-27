import type { Product } from '@/types/product';

/** Case-insensitive name filter shared by the grid and its toolbar. */
export function filterProducts(products: Product[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((product) => product.name.toLowerCase().includes(q));
}
