'use client';

import Link from 'next/link';
import { useSiteLang } from '../components/LocaleProvider';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { ArrowLeft } from '../components/icons';
import LogoMark from '../components/LogoMark';

export default function NotFound() {
  // not-found receives no route params, so the language comes from the
  // provider the layout set up.
  const { t } = useSiteLang();
  return (
    <main className="flex min-h-screen flex-col">
      <Header />

      <div className="wrap flex flex-1 flex-col items-center justify-center py-24 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full border border-line text-chocolate-400">
          <LogoMark className="h-10 w-10" />
        </span>
        <p className="label-mono mt-8">404</p>
        <h1 className="mt-4 max-w-2xl text-display-md font-medium text-primary">
          {t.notFoundTitle}
        </h1>
        <p className="mt-5 max-w-md text-pretty leading-relaxed text-muted">
          {t.notFoundText}
        </p>
        <Link href="/#katalog" className="btn-primary mt-10">
          <ArrowLeft className="h-4 w-4" />
          {t.notFoundCta}
        </Link>
      </div>

      <Footer />
    </main>
  );
}
