'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/config';
import { ApiError, adminApi, tokenStore } from '@/lib/api';
import type { Product } from '@/types/product';
import SettingsForm from '../components/SettingsForm';
import { useAdminLang } from '../components/AdminLangProvider';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { t } = useAdminLang();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'products' | 'settings'>('products');

  const logout = useCallback(() => {
    tokenStore.clear();
    router.replace('/login');
  }, [router]);

  const load = useCallback(async () => {
    try {
      setProducts(await adminApi.listProducts());
      setError(null);
    } catch (err) {
      // An expired or invalid token sends the user back to the login page.
      if (err instanceof ApiError && err.status === 401) return logout();
      setError(err instanceof Error ? err.message : t.loadFailed);
    } finally {
      setLoading(false);
    }
    // `t` is a dependency because the fallback message is translated.
  }, [logout, t]);

  useEffect(() => {
    if (!tokenStore.get()) {
      router.replace('/login');
      return;
    }
    load();
  }, [load, router]);

  async function handleDelete(product: Product) {
    if (!confirm(t.confirmDelete(product.name))) return;
    try {
      await adminApi.deleteProduct(product.id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.deleteFailed);
    }
  }

  const visibleCount = products.filter((p) => p.is_active).length;

  return (
    <>
      {/* Sticky under the header: tab switching and creating a new cake stay
          reachable however far down the list the user has scrolled. */}
      <div className="sticky top-[73px] z-20 border-b border-cream-300/50 bg-surface/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div className="inline-flex gap-1 rounded-full border border-cream-300/80 bg-cream-100/70 p-1">
            {(['products', 'settings'] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300 ${
                  tab === key ? 'text-cream-50' : 'text-muted hover:text-primary'
                }`}
              >
                {tab === key && (
                  <motion.span
                    layoutId="admin-tab-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-chocolate-gradient shadow-soft"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {key === 'products' ? t.tabProducts : t.tabSettings}
              </button>
            ))}
          </div>

          {tab === 'products' && (
            <Link
              href="/dashboard/products/new"
              className="btn-primary px-5 py-2 text-sm"
            >
              <span aria-hidden>+</span>
              {t.formNewTitle}
            </Link>
          )}
        </div>
      </div>

      {tab === 'settings' ? (
        <div className="mx-auto max-w-3xl px-5 py-8">
          <SettingsForm />
        </div>
      ) : (
      <section className="mx-auto max-w-6xl space-y-5 px-5 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="card p-5">
            <p className="font-display text-3xl font-semibold text-primary">
              {products.length}
            </p>
            <p className="mt-1 text-sm text-muted">{t.statTotal}</p>
          </div>
          <div className="card p-5">
            <p className="font-display text-3xl font-semibold text-primary">
              {visibleCount}
            </p>
            <p className="mt-1 text-sm text-muted">{t.statVisible}</p>
          </div>
          <div className="card p-5">
            <p className="font-display text-3xl font-semibold text-primary">
              {products.length - visibleCount}
            </p>
            <p className="mt-1 text-sm text-muted">{t.statHidden}</p>
          </div>
        </div>

        {error && (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-inset ring-red-100">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-muted">{t.loading}</p>
        ) : products.length === 0 ? (
          <div className="card p-10 text-center">
            <span className="text-4xl">🎂</span>
            <p className="mt-4 font-display text-lg text-primary">
              {t.emptyTitle}
            </p>
            <p className="mt-2 text-sm text-muted">{t.emptyText}</p>
            <Link
              href="/dashboard/products/new"
              className="btn-primary mt-6 px-6 py-2.5 text-sm"
            >
              <span aria-hidden>+</span>
              {t.formNewTitle}
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {products.map((product) => (
              <li
                key={product.id}
                className="card flex flex-wrap items-center gap-4 p-4 transition-shadow hover:shadow-lift"
              >
                <div
                  className="h-16 w-16 shrink-0 rounded-2xl bg-cream-200 bg-cover bg-center ring-1 ring-inset ring-cream-300"
                  style={
                    product.images?.[0]
                      ? { backgroundImage: `url(${product.images[0]})` }
                      : undefined
                  }
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-primary">
                    {product.name}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">
                    {formatPrice(product.price)} ·{' '}
                    {product.allergens?.length ?? 0} {t.allergensCount}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs ring-1 ring-inset ${
                    product.is_active
                      ? 'bg-green-50 text-green-800 ring-green-200'
                      : 'bg-cream-200 text-chocolate-500 ring-cream-300'
                  }`}
                >
                  {product.is_active ? t.visible : t.hidden}
                </span>

                <div className="flex gap-1">
                  <Link
                    href={`/dashboard/products/${product.id}`}
                    className="rounded-xl px-3 py-2 text-sm text-primary transition hover:bg-cream-200"
                  >
                    {t.edit}
                  </Link>
                  <button
                    onClick={() => handleDelete(product)}
                    className="rounded-xl px-3 py-2 text-sm text-red-700 transition hover:bg-red-50"
                  >
                    {t.remove}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      )}
    </>
  );
}
