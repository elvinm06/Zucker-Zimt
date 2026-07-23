'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiError, adminApi, tokenStore } from '@/lib/api';
import type { ProductPayload } from '@/types/product';
import ProductForm from '@/app/components/ProductForm';
import { useAdminLang } from '@/app/components/AdminLangProvider';

export default function NewProductPage() {
  const router = useRouter();
  const { t } = useAdminLang();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tokenStore.get()) router.replace('/login');
  }, [router]);

  async function handleSubmit(payload: ProductPayload) {
    setSubmitting(true);
    setError(null);
    try {
      await adminApi.createProduct(payload);
      // Stay disabled while navigating so the cake can't be created twice.
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

      <ProductForm
        editing={null}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/dashboard')}
        submitting={submitting}
      />
    </div>
  );
}
