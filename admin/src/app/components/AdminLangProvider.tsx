'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { DICTIONARIES, type AdminLang } from '@/lib/admin-i18n';

const STORAGE_KEY = 'bakery_admin_lang';

interface AdminLangValue {
  lang: AdminLang;
  setLang: (lang: AdminLang) => void;
  t: (typeof DICTIONARIES)['de'];
}

const AdminLangContext = createContext<AdminLangValue | null>(null);

export function AdminLangProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Always start on 'de' so server and client markup match; the stored
  // preference is applied in the effect below, after hydration.
  const [lang, setLangState] = useState<AdminLang>('de');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'de' || stored === 'en') setLangState(stored);
  }, []);

  // Keep the document language in sync for screen readers and spellcheck.
  useEffect(() => {
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = 'de';
    };
  }, [lang]);

  const setLang = useCallback((next: AdminLang) => {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo(
    () => ({ lang, setLang, t: DICTIONARIES[lang] }),
    [lang, setLang],
  );

  return (
    <AdminLangContext.Provider value={value}>
      {children}
    </AdminLangContext.Provider>
  );
}

export function useAdminLang() {
  const ctx = useContext(AdminLangContext);
  if (!ctx) {
    throw new Error('useAdminLang must be used inside <AdminLangProvider>');
  }
  return ctx;
}
