import Link from 'next/link';
import { getDictionary } from '@/lib/locale';
import Footer from './components/Footer';
import Header from './components/Header';

export default function NotFound() {
  const t = getDictionary();
  return (
    <main className="flex min-h-screen flex-col">
      <Header />

      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-5 py-24 text-center">
        <span className="text-6xl">🍰</span>
        <h1 className="mt-6 text-3xl font-semibold text-primary sm:text-4xl">
          {t.notFoundTitle}
        </h1>
        <p className="mt-4 leading-relaxed text-muted">
          {t.notFoundText}
        </p>
        <Link href="/#katalog" className="btn-primary mt-9">
          {t.notFoundCta}
        </Link>
      </div>

      <Footer />
    </main>
  );
}
