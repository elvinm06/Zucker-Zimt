'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ApiError, adminApi, tokenStore } from '@/lib/api';
import type { Product, ProductPayload } from '@/types/product';
import ProductForm from '@/app/components/ProductForm';
import { useAdminLang } from '@/app/components/AdminLangProvider';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { t } = useAdminLang();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tokenStore.get()) {
      router.replace('/login');
      return;
    }
    adminApi
      .getProduct(id)
      .then(setProduct)
      .catch((err) =>
        setError(err instanceof Error ? err.message : t.loadFailed),
      )
      .finally(() => setLoading(false));
    // `t` is a dependency because the fallback message is translated.
  }, [id, router, t]);

  async function handleSubmit(payload: ProductPayload) {
    if (!product) return;
    setSubmitting(true);
    setError(null);
    try {
      await adminApi.updateProduct(product.id, payload);
      // Stay disabled while navigating so the update can't be sent twice.
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        tokenStore.clear();
        router.replace('/login');
        return;
      }
      setError(err instanceof Error ? err.message : t.saveFailed);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-5 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-primary"
      >
        <span aria-hidden>←</span>
        {t.backToOverview}
      </Link>

      {error && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-inset ring-red-100">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-muted">{t.loading}</p>
      ) : product ? (
        <ProductForm
          editing={product}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/dashboard')}
          submitting={submitting}
        />
      ) : (
        !error && <p className="text-muted">{t.productNotFound}</p>
      )}
    </div>
  );
}
