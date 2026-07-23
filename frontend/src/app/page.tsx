import { getProducts } from '@/lib/api';
import { getDictionary } from '@/lib/locale';
import type { Product } from '@/types/product';
import CatalogGrid from './components/CatalogGrid';
import { SearchProvider } from './components/SearchProvider';
import ContactCTA from './components/ContactCTA';
import FeatureStrip from './components/FeatureStrip';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import CakeCutScene from './components/motion/CakeCutScene';
import IntroLoader from './components/motion/IntroLoader';
import Reveal from './components/motion/Reveal';
import SplitText from './components/motion/SplitText';
import VelocityMarquee from './components/motion/VelocityMarquee';

/**
 * Server Component — products are fetched on the server (better SEO and a
 * faster first paint); the interactive part (grid + modal) is a client child.
 */
export default async function HomePage() {
  const t = getDictionary();
  let products: Product[] = [];
  let failed = false;

  try {
    products = await getProducts();
  } catch {
    // Keep the page alive when the backend is down: show a notice instead.
    failed = true;
  }

  return (
    <SearchProvider>
    <main className="min-h-screen">
      <IntroLoader />
      <Header />
      <Hero />
      <FeatureStrip />
      <VelocityMarquee />

      <section id="katalog" className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <div className="mb-14 text-center">
          <Reveal direction="none">
            <span className="eyebrow">{t.catalogEyebrow}</span>
          </Reveal>
          <h2 className="mt-5 text-3xl font-semibold text-primary sm:text-4xl">
            <SplitText text={t.catalogTitle} />
          </h2>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
              {t.catalogLead}
            </p>
          </Reveal>
        </div>

        {failed ? (
          <div className="card mx-auto max-w-md p-10 text-center">
            <span className="text-4xl">🥐</span>
            <p className="mt-4 font-display text-lg text-primary">
              {t.catalogDownTitle}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {t.catalogDownText}
            </p>
          </div>
        ) : (
          <CatalogGrid products={products} />
        )}
      </section>

      {/* Signature moment: the cake gets cut on scroll. */}
      <div className="mx-auto flex max-w-6xl justify-center px-5">
        <CakeCutScene className="w-64 sm:w-80" />
      </div>

      <HowItWorks />
      <ContactCTA />
      <Footer />
    </main>
    </SearchProvider>
  );
}
