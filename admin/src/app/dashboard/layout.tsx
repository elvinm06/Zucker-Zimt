'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, tokenStore } from '@/lib/api';
import LogoMark from '../components/LogoMark';
import { useAdminLang } from '../components/AdminLangProvider';
import LangSwitch from '../components/LangSwitch';

/**
 * Shared chrome for every admin page: the sticky header with brand, language
 * switch and logout. Pages render below it, so the create/edit pages get the
 * same frame as the dashboard without duplicating it.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { t } = useAdminLang();
  const [brandName, setBrandName] = useState('Bakery');

  const logout = useCallback(() => {
    tokenStore.clear();
    router.replace('/login');
  }, [router]);

  // GET /settings is public; on failure the fallback name simply stays.
  useEffect(() => {
    adminApi
      .getSettings()
      .then((settings) => settings.name && setBrandName(settings.name))
      .catch(() => undefined);
  }, []);

  return (
    <main className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 border-b border-cream-300/70 bg-cream-50/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="block h-10 w-10 shrink-0 text-chocolate-500">
              <LogoMark className="h-full w-full" />
            </span>
            <div className="leading-tight">
              <p className="font-display text-lg font-semibold text-primary">
                {brandName}
              </p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
                {t.administration}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LangSwitch />
            <button onClick={logout} className="btn-ghost px-5 py-2.5 text-sm">
              {t.logout}
            </button>
          </div>
        </div>
      </header>

      {children}
    </main>
  );
}
